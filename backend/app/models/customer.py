""" 
Customer database model.
This defines the 'customers' table structure in PostgreSQL.
"""
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Customer(Base):
    """ 
    Customer database model.
    This defines the 'customers' table structure in PostgreSQL.
    """
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True) # Temporarily nullable for migration
    name = Column(String(225), nullable=False)
    email = Column(String(225), nullable=False, unique=True, index=True)
    feedback = Column(Text, nullable=False)
    winner_place = Column(Integer, nullable=True)
    is_winner = Column(Boolean, default=False, nullable=False)
    is_notified = Column(Boolean, default=False, nullable=False)
    notified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    organization = relationship("Organization", back_populates="customers")

    def __repr__(self):
        """  String representation of Customer object. """
        return f"<Customer(id='{self.id}', name='{self.name}'), email='{self.email}')"
