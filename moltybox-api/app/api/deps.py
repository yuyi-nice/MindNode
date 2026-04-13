"""
通用依赖注入
"""
from fastapi import Header, HTTPException
from typing import Optional
from app.core.security import decode_token
from app.mock.data import db


async def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """获取当前用户（可选）"""
    if not authorization:
        return None

    try:
        # 解析 Bearer Token
        if not authorization.startswith("Bearer "):
            return None
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        if payload and payload.get("type") == "access":
            user_id = payload.get("sub")
            if user_id:
                return db.get_user_by_id(int(user_id))
    except Exception:
        pass
    return None


async def get_current_user_required(authorization: Optional[str] = Header(None)) -> dict:
    """获取当前用户（必需）"""
    user = await get_current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


async def get_current_superuser(authorization: Optional[str] = Header(None)) -> dict:
    """获取当前超级用户"""
    user = await get_current_user_required(authorization)
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user
