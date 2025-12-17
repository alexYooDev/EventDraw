"""
Authentication endpoints for admin login.
"""
from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.schemas.auth import LoginRequest, TokenResponse


router = APIRouter(prefix='/auth', tags=['authentication'])


@router.post('/login', response_model=TokenResponse)
def login(credentials: LoginRequest):
    """
    Admin login endpoint.
    
    Validates password and returns JWT access token.
    No database required - uses hashed password from environment variable.
    """
    # Check if admin password is configured
    if not settings.ADMIN_PASSWORD_HASH:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin password not configured"
        )
    
    # Verify password
    if not verify_password(credentials.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": "admin"})
    
    return TokenResponse(access_token=access_token)
