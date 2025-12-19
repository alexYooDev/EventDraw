from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.core.database import Base

class Prize(Base):
    __tablename__ = "prizes"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    place = Column(Integer, nullable=False) # 1, 2, 3
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    
    organization = relationship("Organization", back_populates="prizes")

    def __repr__(self):
        return f"<Prize(id='{self.id}', place='{self.place}', name='{self.name}')>"
