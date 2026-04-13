"""
其他 API 路由 - 新闻订阅、联系表单
"""
from fastapi import APIRouter, Body
from pydantic import BaseModel, EmailStr
from app.schemas.response import APIResponse

router = APIRouter(tags=["其他"])


class NewsletterSubscribe(BaseModel):
    """新闻订阅 Schema"""
    email: EmailStr
    consent: bool = True


@router.post("/newsletter/subscribe", response_model=APIResponse)
async def newsletter_subscribe(data: NewsletterSubscribe):
    """邮件订阅"""
    # Mock 实现
    return APIResponse(message="订阅成功，感谢您的关注！")


@router.post("/newsletter/unsubscribe", response_model=APIResponse)
async def newsletter_unsubscribe(email: str = Body(..., embed=True)):
    """取消订阅"""
    # Mock 实现
    return APIResponse(message="已取消订阅")


class ContactForm(BaseModel):
    """联系表单 Schema"""
    name: str
    email: EmailStr
    company: str | None = None
    subject: str
    message: str


@router.post("/contact", response_model=APIResponse)
async def submit_contact_form(data: ContactForm):
    """提交联系表单"""
    # Mock 实现
    return APIResponse(
        message="感谢您的留言，我们将在 24 小时内回复您"
    )


@router.get("/analytics/summary", response_model=APIResponse)
async def get_analytics_summary():
    """获取访问统计摘要（公开版本）"""
    return APIResponse(
        data={
            "total_users": 12580,
            "total_downloads": 45230,
            "total_skills": 156,
            "total_agents": 89,
        }
    )
