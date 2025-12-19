"""
Customer API endpoint
These handle HTTP requests for customer operations.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.organization import Organization
from app.core.rate_limit import limiter
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerListResponse,
    CustomerUpdate
)

from app.schemas.notification import (
    WinnerNotification,
    NotificationResponse
)

# Create router with prefix and tags for organization
router = APIRouter(prefix='/customers', tags=['customers'])

@router.post('/', response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")  # Limit to 10 customer submissions per minute
def create_customer(
    request: Request,
    customer_data: CustomerCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new customer entry.
    
    Rate limited to 10 submissions per minute to prevent spam.
    
    - name: customer's full name
    - email: customer's email address (must be unique)
    - feedback: customer's feedback
    - organization_slug: The slug of the business
    """
    # Find organization by slug
    org = db.query(Organization).filter(Organization.slug == customer_data.organization_slug).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )

    repo = CustomerRepository(db, organization_id=org.id)

    # Check if email already exists for this organization
    existing_customer = repo.get_by_email(customer_data.email)
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered for this draw"
        )

    return repo.create(customer_data, org_id=org.id)

@router.get('/', response_model=CustomerListResponse)
def get_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a list of customers for the current organization.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)
    customers = repo.get_all(skip=skip, limit=limit)
    total = repo.get_count()

    return CustomerListResponse(customers=customers, total=total)

@router.get('/{customer_id}', response_model=CustomerResponse)
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a customer by ID.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)
    customer = repo.get_by_id(customer_id)
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer

@router.put('/{customer_id}', response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing customer entry.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)

    # If email is being updated, check if it's already taken in this org
    if customer_data.email:
        existing = repo.get_by_email(customer_data.email)
        if existing and existing.id != customer_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    customer = repo.update(customer_id, customer_data)

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return customer

@router.delete('/{customer_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a customer.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)
    success = repo.delete(customer_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Customer not found'
        )


@router.get('/winner/random', response_model=CustomerResponse)
def get_random_winner(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a random customer who hasn't won yet from the current organization.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)
    winner = repo.get_random_non_winner()

    if not winner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No eligible customers found"
        )
    
    return winner

@router.post('/{customer_id}/mark-winner', response_model=CustomerResponse)
def mark_customer_as_winner(
    customer_id: int, 
    winner_place: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a customer as a winner.
    """
    repo = CustomerRepository(db, organization_id=current_user.organization_id)
    customer = repo.mark_as_winner(customer_id, winner_place)

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return customer


@router.post('/notify-winner', response_model=NotificationResponse)
def notify_winner(
    notification_data: WinnerNotification, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send notification to winner via email.

    Uses Resend API to send actual email notifications to winners.

    - customer_id: ID of the winner to notify
    - send_immediately: Whether to send the notification now or queue it for later
    """
    import traceback
    try:
        repo = CustomerRepository(db, organization_id=current_user.organization_id)
        customer = repo.get_by_id(notification_data.customer_id)

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )

        if not customer.is_winner:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Customer is not marked as a winner"
            )

        if notification_data.send_immediately:
            # Send email via Resend
            try:
                from app.services.email_service import EmailService
                email_service = EmailService()
                success, message = email_service.send_winner_notification(customer)
                
                if success:
                    from datetime import datetime
                    customer.is_notified = True
                    customer.notified_at = datetime.now()
                    db.commit()
                    db.refresh(customer)

                return NotificationResponse(
                    success=success,
                    message=message,
                    email_sent_to=customer.email if success else None
                )
            except ValueError as e:
                # Handle missing API key
                print(f"Email service configuration error: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Email service not configured: {str(e)}"
                )
            except Exception as e:
                # Handle other email errors
                print(f"Error in email service: {str(e)}")
                traceback.print_exc()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to send email: {str(e)}"
                )
        else:
            # Queue for later (not implemented yet)
            message = f"Winner notification queued for {customer.email}"
            return NotificationResponse(
                success=True,
                message=message,
                email_sent_to=None
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in notify_winner: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
