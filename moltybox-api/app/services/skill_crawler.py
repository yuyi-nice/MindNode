"""
技能爬虫模块 - 从 GitHub 获取技能数据
"""
import asyncio
import aiohttp
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import re

logger = logging.getLogger(__name__)


class SkillHubCrawler:
    """技能爬虫 - 从 GitHub 仓库获取技能"""

    # 已知的技能仓库列表
    KNOWN_SKILL_REPOS = [
        # Anthropic 官方技能
        ("anthropics", "claude-code", "plugins"),
        # 社区热门技能仓库
        ("anthropics", "claude-code", "skills"),
    ]

    # 直接从 skillhub 获取的技能数据（基于网站分析）
    FEATURED_SKILLS = [
        {
            "name": "frontend-design",
            "description": "Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications.",
            "author_name": "anthropics",
            "github_repo": "anthropics/claude-code",
            "github_path": "plugins/frontend-design",
            "category": "design",
            "tags": ["ui-design", "code-generation", "creative-coding"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 94300,
            "rating_score": 9.5,
            "rating_level": "S",
        },
        {
            "name": "systematic-debugging",
            "description": "A structured approach to debugging software problems that forces root cause analysis before proposing fixes.",
            "author_name": "obra",
            "github_repo": "obra/superpowers",
            "github_path": "systematic-debugging",
            "category": "development",
            "tags": ["debugging", "troubleshooting", "problem-solving"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 128700,
            "rating_score": 9.2,
            "rating_level": "S",
        },
        {
            "name": "file-search",
            "description": "Expert guidance on using ripgrep and ast-grep for efficient codebase searches with targeted search strategies.",
            "author_name": "massgen",
            "github_repo": "massgen/massgen",
            "github_path": "file-search",
            "category": "development",
            "tags": ["code-search", "ripgrep", "ast-grep"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 912,
            "rating_score": 9.0,
            "rating_level": "S",
        },
        {
            "name": "skill-creator",
            "description": "Complete framework and tools for creating Claude Skills, including templates, validation scripts, and packaging tools.",
            "author_name": "davepoon",
            "github_repo": "davepoon/buildwithclaude",
            "github_path": "skill-creator",
            "category": "development",
            "tags": ["skill-development", "tooling", "documentation"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 2700,
            "rating_score": 9.1,
            "rating_level": "S",
        },
        {
            "name": "context-optimization",
            "description": "Comprehensive LLM context optimization skill with clear strategies for token reduction, cost savings, and performance improvements.",
            "author_name": "muratcankoylan",
            "github_repo": "muratcankoylan/agent-skills-for-context-engineering",
            "github_path": "context-optimization",
            "category": "development",
            "tags": ["context", "optimization", "llm"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 14500,
            "rating_score": 8.8,
            "rating_level": "A",
        },
        {
            "name": "docs-review",
            "description": "Structured documentation review skill that enforces writing style guides, supports both local and GitHub PR review modes.",
            "author_name": "metabase",
            "github_repo": "metabase/metabase",
            "github_path": "docs-review",
            "category": "documentation",
            "tags": ["documentation-review", "style-guide", "pull-requests"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 46700,
            "rating_score": 8.5,
            "rating_level": "A",
        },
        {
            "name": "test-data-management",
            "description": "Comprehensive, production-ready test data management skill with privacy compliance, practical code examples, and clear test scenario strategies.",
            "author_name": "proffesor-for-testing",
            "github_repo": "proffesor-for-testing/agentic-qe",
            "github_path": "test-data-management",
            "category": "testing",
            "tags": ["test-data", "data-privacy", "synthetic-data"],
            "supported_agents": ["Claude Code", "Codex CLI", "Gemini CLI"],
            "stars_count": 286,
            "rating_score": 9.2,
            "rating_level": "S",
        },
        {
            "name": "weather",
            "description": "Get current weather and forecasts via wttr.in or Open-Meteo. No API key needed.",
            "author_name": "openclaw",
            "github_repo": "openclaw/openclaw",
            "github_path": "skills/weather",
            "category": "utilities",
            "tags": ["weather", "api", "forecast"],
            "supported_agents": ["Claude Code"],
            "stars_count": 293555,
            "rating_score": 8.0,
            "rating_level": "A",
        },
        {
            "name": "gh-issues",
            "description": "Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs, then monitor and address PR review comments.",
            "author_name": "openclaw",
            "github_repo": "openclaw/openclaw",
            "github_path": "skills/gh-issues",
            "category": "development",
            "tags": ["github", "issues", "automation"],
            "supported_agents": ["Claude Code"],
            "stars_count": 293555,
            "rating_score": 8.5,
            "rating_level": "A",
        },
        {
            "name": "trello",
            "description": "Manage Trello boards, lists, and cards via the Trello REST API.",
            "author_name": "openclaw",
            "github_repo": "openclaw/openclaw",
            "github_path": "skills/trello",
            "category": "integration",
            "tags": ["trello", "project-management", "api"],
            "supported_agents": ["Claude Code"],
            "stars_count": 293555,
            "rating_score": 7.5,
            "rating_level": "B",
        },
    ]

    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.skills_data: List[Dict[str, Any]] = []

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json",
            }
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def fetch_skill_content_from_github(self, github_repo: str, github_path: str) -> Optional[str]:
        """从 GitHub 获取 SKILL.md 内容"""
        # 构建 GitHub API URL
        github_api_url = f"https://api.github.com/repos/{github_repo}/contents/{github_path}"

        try:
            async with self.session.get(github_api_url) as resp:
                if resp.status != 200:
                    logger.warning(f"GitHub API 请求失败: {github_api_url}")
                    return None

                data = await resp.json()

                # 如果是文件列表，查找 SKILL.md
                if isinstance(data, list):
                    for item in data:
                        if item.get("name", "").upper() in ["SKILL.MD", "SKILL_MD", "README.MD"]:
                            download_url = item.get("download_url")
                            if download_url:
                                async with self.session.get(download_url) as content_resp:
                                    if content_resp.status == 200:
                                        return await content_resp.text()
                else:
                    # 单个文件
                    download_url = data.get("download_url")
                    if download_url:
                        async with self.session.get(download_url) as content_resp:
                            if content_resp.status == 200:
                                return await content_resp.text()

        except Exception as e:
            logger.error(f"获取 GitHub 内容失败: {github_repo}/{github_path}, {e}")

        return None

    def transform_skill_data(self, skill: Dict[str, Any]) -> Dict[str, Any]:
        """转换技能数据格式"""
        return {
            "name": skill.get("name", ""),
            "slug": skill.get("name", "").lower().replace("_", "-"),
            "description": skill.get("description", ""),
            "long_description": skill.get("long_description", skill.get("description", "")),
            "category": skill.get("category", "utilities"),
            "subcategory": skill.get("subcategory"),
            "tags": skill.get("tags", []),
            "version": skill.get("version", "1.0.0"),
            "author_name": skill.get("author_name", "unknown"),
            "author_avatar_url": skill.get("author_avatar_url"),
            "github_repo": skill.get("github_repo"),
            "github_path": skill.get("github_path"),
            "source_url": f"https://github.com/{skill.get('github_repo', '')}",
            "source_platform": "github",
            "external_id": f"{skill.get('github_repo', '')}/{skill.get('github_path', '')}",
            "stars_count": skill.get("stars_count", 0),
            "download_count": skill.get("download_count", 0),
            "rating_score": skill.get("rating_score", 0),
            "rating_level": skill.get("rating_level"),
            "supported_agents": skill.get("supported_agents", ["Claude Code"]),
            "skill_content": skill.get("skill_content"),
            "icon_url": skill.get("icon_url"),
            "is_official": skill.get("is_official", False),
            "is_featured": skill.get("is_featured", skill.get("rating_level") == "S"),
        }

    async def crawl_skills(self, max_skills: int = 100, categories: List[str] = None) -> List[Dict[str, Any]]:
        """
        爬取技能数据
        Args:
            max_skills: 最大爬取数量
            categories: 指定分类列表
        """
        logger.info(f"开始获取技能数据，最大数量: {max_skills}")

        skills = []
        async with self:
            # 使用预定义的技能列表
            for skill in self.FEATURED_SKILLS[:max_skills]:
                transformed = self.transform_skill_data(skill)

                # 尝试获取技能内容
                if skill.get("github_repo") and skill.get("github_path"):
                    logger.info(f"获取技能内容: {skill['name']}")
                    content = await self.fetch_skill_content_from_github(
                        skill["github_repo"],
                        skill["github_path"]
                    )
                    if content:
                        transformed["skill_content"] = content
                    await asyncio.sleep(0.5)  # 礼貌性延迟

                skills.append(transformed)

        logger.info(f"共获取 {len(skills)} 个技能")
        return skills

    async def enrich_skill_content(self, skill: Dict[str, Any]) -> Dict[str, Any]:
        """补充技能内容（从 GitHub 获取 SKILL.md）"""
        if skill.get("github_repo") and skill.get("github_path"):
            content = await self.fetch_skill_content_from_github(
                skill["github_repo"],
                skill["github_path"]
            )
            if content:
                skill["skill_content"] = content

        return skill


async def main():
    """测试爬虫"""
    crawler = SkillHubCrawler()
    skills = await crawler.crawl_skills(max_skills=10)

    for skill in skills[:5]:
        print(f"- {skill['name']} ({skill['stars_count']} stars)")
        print(f"  {skill['description'][:80]}...")


if __name__ == "__main__":
    asyncio.run(main())