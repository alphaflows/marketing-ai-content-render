from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    content_type = Column(String)  # article, post, etc.
    purpose = Column(String)  # product features, technical sharing, etc.
    reference_links = Column(JSON)  # List of reference URLs
    target_keywords = Column(JSON)  # List of target keywords
    product_info = Column(JSON)  # Product information
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="contents") 