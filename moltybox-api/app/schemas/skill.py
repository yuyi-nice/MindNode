"""
技能相关 Schema
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class RatingLevel(str, Enum):
    """技能评级"""
    S = "S"  # 9.0+ 卓越
    A = "A"  # 8.0+ 优秀
    B = "B"  # 7.0+ 良好
    C = "C"  # 6.0+ 一般
    D = "D"  # 6.0以下 待改进


class SkillBase(BaseModel):
    """技能基础 Schema"""
    name: str
    slug: str
    category: Optional[str] = None
    description: Optional[str] = None


class SkillCreate(SkillBase):
    """技能创建 Schema"""
    long_description: Optional[str] = None
    subcategory: Optional[str] = None
    tags: List[str] = []
    version: str = "1.0.0"
    author_name: Optional[str] = None
    author_avatar_url: Optional[str] = None
    github_repo: Optional[str] = None
    github_path: Optional[str] = None
    source_url: Optional[str] = None
    source_platform: str = "skillhub"
    external_id: Optional[str] = None
    stars_count: int = 0
    rating_score: float = 0
    rating_level: Optional[str] = None
    supported_agents: List[str] = []
    skill_content: Optional[str] = None
    skill_md_url: Optional[str] = None
    icon_url: Optional[str] = None
    is_official: bool = False
    is_featured: bool = False


class SkillUpdate(BaseModel):
    """技能更新 Schema"""
    name: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    tags: Optional[List[str]] = None
    version: Optional[str] = None
    stars_count: Optional[int] = None
    download_count: Optional[int] = None
    rating_score: Optional[float] = None
    rating_level: Optional[str] = None
    skill_content: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class SkillResponse(SkillBase):
    """技能响应 Schema"""
    id: int
    long_description: Optional[str] = None
    subcategory: Optional[str] = None
    tags: Optional[List[str]] = []
    version: str = "1.0.0"

    # 作者信息
    author_name: Optional[str] = None
    author_avatar_url: Optional[str] = None
    github_repo: Optional[str] = None

    # 来源
    source_url: Optional[str] = None
    source_platform: Optional[str] = None

    # 统计
    stars_count: int = 0
    download_count: int = 0
    install_count: int = 0
    view_count: int = 0

    # 评分
    rating_score: float = 0
    rating_level: Optional[str] = None

    # 兼容性
    supported_agents: Optional[List[str]] = []

    # 文件
    skill_md_url: Optional[str] = None

    # 元数据
    icon_url: Optional[str] = None
    is_official: bool = False
    is_published: bool = True
    is_featured: bool = False

    created_at: datetime
    updated_at: Optional[datetime] = None
    source_updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SkillDetailResponse(SkillResponse):
    """技能详情响应 Schema"""
    skill_content: Optional[str] = None


class SkillCategoryResponse(BaseModel):
    """技能分类响应 Schema"""
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    skill_count: int = 0
    sort_order: int = 0

    class Config:
        from_attributes = True


class SkillListResponse(BaseModel):
    """技能列表响应 Schema"""
    data: List[SkillResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class SkillDownloadResponse(BaseModel):
    """技能下载响应 Schema"""
    download_url: Optional[str] = None
    content: Optional[str] = None
    filename: str
    file_size: int
    version: str