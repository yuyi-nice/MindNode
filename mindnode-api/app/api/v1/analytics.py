"""
数据分析 API 路由
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_user_required
from app.schemas.response import APIResponse
from datetime import datetime

router = APIRouter(prefix="/analytics", tags=["数据分析"])


class PageViewEvent(BaseModel):
    """页面浏览事件"""
    path: str
    title: Optional[str] = None
    referrer: Optional[str] = None
    load_time_ms: Optional[int] = None


class AnalyticsEvent(BaseModel):
    """分析事件"""
    event_type: str
    event_name: str
    resource_type: Optional[str] = None
    resource_id: Optional[int] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None


@router.post("/pageview", response_model=APIResponse)
async def track_pageview(event: PageViewEvent):
    """上报页面浏览"""
    # Mock 实现
    return APIResponse(message="已记录")


@router.post("/event", response_model=APIResponse)
async def track_event(event: AnalyticsEvent):
    """上报事件"""
    # Mock 实现
    return APIResponse(message="已记录")


@router.get("/dashboard", response_model=APIResponse[dict])
async def get_dashboard_data(current_user: dict = Depends(get_current_user_required)):
    """获取仪表盘数据"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    return APIResponse(
        data={
            "summary": {
                "today_pv": 1523,
                "today_uv": 892,
                "yesterday_pv": 1421,
                "yesterday_uv": 856,
                "total_users": 12580,
                "total_conversions": 342,
            },
            "conversion_funnel": {
                "page_view": 15000,
                "product_page": 5200,
                "download": 1200,
                "signup": 450,
                "purchase": 85,
            },
            "top_pages": [
                {"path": "/", "pv": 5000, "uv": 3200},
                {"path": "/moltybox", "pv": 3200, "uv": 2100},
                {"path": "/pricing", "pv": 1800, "uv": 1500},
            ],
            "recent_conversions": [
                {"type": "signup", "count": 12, "date": "2026-03-30"},
                {"type": "download", "count": 45, "date": "2026-03-30"},
                {"type": "purchase", "count": 3, "date": "2026-03-30"},
            ]
        }
    )


@router.get("/page-views", response_model=APIResponse[list])
async def get_page_views(
    days: int = 7,
    current_user: dict = Depends(get_current_user_required)
):
    """获取页面浏览趋势"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    # Mock 数据
    return APIResponse(
        data=[
            {"date": f"2026-03-{24 + i}", "pv": 1200 + i * 100, "uv": 800 + i * 50}
            for i in range(days)
        ]
    )


@router.get("/conversions", response_model=APIResponse[list])
async def get_conversions(
    days: int = 7,
    current_user: dict = Depends(get_current_user_required)
):
    """获取转化事件列表"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    # Mock 数据
    return APIResponse(
        data=[
            {
                "id": i,
                "event_type": ["signup", "download", "purchase"][i % 3],
                "user_id": 100 + i,
                "value": [0, 0, 299900][i % 3],
                "created_at": f"2026-03-{24 + i % 7}T10:00:00Z",
            }
            for i in range(20)
        ]
    )


@router.get("/conversions/summary", response_model=APIResponse[dict])
async def get_conversions_summary(
    current_user: dict = Depends(get_current_user_required)
):
    """获取转化统计摘要"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    return APIResponse(
        data={
            "today": {"signups": 12, "downloads": 45, "purchases": 3, "revenue": 899700},
            "this_week": {"signups": 89, "downloads": 342, "purchases": 23, "revenue": 6897100},
            "this_month": {"signups": 356, "downloads": 1523, "purchases": 92, "revenue": 27590800},
        }
    )


@router.get("/sources", response_model=APIResponse[list])
async def get_traffic_sources(
    current_user: dict = Depends(get_current_user_required)
):
    """获取流量来源分析"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    return APIResponse(
        data=[
            {"source": "google", "medium": "organic", "sessions": 5234, "conversions": 156},
            {"source": "direct", "medium": "direct", "sessions": 3421, "conversions": 89},
            {"source": "wechat", "medium": "social", "sessions": 2156, "conversions": 67},
        ]
    )


@router.get("/devices", response_model=APIResponse[list])
async def get_device_stats(
    current_user: dict = Depends(get_current_user_required)
):
    """获取设备分布统计"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    return APIResponse(
        data=[
            {"device_type": "desktop", "percentage": 65, "sessions": 8234},
            {"device_type": "mobile", "percentage": 28, "sessions": 3542},
            {"device_type": "tablet", "percentage": 7, "sessions": 885},
        ]
    )
