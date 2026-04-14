"""
通用响应模型
"""
from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """API 通用响应"""
    code: int = 0
    message: str = "success"
    data: Optional[T] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """分页响应"""
    code: int = 0
    message: str = "success"
    data: list[T]
    meta: dict[str, Any] = None


class ListResponse(BaseModel):
    """列表响应（无泛型）"""
    code: int = 0
    message: str = "success"
    data: list[Any]
    total: int = 0
    page: int = 1
    page_size: int = 20
