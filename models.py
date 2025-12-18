from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class RepoRequest(BaseModel):
    repo_url: HttpUrl
    branch: str = "main"

class TrustScoreResponse(BaseModel):
    score: int
    confidence_level: str
    breakdown: dict
    generated_at: datetime
