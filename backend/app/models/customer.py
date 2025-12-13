""" 
Customer database model.
This defines the 'customers' table structure in PostgreSQL.
"""
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base

class Customer(Base):
    """ 
    Customer database model.
    This defines the 'customers' table structure in PostgreSQL.
    """
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(225), nullable=False)
    email = Column(String(225), nullable=False, unique=True, index=True)
    feedback = Column(Text, nullable=False)
    is_winner = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        """  String representation of Customer object. """
        return f"<Customer(id='{self.id}', name='{self.name}'), email='{self.email}')"
