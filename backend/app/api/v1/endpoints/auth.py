"""
Authentication endpoints for admin login.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
import re

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest
from app.models.user import User
from app.models.organization import Organization


router = APIRouter(prefix='/auth', tags=['authentication'])

def slugify(text: str) -> str:
    return re.sub(r'[\W_]+', '-', text.lower()).strip('-')

@router.post('/register', response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new business and admin user.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create organization
    slug = slugify(data.business_name)
    # Ensure slug is unique
    base_slug = slug
    counter = 1
    while db.query(Organization).filter(Organization.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    organization = Organization(
        name=data.business_name,
        slug=slug
    )
    db.add(organization)
    db.commit()
    db.refresh(organization)
    
    # Create admin user
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        organization_id=organization.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id), "org_id": user.organization_id})
    
    return TokenResponse(access_token=access_token)


@router.post('/login', response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Admin login endpoint.
    """
    # Find user in database
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with user ID and organization ID
    access_token = create_access_token(data={"sub": str(user.id), "org_id": user.organization_id})
    
    return TokenResponse(access_token=access_token)
