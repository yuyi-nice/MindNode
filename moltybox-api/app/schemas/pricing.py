"""
定价、客户端相关 Schema
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ==================== 定价 ====================

class PricingPlanResponse(BaseModel):
    """定价计划响应 Schema"""
    id: int
    name: str
    slug: str
    price: int
    annual_price: Optional[int] = None
    currency: str
    description: str
    tagline: str
    features: List[str]
    limits: dict
    is_available: bool
    is_popular: bool

    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    """订阅响应 Schema"""
    id: int
    plan_id: int
    plan_name: str
    status: str
    billing_cycle: str
    current_period_end: datetime


# ==================== 客户端 ====================

class ClientVersionResponse(BaseModel):
    """客户端版本响应 Schema"""
    version: str
    build_number: int
    release_notes: str
    download_url: str
    file_size: int
    checksum_sha256: str
    recommended: bool
    required: bool


class ClientVersionCheckResponse(BaseModel):
    """客户端版本检查响应 Schema"""
    latest: Optional[ClientVersionResponse] = None
    current: dict
    has_update: bool
