"""
合伙人、推荐官、企业版相关 Schema
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ==================== 合伙人 ====================

class PartnerApplicationCreate(BaseModel):
    """合伙人申请创建 Schema"""
    name: str
    company: str
    email: str
    phone: str
    region: str
    partner_type: str  # channel / ecosystem
    resources: Optional[str] = None


class PartnerApplicationResponse(BaseModel):
    """合伙人申请响应 Schema"""
    id: int
    application_no: str
    company_name: str
    status: str
    submitted_at: datetime


# ==================== 推荐官 ====================

class ReferralApplicationCreate(BaseModel):
    """推荐官申请创建 Schema"""
    name: str
    email: str
    phone: str
    company: Optional[str] = None
    description: Optional[str] = None


class ReferralStats(BaseModel):
    """推荐统计 Schema"""
    tier: str
    commission_rate: float
    total_referrals: int
    successful_conversions: int
    total_commission: int
    pending_withdrawal: int
    withdrawn_amount: int


# ==================== 企业版 ====================

class EnterpriseInquiryCreate(BaseModel):
    """企业咨询创建 Schema"""
    company_name: str
    contact_name: str
    contact_email: str
    contact_phone: str
    industry: Optional[str] = None
    employee_count: Optional[str] = None
    use_case: Optional[str] = None
    interested_products: Optional[List[str]] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None


class EnterpriseCaseResponse(BaseModel):
    """企业案例响应 Schema"""
    id: int
    company_name: str
    slug: str
    industry: str
    challenge: str
    solution: str
    results: List[str]
    testimonial: str
    testimonial_author: str
    is_featured: bool
