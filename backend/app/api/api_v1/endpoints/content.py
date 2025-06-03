from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.content import Content
from app.schemas.content import ContentCreate, ContentResponse, ContentUpdate
from app.services.content_generator import ContentGenerator

router = APIRouter()

@router.post("/generate", response_model=ContentResponse)
async def generate_content(
    *,
    db: Session = Depends(deps.get_db),
    content_in: ContentCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Generate new content
    """
    content_generator = ContentGenerator()
    
    # Crawl reference content
    reference_contents = await content_generator.crawl_web_content(content_in.reference_links)
    
    # Generate content
    generated = await content_generator.generate_content(
        reference_contents=reference_contents,
        product_info=content_in.product_info,
        target_keywords=content_in.target_keywords,
        purpose=content_in.purpose
    )
    
    # Save content
    content = Content(
        user_id=current_user.id,
        title=generated["title"],
        content=generated["content"],
        content_type=content_in.content_type,
        purpose=content_in.purpose,
        reference_links=content_in.reference_links,
        target_keywords=content_in.target_keywords,
        product_info=content_in.product_info
    )
    
    db.add(content)
    db.commit()
    db.refresh(content)
    return content

@router.get("", response_model=List[ContentResponse])
async def read_contents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve user's contents
    """
    contents = db.query(Content).filter(
        Content.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return contents

@router.get("/{content_id}", response_model=ContentResponse)
async def read_content(
    *,
    db: Session = Depends(deps.get_db),
    content_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get content by ID
    """
    content = db.query(Content).filter(
        Content.id == content_id,
        Content.user_id == current_user.id
    ).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    return content

@router.delete("/{content_id}", response_model=ContentResponse)
async def delete_content(
    *,
    db: Session = Depends(deps.get_db),
    content_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete content
    """
    content = db.query(Content).filter(
        Content.id == content_id,
        Content.user_id == current_user.id
    ).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found",
        )
    db.delete(content)
    db.commit()
    return content 