"""
技能数据库操作模块
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from app.db.database import db

logger = logging.getLogger(__name__)


class SkillDB:
    """技能数据库操作类"""

    def init_table(self):
        """初始化技能表"""
        with open("app/db/skills_schema.sql", "r", encoding="utf-8") as f:
            sql = f.read()
            with db.get_cursor() as cursor:
                cursor.execute(sql)
        logger.info("技能表初始化完成")

    def get_skills(
        self,
        category: str = None,
        search: str = None,
        sort_by: str = "stars",
        page: int = 1,
        page_size: int = 20,
        is_featured: bool = None,
    ) -> tuple[List[Dict[str, Any]], int]:
        """
        获取技能列表
        Returns: (skills_list, total_count)
        """
        offset = (page - 1) * page_size

        # 构建查询条件
        conditions = ["is_published = TRUE"]
        params = []

        if category:
            conditions.append("category = %s")
            params.append(category)

        if search:
            conditions.append("(name ILIKE %s OR description ILIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])

        if is_featured is not None:
            conditions.append("is_featured = %s")
            params.append(is_featured)

        where_clause = " AND ".join(conditions)

        # 排序
        sort_mapping = {
            "stars": "stars_count DESC",
            "downloads": "download_count DESC",
            "rating": "rating_score DESC",
            "newest": "created_at DESC",
            "name": "name ASC",
        }
        order_by = sort_mapping.get(sort_by, "stars_count DESC")

        # 查询总数
        count_query = f"SELECT COUNT(*) as total FROM skills WHERE {where_clause}"
        total = db.fetch_one(count_query, tuple(params))["total"]

        # 查询列表
        query = f"""
            SELECT * FROM skills
            WHERE {where_clause}
            ORDER BY {order_by}
            LIMIT %s OFFSET %s
        """
        params.extend([page_size, offset])

        skills = db.fetch_all(query, tuple(params))
        return [dict(s) for s in skills], total

    def get_skill_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取技能"""
        query = "SELECT * FROM skills WHERE slug = %s"
        result = db.fetch_one(query, (slug,))
        return dict(result) if result else None

    def get_skill_by_external_id(self, external_id: str, platform: str = "skillhub") -> Optional[Dict[str, Any]]:
        """根据外部 ID 获取技能"""
        query = "SELECT * FROM skills WHERE external_id = %s AND source_platform = %s"
        result = db.fetch_one(query, (external_id, platform))
        return dict(result) if result else None

    def create_skill(self, skill_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建技能"""
        query = """
            INSERT INTO skills (
                name, slug, description, long_description, category, subcategory,
                tags, version, author_name, author_avatar_url, github_repo, github_path,
                source_url, source_platform, external_id, stars_count, download_count,
                rating_score, rating_level, supported_agents, skill_content, skill_md_url,
                icon_url, is_official, is_featured, source_updated_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            ) RETURNING *
        """
        params = (
            skill_data.get("name"),
            skill_data.get("slug"),
            skill_data.get("description"),
            skill_data.get("long_description"),
            skill_data.get("category"),
            skill_data.get("subcategory"),
            skill_data.get("tags", []),
            skill_data.get("version", "1.0.0"),
            skill_data.get("author_name"),
            skill_data.get("author_avatar_url"),
            skill_data.get("github_repo"),
            skill_data.get("github_path"),
            skill_data.get("source_url"),
            skill_data.get("source_platform", "skillhub"),
            skill_data.get("external_id"),
            skill_data.get("stars_count", 0),
            skill_data.get("download_count", 0),
            skill_data.get("rating_score", 0),
            skill_data.get("rating_level"),
            skill_data.get("supported_agents", []),
            skill_data.get("skill_content"),
            skill_data.get("skill_md_url"),
            skill_data.get("icon_url"),
            skill_data.get("is_official", False),
            skill_data.get("is_featured", False),
            skill_data.get("source_updated_at"),
        )

        result = db.fetch_one(query, params)
        return dict(result)

    def upsert_skill(self, skill_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建或更新技能（基于 external_id）"""
        existing = self.get_skill_by_external_id(
            skill_data.get("external_id"),
            skill_data.get("source_platform", "skillhub")
        )

        if existing:
            # 更新
            return self.update_skill(existing["id"], skill_data)
        else:
            # 创建
            return self.create_skill(skill_data)

    def update_skill(self, skill_id: int, skill_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新技能"""
        # 构建动态更新语句
        update_fields = []
        params = []

        field_mapping = {
            "name": "name",
            "description": "description",
            "long_description": "long_description",
            "category": "category",
            "subcategory": "subcategory",
            "tags": "tags",
            "version": "version",
            "stars_count": "stars_count",
            "download_count": "download_count",
            "rating_score": "rating_score",
            "rating_level": "rating_level",
            "skill_content": "skill_content",
            "is_featured": "is_featured",
            "source_updated_at": "source_updated_at",
        }

        for key, field in field_mapping.items():
            if key in skill_data:
                update_fields.append(f"{field} = %s")
                params.append(skill_data[key])

        if not update_fields:
            return self.get_skill_by_id(skill_id)

        update_fields.append("updated_at = CURRENT_TIMESTAMP")

        query = f"""
            UPDATE skills
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING *
        """
        params.append(skill_id)

        result = db.fetch_one(query, tuple(params))
        return dict(result)

    def get_skill_by_id(self, skill_id: int) -> Optional[Dict[str, Any]]:
        """根据 ID 获取技能"""
        query = "SELECT * FROM skills WHERE id = %s"
        result = db.fetch_one(query, (skill_id,))
        return dict(result) if result else None

    def increment_download_count(self, skill_id: int):
        """增加下载计数"""
        query = "UPDATE skills SET download_count = download_count + 1 WHERE id = %s"
        db.execute(query, (skill_id,))

    def increment_view_count(self, skill_id: int):
        """增加浏览计数"""
        query = "UPDATE skills SET view_count = view_count + 1 WHERE id = %s"
        db.execute(query, (skill_id,))

    def get_categories(self) -> List[Dict[str, Any]]:
        """获取所有分类"""
        query = """
            SELECT c.*, COUNT(s.id) as skill_count
            FROM skill_categories c
            LEFT JOIN skills s ON c.slug = s.category AND s.is_published = TRUE
            GROUP BY c.id
            ORDER BY c.sort_order
        """
        results = db.fetch_all(query)
        return [dict(r) for r in results]

    def get_featured_skills(self, limit: int = 6) -> List[Dict[str, Any]]:
        """获取推荐技能"""
        query = """
            SELECT * FROM skills
            WHERE is_published = TRUE AND is_featured = TRUE
            ORDER BY stars_count DESC
            LIMIT %s
        """
        results = db.fetch_all(query, (limit,))
        return [dict(r) for r in results]

    def search_skills(self, query_text: str, limit: int = 10) -> List[Dict[str, Any]]:
        """搜索技能"""
        query = """
            SELECT * FROM skills
            WHERE is_published = TRUE
            AND (name ILIKE %s OR description ILIKE %s OR %s = ANY(tags))
            ORDER BY stars_count DESC
            LIMIT %s
        """
        search_pattern = f"%{query_text}%"
        results = db.fetch_all(query, (search_pattern, search_pattern, query_text, limit))
        return [dict(r) for r in results]

    def bulk_upsert_skills(self, skills: List[Dict[str, Any]]) -> int:
        """批量创建或更新技能"""
        count = 0
        for skill in skills:
            try:
                self.upsert_skill(skill)
                count += 1
            except Exception as e:
                logger.error(f"保存技能失败: {skill.get('name')}, {e}")
        return count


# 全局实例
skill_db = SkillDB()