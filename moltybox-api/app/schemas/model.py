"""
AI 模型相关 Schema
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AIModelBase(BaseModel):
    """AI 模型基础 Schema"""
    name: str
    slug: str
    display_name: Optional[str] = None
    provider: str
    type: str
    context_window: int
    description: Optional[str] = None


class AIModelCreate(AIModelBase):
    """AI 模型创建 Schema"""
    pass


class AIModelUpdate(BaseModel):
    """AI 模型更新 Schema"""
    name: Optional[str] = None
    display_name: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None


class AIModelResponse(AIModelBase):
    """AI 模型响应 Schema"""
    id: int
    provider_logo: Optional[str] = None
    family: Optional[str] = None
    max_output_tokens: Optional[int] = None
    input_types: List[str]
    output_types: List[str]
    supported_languages: List[str]
    pricing_input: float
    pricing_output: float
    currency: str
    is_available: bool
    is_featured: bool
    sort_order: int = 0

    class Config:
        from_attributes = True
