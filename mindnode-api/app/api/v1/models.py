"""
AI 模型 API 路由
"""
from fastapi import APIRouter, Query
from typing import Optional, List
from app.mock.data import db
from app.schemas.model import AIModelResponse
from app.schemas.response import APIResponse, ListResponse

router = APIRouter(prefix="/models", tags=["AI 模型"])


@router.get("", response_model=APIResponse[list[AIModelResponse]])
async def get_models(
    model_type: Optional[str] = Query(None, description="模型类型：llm / embedding / vision / audio"),
    provider: Optional[str] = Query(None, description="提供商名称"),
    input_type: Optional[str] = Query(None, description="输入类型：text / image / audio / video"),
):
    """获取 AI 模型列表"""
    models = db.get_all_models(
        model_type=model_type,
        provider=provider,
        is_available=True
    )

    # 如果指定了 input_type，进一步筛选
    if input_type:
        models = [m for m in models if input_type in m.get("input_types", [])]

    return APIResponse(
        data=[AIModelResponse(**m) for m in models],
    )


@router.get("/providers", response_model=APIResponse[list[str]])
async def get_providers():
    """获取所有模型提供商"""
    providers = db.get_providers()
    return APIResponse(data=providers)


@router.get("/{slug}", response_model=APIResponse[AIModelResponse])
async def get_model(slug: str):
    """获取模型详情"""
    model = db.get_model_by_slug(slug)
    if not model:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("模型不存在")

    return APIResponse(data=AIModelResponse(**model))
