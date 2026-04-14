"""
文档 API 路由
"""
from fastapi import APIRouter, Query
from app.mock.data import db
from app.schemas.response import APIResponse

router = APIRouter(prefix="/docs", tags=["文档"])


@router.get("", response_model=APIResponse[list])
async def get_documentation_tree():
    """获取文档树"""
    tree = db.get_documentation_tree()
    return APIResponse(data=tree)


@router.get("/{slug}", response_model=APIResponse[dict])
async def get_documentation(slug: str):
    """获取文档详情"""
    doc = db.get_doc_by_slug(slug)
    if not doc:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("文档不存在")

    return APIResponse(data=doc)


@router.get("/search", response_model=APIResponse[list])
async def search_documentation(q: str = Query(..., min_length=1, description="搜索关键词")):
    """搜索文档"""
    docs = db.documentations
    results = [
        d for d in docs
        if q.lower() in d["title"].lower() or q.lower() in d["content"].lower()
    ]

    return APIResponse(
        data=[{
            "id": d["id"],
            "title": d["title"],
            "slug": d["slug"],
            "excerpt": d["content"][:200] + "..." if len(d["content"]) > 200 else d["content"],
        } for d in results[:10]]
    )
