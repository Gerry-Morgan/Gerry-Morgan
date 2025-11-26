from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    PRINCIPAL = "principal"
    VICE_PRINCIPAL = "vice_principal"
    DEPARTMENT_HEAD = "department_head"
    TEACHER = "teacher"
    SCHOOL_SECRETARY = "school_secretary"
    PARENT = "parent"
    STUDENT = "student"
    PARENT_NOMINEE = "parent_nominee"

class Qualifier(str, Enum):
    DEVELOPING = "D"
    MASTERED = "M"
    INTEGRATED = "I"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)
    id: str = Field(alias="_id")
    email: str
    name: str
    picture: Optional[str] = None
    role: UserRole
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class School(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    district_name: str
    school_name: str
    address: str
    academic_year: str
    logo_url: Optional[str] = None
    principal_id: str
    settings: Dict[str, Any] = {}
    created_at: datetime

class Staff(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    school_id: str
    role: UserRole
    subjects: List[str] = []
    grades: List[str] = []
    access_level: Dict[str, Any] = {}
    created_at: datetime

class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    grade: str
    homeroom: Optional[str] = None
    has_iep: bool = False
    iep_details: Dict[str, Any] = {}
    school_id: str
    parent_ids: List[str] = []
    created_at: datetime

class Subject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    grades: List[str] = []
    school_id: str
    created_at: datetime

class Inference(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    subject_id: str
    grade: str
    description: str
    type: str = "curriculum"  # curriculum or custom
    created_by: Optional[str] = None  # teacher_id if custom
    is_custom: bool = False
    school_id: str
    created_at: datetime

class Observation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    student_id: str
    inference_id: str
    qualifier: Qualifier
    teacher_id: str
    timestamp: datetime
    notes: Optional[str] = None
    context: Optional[str] = None

class Assessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    student_id: str
    subject_id: str
    assessment_type: str
    weight: float
    marks: float
    max_marks: float
    date: datetime
    teacher_id: str
    linked_inferences: List[str] = []

class Attendance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    student_id: str
    date: datetime
    status: AttendanceStatus
    time_arrived: Optional[datetime] = None
    notes: Optional[str] = None
    recorded_by: str

class Deduction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    student_id: str
    deduction_type: str
    description: str
    date: datetime
    created_by: str

class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str
    timestamp: datetime

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    user_id: str
    messages: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

class AuditLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    action: str
    user_id: str
    timestamp: datetime
    data_hash: str
    previous_hash: Optional[str] = None
    details: Dict[str, Any] = {}

# Request/Response Models
class SchoolSetupRequest(BaseModel):
    district_name: str
    school_name: str
    address: str
    academic_year: str

class StudentCreate(BaseModel):
    name: str
    grade: str
    homeroom: Optional[str] = None
    has_iep: bool = False
    iep_details: Dict[str, Any] = {}

class ObservationCreate(BaseModel):
    student_id: str
    inference_id: str
    qualifier: Qualifier
    notes: Optional[str] = None
    context: Optional[str] = None

class AttendanceCreate(BaseModel):
    student_id: str
    date: str
    status: AttendanceStatus
    time_arrived: Optional[str] = None
    notes: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
