"""
API 密钥管理路由
"""
from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from typing import List, Optional
from app.mock.data import db
from app.api.deps import get_current_user_required
from app.schemas.response import APIResponse
from pydantic import BaseModel


class APIKeyCreate(BaseModel):
    """API 密钥创建 Schema"""
    name: str
    expires_in_days: Optional[int] = 365  # 默认有效期 365 天


class APIKeyResponse(BaseModel):
    """API 密钥响应 Schema"""
    id: int
    name: str
    key: str
    created_at: datetime
    expires_at: Optional[datetime]
    last_used_at: Optional[datetime]
    request_count: int
    request_limit: int
    status: str


router = APIRouter(prefix="/api-keys", tags=["API 密钥"])


@router.get("", response_model=APIResponse[List[dict]])
async def list_api_keys(current_user: dict = Depends(get_current_user_required)):
    """获取当前用户的 API 密钥列表"""
    user_id = current_user["id"]

    # Mock 数据
    mock_keys = [
        {
            "id": 1,
            "user_id": user_id,
            "name": "默认密钥",
            "key": f"sk_live_51H8{user_id}xK2",
            "created_at": datetime.utcnow() - timedelta(days=30),
            "expires_at": datetime.utcnow() + timedelta(days=335),
            "last_used_at": datetime.utcnow() - timedelta(hours=2),
            "request_count": 20,
            "request_limit": 1000,
            "status": "active",
        },
        {
            "id": 2,
            "user_id": user_id,
            "name": "测试密钥",
            "key": f"sk_test_72K9{user_id}mN8",
            "created_at": datetime.utcnow() - timedelta(days=15),
            "expires_at": datetime.utcnow() + timedelta(days=350),
            "last_used_at": datetime.utcnow() - timedelta(days=5),
            "request_count": 5,
            "request_limit": 100,
            "status": "active",
        },
    ]

    # 检查过期状态
    now = datetime.utcnow()
    for key in mock_keys:
        if key["expires_at"] and key["expires_at"] < now:
            key["status"] = "expired"

    return APIResponse(data=mock_keys)


@router.post("", response_model=APIResponse[dict])
async def create_api_key(
    data: APIKeyCreate,
    current_user: dict = Depends(get_current_user_required)
):
    """创建新的 API 密钥"""
    import secrets

    # 生成密钥
    key_prefix = "sk_live_" if data.expires_in_days else "sk_test_"
    secret_key = secrets.token_hex(16)
    full_key = f"{key_prefix}{secret_key}"

    # 计算过期时间
    now = datetime.utcnow()
    expires_at = now + timedelta(days=data.expires_in_days) if data.expires_in_days else None

    # Mock 创建
    new_key = {
        "id": db.users.__len__() + 1,
        "user_id": current_user["id"],
        "name": data.name,
        "key": full_key,
        "created_at": now,
        "expires_at": expires_at,
        "last_used_at": None,
        "request_count": 0,
        "request_limit": 1000 if data.expires_in_days else 100,
        "status": "active",
    }

    return APIResponse(
        data=new_key,
        message="API 密钥创建成功，请立即保存（只会显示一次）"
    )


@router.delete("/{key_id}", response_model=APIResponse)
async def revoke_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """吊销 API 密钥"""
    # Mock 吊销
    return APIResponse(message="API 密钥已吊销")


@router.get("/{key_id}", response_model=APIResponse[dict])
async def get_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """获取 API 密钥详情"""
    # Mock 数据
    mock_key = {
        "id": key_id,
        "user_id": current_user["id"],
        "name": "默认密钥",
        "key": f"sk_live_51H8...9xK2",
        "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=335)).isoformat(),
        "last_used_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "request_count": 20,
        "request_limit": 1000,
        "status": "active",
        "request_logs": [
            {"timestamp": datetime.utcnow().isoformat(), "endpoint": "/api/v1/models", "status": 200},
            {"timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(), "endpoint": "/api/v1/skills", "status": 200},
        ]
    }

    return APIResponse(data=mock_key)


@router.put("/{key_id}/disable", response_model=APIResponse)
async def disable_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """禁用 API 密钥"""
    return APIResponse(message="API 密钥已禁用")


@router.put("/{key_id}/enable", response_model=APIResponse)
async def enable_api_key(
    key_id: int,
    current_user: dict = Depends(get_current_user_required)
):
    """启用 API 密钥"""
    return APIResponse(message="API 密钥已启用")
