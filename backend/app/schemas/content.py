from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime

class ContentBase(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    content_type: str
    purpose: str
    reference_links: List[str]
    target_keywords: List[str]
    product_info: Dict[str, str]

class ContentCreate(ContentBase):
    pass

class ContentUpdate(ContentBase):
    pass

class ContentInDBBase(ContentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ContentResponse(ContentInDBBase):
    pass 