from fastapi import FastAPI, APIRouter, Request, HTTPException, Response, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
import uuid
import hashlib
from typing import Optional, List, Dict, Any
import io

# Import models and utilities
from models import *
from auth import get_current_user
from audit import AuditTrail
from emergentintegrations.llm.chat import LlmChat, UserMessage
from curriculum_processor import CurriculumProcessor
from student_importer import StudentImporter

# PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize audit trail
audit_trail = AuditTrail(db)

# Initialize processors
curriculum_processor = CurriculumProcessor()
student_importer = StudentImporter()

# LLM API Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI()

# Create API router
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============= AUTH ENDPOINTS =============

@api_router.post("/auth/session")
async def create_session(request: Request):
    """Process session_id from Emergent Auth and create session"""
    try:
        session_id = request.headers.get("X-Session-ID")
        if not session_id:
            raise HTTPException(status_code=400, detail="Missing session_id")
        
        # Call Emergent Auth API
        import httpx
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            user_data = response.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"_id": user_data["id"]})
        
        if not existing_user:
            # Create new user with default role (will be assigned later)
            user_doc = {
                "_id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data.get("picture"),
                "role": "teacher",  # Default role
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        # Create session
        session_token = user_data["session_token"]
        session_doc = {
            "user_id": user_data["id"],
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        
        # Convert datetime to ISO string
        session_doc["expires_at"] = session_doc["expires_at"].isoformat()
        session_doc["created_at"] = session_doc["created_at"].isoformat()
        
        await db.user_sessions.insert_one(session_doc)
        
        # Log audit
        await audit_trail.log_action("user_login", user_data["id"], {"email": user_data["email"]})
        
        return {
            "session_token": session_token,
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "picture": user_data.get("picture")
            }
        }
    
    except Exception as e:
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_current_user_endpoint(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request, db)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request):
    """Logout user and delete session"""
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    return {"message": "Logged out successfully"}

# ============= SCHOOL SETUP ENDPOINTS =============

