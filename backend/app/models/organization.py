from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    primary_color = Column(String(50), default="#7c3aed")
    logo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    users = relationship("User", back_populates="organization")
    customers = relationship("Customer", back_populates="organization")
    prizes = relationship("Prize", back_populates="organization")

    def __repr__(self):
        return f"<Organization(id='{self.id}', name='{self.name}', slug='{self.slug}')>"
