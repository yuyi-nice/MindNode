"""
博客 API 路由
"""
from fastapi import APIRouter, Query, Body
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.mock.data import db
from app.schemas.content import BlogPostResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/blog", tags=["博客"])


class NewsletterSubscribe(BaseModel):
    """邮件订阅 Schema"""
    email: EmailStr


@router.get("/posts", response_model=APIResponse[list])
async def get_blog_posts(
    category: Optional[str] = Query(None, description="文章分类"),
    limit: int = Query(10, ge=1, le=50, description="每页数量"),
    offset: int = Query(0, ge=0, description="偏移量"),
):
    """获取博客文章列表"""
    posts = db.get_all_posts(
        category=category,
        is_published=True,
        limit=limit,
        offset=offset
    )

    return APIResponse(
        data=[{
            "id": p["id"],
            "title": p["title"],
            "slug": p["slug"],
            "excerpt": p["excerpt"],
            "cover_image": p.get("cover_image"),
            "author_name": p.get("author_name"),
            "category": p.get("category"),
            "view_count": p.get("view_count"),
            "published_at": p["published_at"].isoformat(),
        } for p in posts],
    )


@router.get("/posts/{slug}", response_model=APIResponse[dict])
async def get_blog_post(slug: str):
    """获取博客文章详情"""
    post = db.get_post_by_slug(slug)
    if not post:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("文章不存在")

    return APIResponse(data=post)


@router.get("/categories", response_model=APIResponse[list])
async def get_blog_categories():
    """获取博客分类"""
    categories = db.get_blog_categories()
    return APIResponse(data=categories)


@router.get("/posts/{slug}/related", response_model=APIResponse[list])
async def get_related_posts(slug: str, limit: int = 4):
    """获取相关文章"""
    post = db.get_post_by_slug(slug)
    if not post:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("文章不存在")

    # 获取同分类的其他文章
    posts = db.get_all_posts(
        category=post.get("category"),
        is_published=True,
        limit=limit + 1
    )
    # 排除当前文章
    posts = [p for p in posts if p["slug"] != slug][:limit]

    return APIResponse(
        data=[{
            "id": p["id"],
            "title": p["title"],
            "slug": p["slug"],
            "excerpt": p["excerpt"],
            "published_at": p["published_at"].isoformat(),
        } for p in posts]
    )


@router.post("/newsletter/subscribe", response_model=APIResponse)
async def subscribe_newsletter(data: NewsletterSubscribe):
    """订阅博客更新"""
    # Mock 实现
    return APIResponse(message="订阅成功，感谢您的关注！")
