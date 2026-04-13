"""
用户 API 路由
"""
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from app.core.security import verify_password, get_password_hash
from app.core.exceptions import BadRequestException
from app.api.deps import get_current_user_required
from app.mock.data import db
from app.schemas.user import UserUpdate, ChangePassword, UserResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/me", response_model=APIResponse[dict])
async def get_me(current_user: dict = Depends(get_current_user_required)):
    """获取当前用户信息"""
    return APIResponse(
        data={
            "id": current_user["id"],
            "email": current_user["email"],
            "username": current_user["username"],
            "full_name": current_user.get("full_name"),
            "avatar_url": current_user.get("avatar_url"),
            "is_active": current_user.get("is_active"),
            "is_verified": current_user.get("is_verified"),
            "created_at": current_user["created_at"].isoformat(),
            "last_login": current_user.get("last_login"),
        }
    )


@router.put("/me", response_model=APIResponse[dict])
async def update_me(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user_required)
):
    """更新当前用户信息"""
    user_id = current_user["id"]
    user = db.get_user_by_id(user_id)

    if not user:
        raise BadRequestException("用户不存在")

    # 更新字段
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            user[key] = value

    return APIResponse(
        data={
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "full_name": user.get("full_name"),
            "avatar_url": user.get("avatar_url"),
        }
    )


@router.put("/me/password", response_model=APIResponse)
async def change_password(
    password_data: ChangePassword,
    current_user: dict = Depends(get_current_user_required)
):
    """修改密码"""
    user_id = current_user["id"]
    user = db.get_user_by_id(user_id)

    if not user:
        raise BadRequestException("用户不存在")

    # 验证当前密码
    if not verify_password(password_data.current_password, user["hashed_password"]):
        raise BadRequestException("当前密码错误")

    # 更新密码
    user["hashed_password"] = get_password_hash(password_data.new_password)

    return APIResponse(message="密码修改成功")


@router.get("/me/stats", response_model=APIResponse[dict])
async def get_user_stats(current_user: dict = Depends(get_current_user_required)):
    """获取用户统计概览"""
    # Mock 数据
    return APIResponse(
        data={
            "balance": 4.92,
            "total_recharge": 5.00,
            "total_consumption": 0.08,
            "requests_7d": 20,
            "success_rate": 100.0,
            "total_tokens": 15420,
            "api_keys_count": 2,
            "referrals_count": 0,
        }
    )


@router.get("/me/referrals", response_model=APIResponse[list])
async def get_my_referrals(current_user: dict = Depends(get_current_user_required)):
    """获取我的推荐记录"""
    # Mock 数据 - 返回空列表
    return APIResponse(data=[])


@router.get("/me/usage", response_model=APIResponse[dict])
async def get_usage_history(
    start_date: str = None,
    end_date: str = None,
    model: str = None,
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user_required)
):
    """获取使用历史记录"""
    # Mock 数据
    now = datetime.utcnow()
    mock_records = [
        {
            "id": i,
            "timestamp": (now - timedelta(hours=i*2)).isoformat(),
            "model": "DeepSeek-V3",
            "event_type": "inference",
            "status": "success",
            "input_tokens": 150 + i * 10,
            "output_tokens": 320 + i * 20,
            "cost": 0.002 + i * 0.0001,
            "latency_ms": 245 + i * 10,
        }
        for i in range(1, 21)
    ]

    return APIResponse(
        data={
            "total": len(mock_records),
            "records": mock_records[offset:offset + limit],
        }
    )


@router.get("/me/billing", response_model=APIResponse[dict])
async def get_billing_info(current_user: dict = Depends(get_current_user_required)):
    """获取账单信息"""
    # Mock 数据
    now = datetime.utcnow()
    mock_transactions = [
        {
            "id": 1,
            "type": "recharge",
            "amount": 5.00,
            "balance_after": 5.00,
            "description": "在线充值",
            "status": "completed",
            "created_at": (now - timedelta(days=20)).isoformat(),
        },
        {
            "id": 2,
            "type": "consumption",
            "amount": -0.08,
            "balance_after": 4.92,
            "description": "API 调用 - DeepSeek-V3",
            "status": "completed",
            "created_at": (now - timedelta(hours=2)).isoformat(),
        },
    ]

    return APIResponse(
        data={
            "balance": 4.92,
            "total_recharge": 5.00,
            "total_consumption": 0.08,
            "transactions": mock_transactions,
        }
    )


@router.post("/me/billing/recharge", response_model=APIResponse[dict])
async def create_recharge(
    amount: float,
    method: str,
    current_user: dict = Depends(get_current_user_required)
):
    """创建充值订单"""
    # Mock 实现
    return APIResponse(
        data={
            "order_id": f"RC-{datetime.utcnow().strftime('%Y%m%d')}-0001",
            "amount": amount,
            "method": method,
            "status": "pending",
            "payment_url": "https://payment.example.com/pay/xxx",
        }
    )


@router.delete("/me", response_model=APIResponse)
async def delete_account(current_user: dict = Depends(get_current_user_required)):
    """注销账户"""
    # Mock 实现 - 实际应该软删除
    return APIResponse(message="账户已注销")


@router.get("/me/subscription", response_model=APIResponse[dict])
async def get_subscription_info(current_user: dict = Depends(get_current_user_required)):
    """获取用户订阅信息"""
    # Mock 数据 - 实际应从订阅表查询
    return APIResponse(
        data={
            "plan_slug": "free",
            "plan_name": "个人版",
            "price": 0,
            "currency": "CNY",
            "billing_cycle": None,
            "started_at": None,
            "expires_at": None,
            "is_active": True,
            "features": [
                "10 个技能",
                "5 个智能体",
                "基础模型访问",
                "社区支持"
            ],
            "limits": {
                "max_skills": 10,
                "max_agents": 5,
                "storage_gb": 10
            }
        }
    )
