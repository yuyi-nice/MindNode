"""
硬件产品相关 Schema
"""
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime


class HardwareProductBase(BaseModel):
    """硬件产品基础 Schema"""
    name: str
    slug: str
    short_description: Optional[str] = None
    description: str


class HardwareProductResponse(HardwareProductBase):
    """硬件产品响应 Schema"""
    id: int
    price: int
    original_price: Optional[int] = None
    currency: str
    tagline: Optional[str] = None
    specs: dict
    features: List[str]
    images: List[str]
    cover_image: Optional[str] = None
    stock: int
    is_available: bool
    is_featured: bool
    is_new: bool
    view_count: int
    purchase_count: int

    class Config:
        from_attributes = True


class HardwareOrderCreate(BaseModel):
    """硬件订单创建 Schema"""
    product_id: int
    quantity: int = 1
    customer_name: str
    customer_email: str
    customer_phone: str
    province: str
    city: str
    district: str
    address: str
    postal_code: Optional[str] = None


class HardwareOrderResponse(BaseModel):
    """硬件订单响应 Schema"""
    id: int
    order_no: str
    status: str
    total_amount: int
    created_at: datetime
