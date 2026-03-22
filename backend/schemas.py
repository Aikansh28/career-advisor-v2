from typing import List, Optional
from pydantic import BaseModel

class StudentProfile(BaseModel):
    education: Optional[str] = ""
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    subjects: Optional[List[str]] = []
    goals: Optional[str] = ""
