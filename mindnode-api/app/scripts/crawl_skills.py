"""
技能爬取脚本 - 从 skillhub.club 爬取技能并保存到数据库
运行方式: python -m app.scripts.crawl_skills
"""
import asyncio
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.skill_crawler import SkillHubCrawler
from app.db.skill_db import skill_db
from app.db.database import db
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def main():
    """主函数"""
    import argparse

    parser = argparse.ArgumentParser(description='爬取 skillhub.club 技能数据')
    parser.add_argument('--max', type=int, default=100, help='最大爬取数量')
    parser.add_argument('--init-db', action='store_true', help='初始化数据库表')
    parser.add_argument('--enrich', action='store_true', help='从 GitHub 补充技能内容')

    args = parser.parse_args()

    # 初始化数据库连接
    try:
        db.init_pool()
        logger.info("数据库连接成功")

        if args.init_db:
            logger.info("初始化数据库表...")
            skill_db.init_table()

    except Exception as e:
        logger.error(f"数据库连接失败: {e}")
        return

    # 开始爬取
    logger.info(f"开始爬取技能，最大数量: {args.max}")

    crawler = SkillHubCrawler()

    try:
        skills = await crawler.crawl_skills(max_skills=args.max)
        logger.info(f"爬取完成，共 {len(skills)} 个技能")

        # 保存到数据库
        if skills:
            logger.info("保存到数据库...")
            count = skill_db.bulk_upsert_skills(skills)
            logger.info(f"成功保存 {count} 个技能")

        # 补充技能内容
        if args.enrich:
            logger.info("从 GitHub 补充技能内容...")
            async with crawler:
                for i, skill in enumerate(skills[:20]):  # 只处理前20个
                    if skill.get("github_repo"):
                        logger.info(f"[{i+1}/{len(skills[:20])}] 获取: {skill['name']}")
                        enriched = await crawler.enrich_skill_content(skill)
                        skill_db.update_skill(skill_db.get_skill_by_external_id(
                            skill["external_id"]
                        )["id"], enriched)
                        await asyncio.sleep(1)

    except Exception as e:
        logger.error(f"爬取失败: {e}")
        raise

    finally:
        db.close()

    logger.info("完成！")


if __name__ == "__main__":
    asyncio.run(main())