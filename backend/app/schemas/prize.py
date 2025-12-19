from typing import Optional
from pydantic import BaseModel, Field

class PrizeBase(BaseModel):
    place: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None

class PrizeCreate(PrizeBase):
    pass

class PrizeUpdate(BaseModel):
    place: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None

class PrizeResponse(PrizeBase):
    id: int
    organization_id: int

    class Config:
        from_attributes = True
