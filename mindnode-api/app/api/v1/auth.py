"""
认证 API 路由 - 修复 datetime 导入问题
"""
from fastapi import APIRouter, Depends
from typing import Optional
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedException, BadRequestException, ConflictException
from app.api.deps import get_current_user, get_current_user_required
from app.api.deps_db import get_user_by_email, get_user_by_username, get_user_by_id, create_user
from app.db.database import db
from app.schemas.user import UserCreate, UserResponse, Token, TokenData
from app.schemas.response import APIResponse
from datetime import timedelta, datetime as dt

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/register", response_model=APIResponse[dict])
async def register(user_data: UserCreate):
    """用户注册"""
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise ConflictException("该邮箱已被注册")

    existing_username = get_user_by_username(user_data.username)
    if existing_username:
        raise ConflictException("该用户名已被使用")

    user = create_user({
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name or "",
        "hashed_password": get_password_hash(user_data.password),
        "avatar_url": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.email}",
        "is_active": True,
        "is_verified": False,
        "is_superuser": False,
    })

    access_token = create_access_token(data={"sub": user["id"]}, expires_delta=timedelta(minutes=60))
    refresh_token = create_refresh_token(data={"sub": user["id"]}, expires_delta=timedelta(days=7))

    return APIResponse(data={
        "user": {"id": user["id"], "email": user["email"], "username": user["username"]},
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 3600,
    })


@router.post("/login", response_model=APIResponse[dict])
async def login(email: str, password: str):
    """用户登录"""
    user = get_user_by_email(email)
    if not user or not verify_password(password, user["hashed_password"]):
        raise UnauthorizedException("邮箱或密码错误")

    if not user["is_active"]:
        raise UnauthorizedException("账户已被禁用")

    # 更新最后登录时间
    db.execute("UPDATE users SET last_login = %s WHERE id = %s", (dt.utcnow(), user["id"]))

    access_token = create_access_token(data={"sub": user["id"]}, expires_delta=timedelta(minutes=60))
    refresh_token = create_refresh_token(data={"sub": user["id"]}, expires_delta=timedelta(days=7))

    return APIResponse(data={
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "full_name": user.get("full_name"),
            "avatar_url": user.get("avatar_url"),
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 3600,
    })


@router.post("/logout", response_model=APIResponse)
async def logout(current_user: dict = Depends(get_current_user_required)):
    """用户登出"""
    return APIResponse(message="已成功登出")


@router.post("/refresh", response_model=APIResponse[dict])
async def refresh_token(refresh_token: str):
    """刷新 Token"""
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedException("无效的刷新 Token")

    user_id = payload.get("sub")
    user = get_user_by_id(int(user_id))
    if not user or not user["is_active"]:
        raise UnauthorizedException("用户不存在或已被禁用")

    new_access_token = create_access_token(data={"sub": user["id"]}, expires_delta=timedelta(minutes=60))
    new_refresh_token = create_refresh_token(data={"sub": user["id"]}, expires_delta=timedelta(days=7))

    return APIResponse(data={
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": 3600,
    })


@router.get("/me", response_model=APIResponse[dict])
async def get_current_user_info(current_user: dict = Depends(get_current_user_required)):
    """获取当前用户信息"""
    return APIResponse(data={
        "id": current_user["id"],
        "email": current_user["email"],
        "username": current_user["username"],
        "full_name": current_user.get("full_name"),
        "avatar_url": current_user.get("avatar_url"),
        "is_verified": current_user.get("is_verified", False),
        "created_at": current_user["created_at"].isoformat(),
    })
