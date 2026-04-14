"""
智能体 API 路由
"""
from fastapi import APIRouter, Query
from typing import Optional
from app.mock.data import db
from app.schemas.agent import AgentResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/agents", tags=["智能体"])


@router.get("", response_model=APIResponse[list[AgentResponse]])
async def get_agents(
    category: Optional[str] = Query(None, description="智能体分类"),
    is_featured: Optional[bool] = Query(None, description="是否推荐"),
):
    """获取智能体列表"""
    agents = db.get_all_agents(
        category=category,
        is_published=True
    )

    if is_featured is not None:
        agents = [a for a in agents if a.get("is_featured") == is_featured]

    return APIResponse(
        data=[AgentResponse(**a) for a in agents],
    )


@router.get("/categories", response_model=APIResponse[list[str]])
async def get_agent_categories():
    """获取所有智能体分类"""
    categories = db.get_agent_categories()
    return APIResponse(data=categories)


@router.get("/{slug}", response_model=APIResponse[AgentResponse])
async def get_agent(slug: str):
    """获取智能体详情"""
    agent = db.get_agent_by_slug(slug)
    if not agent:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("智能体不存在")

    return APIResponse(data=AgentResponse(**agent))