@api_router.post("/school/setup")
async def setup_school(school_data: SchoolSetupRequest, request: Request):
    """Initial school setup"""
    user = await get_current_user(request, db)
    
    # Create school
    school_doc = {
        "id": str(uuid.uuid4()),
        "district_name": school_data.district_name,
        "school_name": school_data.school_name,
        "address": school_data.address,
        "academic_year": school_data.academic_year,
        "logo_url": None,
        "principal_id": user["id"],
        "settings": {
            "qualifiers": [
                {"code": "D", "name": "Developing", "description": "Student is working toward mastery"},
                {"code": "M", "name": "Mastered", "description": "Student has demonstrated understanding"},
                {"code": "I", "name": "Integrated", "description": "Student can apply concept independently"}
            ],
            "ai_recommendation_level": "standard"
        },
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.schools.insert_one(school_doc)
    
    # Update user role to principal
    await db.users.update_one(
        {"_id": user["id"]},
        {"$set": {"role": "principal"}}
    )
    
    # Create staff record for principal
    staff_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "school_id": school_doc["id"],
        "role": "principal",
        "subjects": [],
        "grades": [],
        "access_level": {"full_access": True},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.staff.insert_one(staff_doc)
    
    # Log audit
    await audit_trail.log_action("school_created", user["id"], school_doc)
    
    return {"school_id": school_doc["id"], "message": "School setup completed"}

@api_router.get("/school/info")
async def get_school_info(request: Request):
    """Get school information"""
    user = await get_current_user(request, db)
    
    # Get user's school
    school = await db.schools.find_one({"principal_id": user["id"]})
    if not school:
        # Check if user is staff
        staff = await db.staff.find_one({"user_id": user["id"]})
        if staff:
            school = await db.schools.find_one({"id": staff["school_id"]})
    
    if not school:
        return None
    
    school.pop("_id", None)
    return school

# ============= STUDENT MANAGEMENT =============

@api_router.post("/students")
async def create_student(student_data: StudentCreate, request: Request):
    """Create a new student"""
    user = await get_current_user(request, db)
    
    # Get school
    staff = await db.staff.find_one({"user_id": user["id"]})
    if not staff:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    student_doc = {
        "id": str(uuid.uuid4()),
        "name": student_data.name,
        "grade": student_data.grade,
        "homeroom": student_data.homeroom,
        "has_iep": student_data.has_iep,
        "iep_details": student_data.iep_details,
        "school_id": staff["school_id"],
        "parent_ids": [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.students.insert_one(student_doc)
    await audit_trail.log_action("student_created", user["id"], {"student_id": student_doc["id"]})
    
    return {"student_id": student_doc["id"], "message": "Student created"}

@api_router.get("/students")
async def get_students(request: Request, grade: Optional[str] = None):
    """Get students list"""
    user = await get_current_user(request, db)
    
    staff = await db.staff.find_one({"user_id": user["id"]})
    if not staff:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {"school_id": staff["school_id"]}
    if grade:
        query["grade"] = grade
    
    students = await db.students.find(query, {"_id": 0}).to_list(1000)
    return students

@api_router.get("/students/{student_id}")
async def get_student(student_id: str, request: Request):
    """Get student details"""
    user = await get_current_user(request, db)
    
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return student

# ============= INFERENCE MANAGEMENT =============

@api_router.post("/inferences")
async def create_inference(request: Request):
    """Create custom inference"""
    user = await get_current_user(request, db)
    data = await request.json()
    
    staff = await db.staff.find_one({"user_id": user["id"]})
    if not staff:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    inference_doc = {
        "id": str(uuid.uuid4()),
        "subject_id": data["subject_id"],
        "grade": data["grade"],
        "description": data["description"],
        "type": "custom",
        "created_by": user["id"],
        "is_custom": True,
        "school_id": staff["school_id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.inferences.insert_one(inference_doc)
    await audit_trail.log_action("inference_created", user["id"], {"inference_id": inference_doc["id"]})
    
    return {"inference_id": inference_doc["id"]}

@api_router.get("/inferences")
async def get_inferences(request: Request, subject_id: Optional[str] = None, grade: Optional[str] = None):
    """Get inferences"""
    user = await get_current_user(request, db)
    
    staff = await db.staff.find_one({"user_id": user["id"]})
    if not staff:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    query = {"school_id": staff["school_id"]}
    if subject_id:
        query["subject_id"] = subject_id
    if grade:
        query["grade"] = grade
    
    inferences = await db.inferences.find(query, {"_id": 0}).to_list(1000)
    return inferences

# ============= OBSERVATIONS =============

@api_router.post("/observations")
async def create_observation(obs_data: ObservationCreate, request: Request):
    """Record an observation"""
    user = await get_current_user(request, db)
    
    obs_doc = {
        "id": str(uuid.uuid4()),
        "student_id": obs_data.student_id,
        "inference_id": obs_data.inference_id,
        "qualifier": obs_data.qualifier,
        "teacher_id": user["id"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "notes": obs_data.notes,
        "context": obs_data.context
    }
    
    await db.observations.insert_one(obs_doc)
    await audit_trail.log_action("observation_recorded", user["id"], 
                                 {"student_id": obs_data.student_id, "inference_id": obs_data.inference_id})
    
    return {"observation_id": obs_doc["id"]}

@api_router.get("/observations/{student_id}")
async def get_student_observations(student_id: str, request: Request):
    """Get student observations"""
    user = await get_current_user(request, db)
    
    observations = await db.observations.find(
        {"student_id": student_id},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(1000)
    
    return observations

# ============= ATTENDANCE =============

@api_router.post("/attendance")
async def record_attendance(att_data: AttendanceCreate, request: Request):
    """Record attendance"""
    user = await get_current_user(request, db)
    
    # Parse date
    try:
        att_date = datetime.fromisoformat(att_data.date)
    except:
        att_date = datetime.now(timezone.utc)
    
    att_doc = {
        "id": str(uuid.uuid4()),
        "student_id": att_data.student_id,
        "date": att_date.isoformat(),
        "status": att_data.status,
        "time_arrived": att_data.time_arrived,
        "notes": att_data.notes,
        "recorded_by": user["id"]
    }
    
    await db.attendance.insert_one(att_doc)
    return {"attendance_id": att_doc["id"]}

@api_router.get("/attendance/{student_id}")
async def get_student_attendance(student_id: str, request: Request):
    """Get student attendance records"""
    user = await get_current_user(request, db)
    
    attendance = await db.attendance.find(
        {"student_id": student_id},
        {"_id": 0}
    ).sort("date", -1).to_list(1000)
    
    return attendance

# ============= LAYA AI CHAT =============

@api_router.post("/chat")
async def chat_with_laya(chat_req: ChatRequest, request: Request):
    """Chat with Laya AI assistant"""
    user = await get_current_user(request, db)
    
    # Get or create session
    session_id = chat_req.session_id or str(uuid.uuid4())
    
    chat_session = await db.chat_sessions.find_one({"session_id": session_id})
    
    if not chat_session:
        chat_session = {
            "session_id": session_id,
            "user_id": user["id"],
            "messages": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_sessions.insert_one(chat_session)
    
    # Add user message to history
    user_message = {
        "role": "user",
        "content": chat_req.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Get context about user
    school = None
    staff = await db.staff.find_one({"user_id": user["id"]})
    if staff:
        school = await db.schools.find_one({"id": staff["school_id"]})
    
    # Build system message with context
    system_message = f"""You are Laya, the friendly AI assistant for LPAI (Learning Progress AI).
You help educators with setting up their school, managing students, recording observations, and generating reports.

Current user: {user['name']} ({user['role']})
School: {school['school_name'] if school else 'Not set up yet'}

Be conversational, ask one question at a time, and confirm each answer before proceeding.
"""
    
    # Initialize LLM chat
    try:
        llm_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model("anthropic", "claude-4-sonnet-20250514")
        
        message = UserMessage(text=chat_req.message)
        response_text = await llm_chat.send_message(message)
        
        # Add assistant response to history
        assistant_message = {
            "role": "assistant",
            "content": response_text,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Update session
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$push": {"messages": {"$each": [user_message, assistant_message]}},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
        
        return {
            "session_id": session_id,
            "response": response_text
        }
    
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# ============= REPORTS =============

@api_router.get("/reports/student/{student_id}/pdf")
async def generate_student_report_pdf(student_id: str, request: Request):
    """Generate student report as PDF"""
    user = await get_current_user(request, db)
    
    # Get student
    student = await db.students.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get observations
    observations = await db.observations.find({"student_id": student_id}).to_list(1000)
    
    # Get attendance
    attendance = await db.attendance.find({"student_id": student_id}).to_list(1000)
    
    # Create PDF
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
    )
    story.append(Paragraph(f"Student Report: {student['name']}", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Student Info
    story.append(Paragraph(f"<b>Grade:</b> {student['grade']}", styles['Normal']))
    story.append(Paragraph(f"<b>Homeroom:</b> {student.get('homeroom', 'N/A')}", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    # Observations Summary
    story.append(Paragraph("<b>Observations Summary</b>", styles['Heading2']))
    qualifier_counts = {"D": 0, "M": 0, "I": 0}
    for obs in observations:
        qualifier_counts[obs["qualifier"]] += 1
    
    story.append(Paragraph(f"Developing (D): {qualifier_counts['D']}", styles['Normal']))
    story.append(Paragraph(f"Mastered (M): {qualifier_counts['M']}", styles['Normal']))
    story.append(Paragraph(f"Integrated (I): {qualifier_counts['I']}", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    # Attendance Summary
    story.append(Paragraph("<b>Attendance Summary</b>", styles['Heading2']))
    present_count = len([a for a in attendance if a["status"] == "present"])
    total_days = len(attendance)
    if total_days > 0:
        attendance_rate = (present_count / total_days) * 100
        story.append(Paragraph(f"Attendance Rate: {attendance_rate:.1f}%", styles['Normal']))
        story.append(Paragraph(f"Days Present: {present_count}/{total_days}", styles['Normal']))
    
    doc.build(story)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{student['name']}.pdf"}
    )

@api_router.get("/reports/student/{student_id}/html")
async def generate_student_report_html(student_id: str, request: Request):
    """Generate student report as HTML"""
    user = await get_current_user(request, db)
    
    # Get student
    student = await db.students.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get observations
    observations = await db.observations.find({"student_id": student_id}).to_list(1000)
    
    # Get attendance
    attendance = await db.attendance.find({"student_id": student_id}).to_list(1000)
    
    # Calculate stats
    qualifier_counts = {"D": 0, "M": 0, "I": 0}
    for obs in observations:
        qualifier_counts[obs["qualifier"]] += 1
    
    present_count = len([a for a in attendance if a["status"] == "present"])
    total_days = len(attendance)
    attendance_rate = (present_count / total_days * 100) if total_days > 0 else 0
    
    return {
        "student": {
            "name": student["name"],
            "grade": student["grade"],
            "homeroom": student.get("homeroom")
        },
        "observations": {
            "total": len(observations),
            "developing": qualifier_counts["D"],
            "mastered": qualifier_counts["M"],
            "integrated": qualifier_counts["I"]
        },
        "attendance": {
            "total_days": total_days,
            "present": present_count,
            "rate": attendance_rate
        }
    }

# ============= DASHBOARD STATS =============

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(request: Request):
    """Get dashboard statistics"""
    user = await get_current_user(request, db)
    
    staff = await db.staff.find_one({"user_id": user["id"]})
    if not staff:
        return {"students": 0, "observations": 0, "reports": 0}
    
    student_count = await db.students.count_documents({"school_id": staff["school_id"]})
    observation_count = await db.observations.count_documents({"teacher_id": user["id"]})
    
    return {
        "students": student_count,
        "observations": observation_count,
        "reports": 0
    }

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
