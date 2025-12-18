"""
Customer repository for database operations.

This implements the Repository pattern - all database operations for customers are centralized here.
"""
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

class CustomerRepository:
    """ Customer repository for database operations. """
    
    def __init__(self, db: Session):
        """  Initialize repository with database session 
            Args: db: SQLAlchemy database session
        """
        self.db = db

    def create(self, customer_data: CustomerCreate) -> Customer:
        """ Create a new customer in the database. 
            Args: customer_data: Customer data from request
            Returns: Created Customer model instance
        """
        
        db_customer = Customer(**customer_data.model_dump())
        self.db.add(db_customer)
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer

    def get_by_id(self, customer_id: int) -> Optional[Customer]:
        """
        Get a customer by ID.
        Args: customer_id: ID of the customer to retrieve
        Returns: Customer model instance if found, None otherwise
        """
        return self.db.query(Customer).filter(Customer.id == customer_id).first()

    def get_by_email(self, email: str) -> Optional[Customer]:
        """
        Get a customer by email address.
        Args: email: Customer's email address
        Returns: Customer model instance if found, None otherwise
        """
        return self.db.query(Customer).filter(Customer.email == email).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Customer]:
        """ 
        Get all customers from the database.
        Args: skip: Number of customers to skip
        limit: Maximum number of customers to return
        Returns: List of Customer model instances
        """
        return self.db.query(Customer).offset(skip).limit(limit).all()

    def get_count(self) -> int:
        """ 
        Get the total count of customers in the database. 
        Returns: Total number of customers in database
        """
        return self.db.query(Customer).count()

    def update(self, customer_id: int, customer_data: CustomerUpdate) -> Optional[Customer]:
        """
        Update a customer.

        Args:
            customer_id: Customer's ID
            customer_data: Updated customer data

        Returns: Updated Customer if found, None otherwise
        """
        db_customer = self.get_by_id(customer_id)
        if not db_customer:
            return None
        
        # Update only provided fields
        update_data = customer_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_customer, field, value)

        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer

    def delete(self, customer_id: int) -> bool:
        """
        Delete a customer

        Args:
            customer_id: Customer's ID
        
        Returns:
            True if deleted, False if not found
        """

        db_customer = self.get_by_id(customer_id)
        if not db_customer:
            return False
        
        self.db.delete(db_customer)
        self.db.commit()
        return True
    
    def get_random_non_winner(self) -> Optional[Customer]:
        """ 
        Get a random customer who has not won a draw yet.
        Used for the roulette winnder selection
        Returns: Customer model instance if found, None otherwise
        """

        from sqlalchemy.sql.expression import func

        return (
            self.db.query(Customer)
            .filter(Customer.is_winner == False)
            .order_by(func.random())
            .first()
        )

    def mark_as_winner(self, customer_id: int, winner_place: int) -> Optional[Customer]:
        """
            Mark a customer as winner.

            Args:
                customer_id: Customer's ID
                winner_place: The place (1, 2, or 3)

            Returns:
                Updated Customer if found, None otherwise
        """

        db_customer = self.get_by_id(customer_id)
        if not db_customer:
            return None

        db_customer.is_winner = True
        db_customer.winner_place = winner_place
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer

        


        
                
