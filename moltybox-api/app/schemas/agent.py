"""
智能体相关 Schema
"""
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime


class AgentBase(BaseModel):
    """智能体基础 Schema"""
    name: str
    slug: str
    category: str
    description: str


class AgentCreate(AgentBase):
    """智能体创建 Schema"""
    tagline: Optional[str] = None
    skills: List[int] = []
    capabilities: List[str] = []


class AgentUpdate(BaseModel):
    """智能体更新 Schema"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None


class AgentResponse(AgentBase):
    """智能体响应 Schema"""
    id: int
    tagline: Optional[str] = None
    icon_url: Optional[str] = None
    skills: List[int]
    capabilities: List[str]
    integrations: List[str]
    usage_count: int
    active_user_count: int
    rating: float
    rating_count: int
    is_published: bool
    is_featured: bool
    pricing_type: str
    price: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
