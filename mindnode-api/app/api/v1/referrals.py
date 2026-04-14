"""
推荐官 API 路由
"""
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from app.mock.data import db
from app.schemas.partner import ReferralApplicationCreate, ReferralStats
from app.schemas.response import APIResponse
from app.api.deps import get_current_user_required

router = APIRouter(prefix="/referrals", tags=["推荐官"])


@router.post("/apply", response_model=APIResponse[dict])
async def apply_referral(application_data: ReferralApplicationCreate):
    """申请成为推荐官"""
    application = db.create_referral_application(application_data.model_dump())

    return APIResponse(
        data={
            "status": "pending",
            "message": "申请已提交，我们将在 3 个工作日内审核",
        }
    )


@router.get("/me", response_model=APIResponse[dict])
async def get_my_referral_info(current_user: dict = Depends(get_current_user_required)):
    """获取我的推荐官信息"""
    # Mock 数据
    return APIResponse(
        data={
            "status": "active",
            "tier": "gold",
            "referral_code": f"MB-{current_user['id']:06d}",
            "referral_link": f"https://moltybox.ai?ref=MB-{current_user['id']:06d}",
        }
    )


@router.get("/me/records", response_model=APIResponse[dict])
async def get_my_referral_records(current_user: dict = Depends(get_current_user_required)):
    """获取我的邀请记录"""
    # Mock 数据
    now = datetime.utcnow()
    mock_records = [
        {
            "id": 1,
            "invited_email": "user1@example.com",
            "invited_at": (now - timedelta(days=10)).isoformat(),
            "status": "active",
            "reward": 5.00,
        },
        {
            "id": 2,
            "invited_email": "user2@example.com",
            "invited_at": (now - timedelta(days=15)).isoformat(),
            "status": "pending",
            "reward": 0,
        },
        {
            "id": 3,
            "invited_email": "user3@example.com",
            "invited_at": (now - timedelta(days=18)).isoformat(),
            "status": "active",
            "reward": 10.00,
        },
    ]

    total_invites = len(mock_records)
    active_invites = len([r for r in mock_records if r["status"] == "active"])
    total_reward = sum(r["reward"] for r in mock_records)

    return APIResponse(
        data={
            "total_invites": total_invites,
            "active_invites": active_invites,
            "total_reward": total_reward,
            "records": mock_records,
        }
    )


@router.get("/me/stats", response_model=APIResponse[ReferralStats])
async def get_my_referral_stats(current_user: dict = Depends(get_current_user_required)):
    """获取我的推荐统计"""
    # Mock 数据
    stats = ReferralStats(
        tier="gold",
        commission_rate=0.20,
        total_referrals=15,
        successful_conversions=8,
        total_commission=1250000,
        pending_withdrawal=800000,
        withdrawn_amount=450000,
    )
    return APIResponse(data=stats)


@router.get("/me/logs", response_model=APIResponse[list])
async def get_my_referral_logs(current_user: dict = Depends(get_current_user_required)):
    """获取我的推荐记录"""
    # Mock 数据
    return APIResponse(
        data=[
            {
                "id": 1,
                "referral_email": "user1@example.com",
                "status": "converted",
                "commission": 150000,
                "created_at": "2026-03-15T10:00:00Z",
            },
            {
                "id": 2,
                "referral_email": "user2@example.com",
                "status": "pending",
                "commission": 0,
                "created_at": "2026-03-20T14:30:00Z",
            },
        ]
    )


@router.post("/me/withdraw", response_model=APIResponse[dict])
async def withdraw_commission(
    amount: int,
    account_info: dict,
    current_user: dict = Depends(get_current_user_required)
):
    """申请提现"""
    # Mock 实现
    return APIResponse(
        data={
            "withdraw_id": "WD-20260330-0001",
            "amount": amount,
            "status": "pending",
            "estimated_arrival": "3-5 个工作日",
        }
    )


@router.get("/tiers", response_model=APIResponse[list])
async def get_referral_tiers():
    """获取佣金等级说明"""
    return APIResponse(
        data=[
            {
                "tier": "bronze",
                "name": "青铜推荐官",
                "rate": 0.10,
                "requirement": "累计推荐 3 人",
                "benefits": ["10% 佣金", "专属推荐链接", "月度报告"],
            },
            {
                "tier": "silver",
                "name": "白银推荐官",
                "rate": 0.15,
                "requirement": "累计推荐 10 人",
                "benefits": ["15% 佣金", "专属推荐链接", "周报 + 月报", "优先支持"],
            },
            {
                "tier": "gold",
                "name": "黄金推荐官",
                "rate": 0.20,
                "requirement": "累计推荐 30 人",
                "benefits": ["20% 佣金", "专属客户经理", "实时报告", "定制营销材料"],
            },
        ]
    )


@router.get("/faq", response_model=APIResponse[list])
async def get_referral_faq():
    """获取常见问题"""
    return APIResponse(
        data=[
            {"question": "如何成为推荐官？", "answer": "填写申请表，通过审核后即可获得专属推荐链接..."},
            {"question": "佣金如何结算？", "answer": "被推荐人完成购买后，佣金将计入您的账户，可申请提现..."},
            {"question": "提现到账时间是多久？", "answer": "提现申请审核后，通常在 3-5 个工作日内到账..."},
        ]
    )
