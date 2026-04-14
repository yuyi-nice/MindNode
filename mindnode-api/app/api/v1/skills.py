"""
技能 API 路由
"""
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from app.schemas.skill import (
    SkillResponse,
    SkillDetailResponse,
    SkillCategoryResponse,
    SkillListResponse,
    SkillDownloadResponse,
)
from app.schemas.response import APIResponse
from app.db.skill_db import skill_db
from app.api.deps_db import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/skills", tags=["技能"])


@router.get("", response_model=APIResponse[SkillListResponse])
async def get_skills(
    category: Optional[str] = Query(None, description="技能分类"),
    search: Optional[str] = Query(None, description="搜索关键词"),
    sort_by: str = Query("stars", description="排序方式: stars, downloads, rating, newest, name"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    is_featured: Optional[bool] = Query(None, description="是否推荐"),
    db=Depends(get_db),
):
    """获取技能列表"""
    try:
        skills, total = skill_db.get_skills(
            category=category,
            search=search,
            sort_by=sort_by,
            page=page,
            page_size=page_size,
            is_featured=is_featured,
        )

        return APIResponse(
            data=SkillListResponse(
                data=[SkillResponse(**s) for s in skills],
                total=total,
                page=page,
                page_size=page_size,
                has_more=(page * page_size) < total,
            )
        )
    except Exception as e:
        logger.error(f"获取技能列表失败: {e}")
        # 如果数据库失败，返回空列表
        return APIResponse(
            data=SkillListResponse(
                data=[],
                total=0,
                page=page,
                page_size=page_size,
                has_more=False,
            )
        )


@router.get("/categories", response_model=APIResponse[List[SkillCategoryResponse]])
async def get_skill_categories(db=Depends(get_db)):
    """获取所有技能分类"""
    try:
        categories = skill_db.get_categories()
        return APIResponse(
            data=[SkillCategoryResponse(**c) for c in categories]
        )
    except Exception as e:
        logger.error(f"获取分类失败: {e}")
        # 返回默认分类
        default_categories = [
            {"id": 1, "name": "Development", "slug": "development", "description": "Coding, debugging, code review", "skill_count": 0, "sort_order": 1},
            {"id": 2, "name": "DevOps", "slug": "devops", "description": "CI/CD, containerization", "skill_count": 0, "sort_order": 2},
            {"id": 3, "name": "Testing", "slug": "testing", "description": "Unit testing, integration testing", "skill_count": 0, "sort_order": 3},
            {"id": 4, "name": "Data", "slug": "data", "description": "Data analysis, visualization", "skill_count": 0, "sort_order": 4},
            {"id": 5, "name": "AI & ML", "slug": "ai-ml", "description": "Machine learning, AI", "skill_count": 0, "sort_order": 5},
            {"id": 6, "name": "Automation", "slug": "automation", "description": "Workflow automation", "skill_count": 0, "sort_order": 6},
        ]
        return APIResponse(data=[SkillCategoryResponse(**c) for c in default_categories])


@router.get("/featured", response_model=APIResponse[List[SkillResponse]])
async def get_featured_skills(
    limit: int = Query(6, ge=1, le=20, description="数量限制"),
    db=Depends(get_db),
):
    """获取推荐技能"""
    try:
        skills = skill_db.get_featured_skills(limit=limit)
        return APIResponse(data=[SkillResponse(**s) for s in skills])
    except Exception as e:
        logger.error(f"获取推荐技能失败: {e}")
        return APIResponse(data=[])


@router.get("/search", response_model=APIResponse[List[SkillResponse]])
async def search_skills(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    limit: int = Query(10, ge=1, le=50, description="数量限制"),
    db=Depends(get_db),
):
    """搜索技能"""
    try:
        skills = skill_db.search_skills(q, limit=limit)
        return APIResponse(data=[SkillResponse(**s) for s in skills])
    except Exception as e:
        logger.error(f"搜索技能失败: {e}")
        return APIResponse(data=[])


@router.get("/{slug}", response_model=APIResponse[SkillDetailResponse])
async def get_skill(slug: str, db=Depends(get_db)):
    """获取技能详情"""
    try:
        skill = skill_db.get_skill_by_slug(slug)
        if not skill:
            raise HTTPException(status_code=404, detail="技能不存在")

        # 增加浏览计数
        skill_db.increment_view_count(skill["id"])

        return APIResponse(data=SkillDetailResponse(**skill))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取技能详情失败: {e}")
        raise HTTPException(status_code=404, detail="技能不存在")


@router.get("/{slug}/download", response_model=APIResponse[SkillDownloadResponse])
async def download_skill(slug: str, db=Depends(get_db)):
    """下载技能"""
    try:
        skill = skill_db.get_skill_by_slug(slug)
        if not skill:
            raise HTTPException(status_code=404, detail="技能不存在")

        # 增加下载计数
        skill_db.increment_download_count(skill["id"])

        # 返回下载信息
        return APIResponse(
            data=SkillDownloadResponse(
                download_url=skill.get("skill_md_url"),
                content=skill.get("skill_content"),
                filename=f"{skill['slug']}-v{skill.get('version', '1.0.0')}.md",
                file_size=len(skill.get("skill_content", "")) if skill.get("skill_content") else 0,
                version=skill.get("version", "1.0.0"),
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"下载技能失败: {e}")
        raise HTTPException(status_code=500, detail="下载失败")