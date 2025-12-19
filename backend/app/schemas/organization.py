from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class OrganizationBase(BaseModel):
    name: str
    primary_color: str = "#7c3aed"
    logo_url: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    primary_color: Optional[str] = None
    logo_url: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True
