"""
Pydantic schemas for authentication.
"""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Schema for login request."""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"

class RegisterRequest(BaseModel):
    """Schema for organization registration."""
    business_name: str
    email: str
    password: str
