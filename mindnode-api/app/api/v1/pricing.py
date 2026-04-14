"""
定价 API 路由
"""
from fastapi import APIRouter, Depends
from app.mock.data import db
from app.schemas.pricing import PricingPlanResponse, SubscriptionResponse
from app.schemas.response import APIResponse
from app.api.deps import get_current_user_required

router = APIRouter(prefix="/pricing", tags=["定价"])


@router.get("/plans", response_model=APIResponse[list[PricingPlanResponse]])
async def get_pricing_plans():
    """获取定价计划列表"""
    plans = db.get_all_plans()
    return APIResponse(
        data=[PricingPlanResponse(**p) for p in plans],
    )


@router.get("/plans/{slug}", response_model=APIResponse[PricingPlanResponse])
async def get_pricing_plan(slug: str):
    """获取指定计划详情"""
    plan = db.get_plan_by_slug(slug)
    if not plan:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("计划不存在")

    return APIResponse(data=PricingPlanResponse(**plan))


@router.get("/compare", response_model=APIResponse[dict])
async def compare_plans():
    """对比所有计划"""
    plans = db.get_all_plans()
    return APIResponse(
        data={
            "plans": [PricingPlanResponse(**p) for p in plans],
            "comparison": {
                "features": [
                    {"name": "技能数量", "values": ["10", "无限", "无限"]},
                    {"name": "智能体数量", "values": ["5", "无限", "无限"]},
                    {"name": "存储空间", "values": ["10GB", "100GB", "500GB"]},
                    {"name": "技术支持", "values": ["社区", "优先", "专属"]},
                    {"name": "团队成员", "values": ["1", "5", "10"]},
                ]
            }
        }
    )


@router.get("/my-subscription", response_model=APIResponse[dict])
async def get_my_subscription(current_user: dict = Depends(get_current_user_required)):
    """获取我的订阅"""
    # Mock 数据 - 假设用户没有订阅
    return APIResponse(
        data={
            "has_subscription": False,
            "message": "您还没有订阅任何计划",
        }
    )


@router.post("/subscribe", response_model=APIResponse[dict])
async def subscribe(
    plan_slug: str,
    billing_cycle: str = "monthly",
    current_user: dict = Depends(get_current_user_required)
):
    """订阅计划"""
    plan = db.get_plan_by_slug(plan_slug)
    if not plan:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("计划不存在")

    # Mock 订阅流程
    return APIResponse(
        data={
            "subscription_id": 123,
            "plan_name": plan["name"],
            "status": "active",
            "payment_url": "https://pay.example.com/mock",
            "trial_end": "2026-04-30T00:00:00Z",
        }
    )


@router.post("/cancel", response_model=APIResponse)
async def cancel_subscription(current_user: dict = Depends(get_current_user_required)):
    """取消订阅"""
    return APIResponse(message="订阅已取消")


@router.post("/resume", response_model=APIResponse)
async def resume_subscription(current_user: dict = Depends(get_current_user_required)):
    """恢复订阅"""
    return APIResponse(message="订阅已恢复")


@router.get("/invoices", response_model=APIResponse[list])
async def get_invoices(current_user: dict = Depends(get_current_user_required)):
    """获取发票列表"""
    return APIResponse(data=[])
