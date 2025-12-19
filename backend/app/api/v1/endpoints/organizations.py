from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_organization
from app.models.user import User
from app.models.organization import Organization
from app.models.prize import Prize
from app.schemas.organization import OrganizationResponse, OrganizationUpdate
from app.schemas.prize import PrizeResponse, PrizeCreate, PrizeUpdate

router = APIRouter(prefix='/organizations', tags=['organizations'])

@router.get('/me', response_model=OrganizationResponse)
def get_my_organization(
    org: Organization = Depends(get_current_organization)
):
    """
    Get the organization details for the current authenticated user.
    """
    return org

@router.put('/me', response_model=OrganizationResponse)
def update_my_organization(
    data: OrganizationUpdate,
    db: Session = Depends(get_db),
    org: Organization = Depends(get_current_organization)
):
    """
    Update the branding and details of the current organization.
    """
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(org, field, value)
    
    db.commit()
    db.refresh(org)
    return org

@router.get('/public/{slug}', response_model=OrganizationResponse)
def get_public_organization(slug: str, db: Session = Depends(get_db)):
    """
    Get public information about an organization by its slug.
    Used by the landing page before login.
    """
    org = db.query(Organization).filter(Organization.slug == slug).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org

# Prize Endpoints (Scoped to Organizations)

@router.get('/me/prizes', response_model=List[PrizeResponse])
def get_my_prizes(
    org: Organization = Depends(get_current_organization)
):
    """
    Get all prizes configured for the current organization.
    """
    return org.prizes

@router.get('/public/{slug}/prizes', response_model=List[PrizeResponse])
def get_public_prizes(slug: str, db: Session = Depends(get_db)):
    """
    Get public prize list for an organization.
    """
    org = db.query(Organization).filter(Organization.slug == slug).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org.prizes

@router.post('/me/prizes', response_model=PrizeResponse)
def create_prize(
    data: PrizeCreate,
    db: Session = Depends(get_db),
    org: Organization = Depends(get_current_organization)
):
    """
    Create a new prize for the organization.
    """
    prize = Prize(**data.model_dump(), organization_id=org.id)
    db.add(prize)
    db.commit()
    db.refresh(prize)
    return prize

@router.put('/me/prizes/{prize_id}', response_model=PrizeResponse)
def update_prize(
    prize_id: int,
    data: PrizeUpdate,
    db: Session = Depends(get_db),
    org: Organization = Depends(get_current_organization)
):
    """
    Update a specific prize.
    """
    prize = db.query(Prize).filter(Prize.id == prize_id, Prize.organization_id == org.id).first()
    if not prize:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prize not found"
        )
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prize, field, value)
    
    db.commit()
    db.refresh(prize)
    return prize

@router.delete('/me/prizes/{prize_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_prize(
    prize_id: int,
    db: Session = Depends(get_db),
    org: Organization = Depends(get_current_organization)
):
    """
    Delete a prize.
    """
    prize = db.query(Prize).filter(Prize.id == prize_id, Prize.organization_id == org.id).first()
    if not prize:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prize not found"
        )
    db.delete(prize)
    db.commit()
