from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import PyPDF2
import docx
import io
from typing import List, Dict, Any
import json

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

class CurriculumProcessor:
    """Process curriculum documents and extract inferences"""
    
    def __init__(self):
        self.llm_chat = None
    
    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(io.BytesIO(file_content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    def extract_text_from_txt(self, file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode('utf-8')
        except Exception as e:
            raise Exception(f"Error reading TXT: {str(e)}")
    
    async def process_curriculum_document(
        self,
        file_content: bytes,
        filename: str,
        subject: str,
        grade: str
    ) -> List[Dict[str, Any]]:
        """Process curriculum document and extract inferences"""
        
        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            text = self.extract_text_from_pdf(file_content)
        elif filename.lower().endswith('.docx'):
            text = self.extract_text_from_docx(file_content)
        elif filename.lower().endswith('.txt'):
            text = self.extract_text_from_txt(file_content)
        else:
            raise Exception("Unsupported file format. Please use PDF, DOCX, or TXT.")
        
        # Use AI to extract inferences
        system_message = """You are an expert educational curriculum analyst. 
Your task is to extract learning outcomes from curriculum documents and convert them into observable, measurable inferences.

Each inference should:
- Be specific and observable
- Use action verbs (demonstrates, identifies, solves, applies, etc.)
- Be measurable in a classroom setting
- Focus on student behaviors and outcomes

Return your response as a JSON array of objects with this structure:
{
  "description": "Observable learning outcome statement",
  "strand": "Subject area or topic",
  "level": "difficulty level (basic/intermediate/advanced)"
}"""
        
        prompt = f"""Extract observable learning inferences from this {subject} curriculum for Grade {grade}.

Curriculum Content:
{text[:8000]}

Please identify 10-15 key learning outcomes and format them as observable inferences.
Return ONLY a valid JSON array, no other text."""
        
        try:
            self.llm_chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"curriculum-{filename}",
                system_message=system_message
            ).with_model("anthropic", "claude-4-sonnet-20250514")
            
            message = UserMessage(text=prompt)
            response_text = await self.llm_chat.send_message(message)
            
            # Parse JSON response
            # Remove markdown code blocks if present
            response_text = response_text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            inferences = json.loads(response_text.strip())
            return inferences
        
        except json.JSONDecodeError as e:
            # If JSON parsing fails, try to extract inferences manually
            return self._extract_inferences_fallback(response_text)
        except Exception as e:
            raise Exception(f"Error processing curriculum: {str(e)}")
    
    def _extract_inferences_fallback(self, text: str) -> List[Dict[str, Any]]:
        """Fallback method to extract inferences from text"""
        # Simple fallback: split by lines and create basic inferences
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        inferences = []
        
        for i, line in enumerate(lines[:15]):
            if len(line) > 10:  # Ignore very short lines
                inferences.append({
                    "description": line,
                    "strand": "General",
                    "level": "intermediate"
                })
        
        return inferences if inferences else [{
            "description": "Understanding of curriculum concepts",
            "strand": "General",
            "level": "intermediate"
        }]
