"""
Customer API endpoint
These handle HTTP requests for customer operations.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerListResponse,
    CustomerUpdate
)

# Create router with prefix and tags for organization
router = APIRouter(prefix='/customers', tags=['customers'])

@router.post('/', response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new customer entry.
    
    - name: customer's full name
    - email: customer's email address (must be unique)
    - feedback: customer's feedback
    """
    repo = CustomerRepository(db)

    # Check if email already exists
    existing_customer = repo.get_by_email(customer_data.email)
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    return repo.create(customer_data)

@router.get('/', response_model=CustomerListResponse)
def get_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get a list of customers.
    
    - skip: Number of customers to skip
    - limit: Maximum number of customers to return
    """
    repo = CustomerRepository(db)
    customers = repo.get_all(skip=skip, limit=limit)
    total = repo.get_count()

    return CustomerListResponse(customers=customers, total=total)

@router.get('/{customer_id}', response_model=CustomerResponse)
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a customer by ID.
    
    - customer_id: ID of the customer to retrieve
    """
    repo = CustomerRepository(db)

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
    db: Session = Depends(get_db)
):
    """
    Update an existing customer entry.
    
    - customer_id: ID of the customer to update
    - customer_data: Updated customer data
    """
    
    repo = CustomerRepository(db)

    # If email is being updated, check if it's already taken
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
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """
    Delete a customer.
    """
    repo = CustomerRepository(db)
    success = repo.delete(customer_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Customer not found'
        )


@router.get('/winner/random', response_model=CustomerResponse)
def get_random_winner(db: Session = Depends(get_db)):
    """
    Get a random customer who hasn't won yet
    
    This is used for the roulette winner selection
    """
    repo = CustomerRepository(db)
    winner = repo.get_random_non_winner()

    if not winner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No eligible customers found"
        )
    
    return winner

@router.post('/{customer_id}/mark-winner', response_model=CustomerResponse)
def mark_customer_as_winner(customer_id: int, db: Session = Depends(get_db)):
    """ 
    Mark a customer as a winner

    This updates ths is_winner flag to True
    """
    repo = CustomerRepository(db)
    customer = repo.mark_as_winner(customer_id)

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )

    return customer


