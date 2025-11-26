import csv
import io
from typing import List, Dict, Any
import openpyxl

class StudentImporter:
    """Import students from CSV or Excel files"""
    
    def parse_csv(self, file_content: bytes) -> List[Dict[str, Any]]:
        """Parse CSV file and extract student data"""
        try:
            text = file_content.decode('utf-8')
            reader = csv.DictReader(io.StringIO(text))
            students = []
            
            for row in reader:
                student = {
                    "name": row.get('name', row.get('Name', row.get('student_name', ''))).strip(),
                    "grade": row.get('grade', row.get('Grade', '')).strip(),
                    "homeroom": row.get('homeroom', row.get('Homeroom', row.get('class', ''))).strip(),
                    "has_iep": row.get('iep', row.get('IEP', 'false')).lower() in ['true', 'yes', '1']
                }
                
                if student['name']:  # Only add if name exists
                    students.append(student)
            
            return students
        except Exception as e:
            raise Exception(f"Error parsing CSV: {str(e)}")
    
    def parse_excel(self, file_content: bytes) -> List[Dict[str, Any]]:
        """Parse Excel file and extract student data"""
        try:
            workbook = openpyxl.load_workbook(io.BytesIO(file_content))
            sheet = workbook.active
            students = []
            
            # Get headers from first row
            headers = []
            for cell in sheet[1]:
                headers.append(cell.value.lower() if cell.value else '')
            
            # Find column indices
            name_col = self._find_column(headers, ['name', 'student_name', 'student'])
            grade_col = self._find_column(headers, ['grade', 'level'])
            homeroom_col = self._find_column(headers, ['homeroom', 'class', 'room'])
            iep_col = self._find_column(headers, ['iep', 'special_needs'])
            
            # Process rows
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if name_col is not None and row[name_col]:
                    student = {
                        "name": str(row[name_col]).strip(),
                        "grade": str(row[grade_col]).strip() if grade_col is not None and row[grade_col] else '',
                        "homeroom": str(row[homeroom_col]).strip() if homeroom_col is not None and row[homeroom_col] else '',
                        "has_iep": str(row[iep_col]).lower() in ['true', 'yes', '1'] if iep_col is not None and row[iep_col] else False
                    }
                    students.append(student)
            
            return students
        except Exception as e:
            raise Exception(f"Error parsing Excel: {str(e)}")
    
    def _find_column(self, headers: List[str], possible_names: List[str]) -> int:
        """Find column index by possible header names"""
        for i, header in enumerate(headers):
            if header in possible_names:
                return i
        return None
    
    def validate_students(self, students: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Validate student data and return statistics"""
        valid_students = []
        errors = []
        
        for i, student in enumerate(students, 1):
            if not student.get('name'):
                errors.append(f"Row {i}: Missing student name")
                continue
            
            if not student.get('grade'):
                errors.append(f"Row {i}: Missing grade for {student['name']}")
                continue
            
            valid_students.append(student)
        
        return {
            "total": len(students),
            "valid": len(valid_students),
            "errors": errors,
            "students": valid_students
        }
