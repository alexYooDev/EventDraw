""" 
Pydantic schemas for Customer API.
These define the structure of data for requests and responses.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

class CustomerBase(BaseModel):
    """ 
    Base schema for shared attributes.
    """
    name: str = Field(..., min_length=1, max_length=255, description="Customer's full name")
    email: EmailStr = Field(..., description="Customer's email address")
    feedback: str = Field(..., min_length=1, description="Customer's feedback")

class CustomerCreate(CustomerBase):
    """ 
    Schema for creating a new customer.
    Used for POST requests.
    """
    organization_slug: str = Field(..., description="The unique slug of the organization")

class CustomerUpdate(CustomerBase):
    """ 
    Schema for updating an existing customer.
    Used for PUT requests. All fields are optional.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    feedback: Optional[str] = Field(None, min_length=1)
    is_winner: Optional[bool] = None

class CustomerResponse(CustomerBase):
    """
    Schema for customer responses.
    Include all database fields.
    """
    id: int
    winner_place: Optional[int] = None
    is_winner: bool
    is_notified: bool
    notified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Allow creation from SQLAlchemy models

    
class CustomerListResponse(BaseModel):
    """
    Schema for list of customers.
    """
    total: int
    customers: list[CustomerResponse]