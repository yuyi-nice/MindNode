"""
博客、文档相关 Schema
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ==================== 博客 ====================

class BlogPostBase(BaseModel):
    """博客文章基础 Schema"""
    title: str
    slug: str
    excerpt: str
    category: str


class BlogPostResponse(BlogPostBase):
    """博客文章响应 Schema"""
    id: int
    content: str
    cover_image: Optional[str] = None
    author_name: str
    tags: List[str]
    is_published: bool
    is_featured: bool
    view_count: int
    published_at: datetime

    class Config:
        from_attributes = True


class BlogPostCreate(BlogPostBase):
    """博客文章创建 Schema"""
    content: str
    tags: List[str] = []


# ==================== 文档 ====================

class DocumentationResponse(BaseModel):
    """文档响应 Schema"""
    id: int
    title: str
    slug: str
    content: str
    parent_id: Optional[int] = None
    order: int
    category: str
    children: List['DocumentationResponse'] = []

    class Config:
        from_attributes = True


DocumentationResponse.model_rebuild()
