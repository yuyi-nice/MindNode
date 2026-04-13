"""
数据库初始化脚本 - 创建表结构和初始数据

使用方法：
    python -m app.db.init_db
"""
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.database import db
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_tables():
    """创建数据库表"""
    logger.info("开始创建数据库表...")

    # 1. 用户表
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            avatar_url VARCHAR(500),
            is_active BOOLEAN DEFAULT TRUE,
            is_verified BOOLEAN DEFAULT FALSE,
            is_superuser BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    """)
    logger.info("创建表：users")

    # 2. AI 模型表
    db.execute("""
        CREATE TABLE IF NOT EXISTS ai_models (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            display_name VARCHAR(255),
            provider VARCHAR(100) NOT NULL,
            provider_logo VARCHAR(500),
            type VARCHAR(50) NOT NULL,
            family VARCHAR(100),
            context_window INTEGER,
            max_output_tokens INTEGER,
            input_types TEXT[],
            output_types TEXT[],
            supported_languages TEXT[],
            pricing_input DECIMAL(10, 2),
            pricing_output DECIMAL(10, 2),
            currency VARCHAR(10),
            is_available BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：ai_models")

    # 3. 技能表
    db.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            version VARCHAR(50),
            category VARCHAR(100),
            subcategory VARCHAR(100),
            tags TEXT[],
            description TEXT,
            long_description TEXT,
            icon_url VARCHAR(500),
            author_id INTEGER,
            author_name VARCHAR(255),
            is_official BOOLEAN DEFAULT FALSE,
            download_count INTEGER DEFAULT 0,
            install_count INTEGER DEFAULT 0,
            rating DECIMAL(3, 2),
            rating_count INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP
        )
    """)
    logger.info("创建表：skills")

    # 4. 智能体表
    db.execute("""
        CREATE TABLE IF NOT EXISTS agents (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            tagline VARCHAR(500),
            category VARCHAR(100),
            industry VARCHAR(100),
            description TEXT,
            long_description TEXT,
            icon_url VARCHAR(500),
            skills INTEGER[],
            capabilities TEXT[],
            integrations TEXT[],
            usage_count INTEGER DEFAULT 0,
            active_user_count INTEGER DEFAULT 0,
            rating DECIMAL(3, 2),
            rating_count INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            is_template BOOLEAN DEFAULT TRUE,
            pricing_type VARCHAR(50),
            price INTEGER DEFAULT 0,
            created_by INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP
        )
    """)
    logger.info("创建表：agents")

    # 5. 硬件产品表
    db.execute("""
        CREATE TABLE IF NOT EXISTS hardware_products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            price INTEGER NOT NULL,
            original_price INTEGER,
            currency VARCHAR(10) DEFAULT 'CNY',
            short_description TEXT,
            tagline VARCHAR(500),
            description TEXT,
            specs JSONB,
            features TEXT[],
            images TEXT[],
            cover_image VARCHAR(500),
            stock INTEGER DEFAULT 0,
            sku VARCHAR(100),
            is_available BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            is_new BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            view_count INTEGER DEFAULT 0,
            purchase_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP
        )
    """)
    logger.info("创建表：hardware_products")

    # 6. 定价计划表
    db.execute("""
        CREATE TABLE IF NOT EXISTS pricing_plans (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            price INTEGER DEFAULT 0,
            annual_price INTEGER DEFAULT 0,
            currency VARCHAR(10) DEFAULT 'CNY',
            description TEXT,
            tagline VARCHAR(500),
            features TEXT[],
            limits JSONB,
            is_available BOOLEAN DEFAULT TRUE,
            is_popular BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            subscriber_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：pricing_plans")

    # 7. 博客文章表
    db.execute("""
        CREATE TABLE IF NOT EXISTS blog_posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            excerpt TEXT,
            content TEXT,
            cover_image VARCHAR(500),
            author_id INTEGER,
            author_name VARCHAR(255),
            category VARCHAR(100),
            tags TEXT[],
            is_published BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            view_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP
        )
    """)
    logger.info("创建表：blog_posts")

    # 8. 文档表
    db.execute("""
        CREATE TABLE IF NOT EXISTS documentations (
            id SERIAL PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            parent_id INTEGER REFERENCES documentations(id),
            content TEXT,
            "order" INTEGER DEFAULT 0,
            category VARCHAR(100),
            is_published BOOLEAN DEFAULT TRUE,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：documentations")

    # 9. 企业案例表
    db.execute("""
        CREATE TABLE IF NOT EXISTS enterprise_cases (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            industry VARCHAR(100),
            logo_url VARCHAR(500),
            challenge TEXT,
            solution TEXT,
            results TEXT[],
            testimonial TEXT,
            testimonial_author VARCHAR(255),
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：enterprise_cases")

    # 10. 合伙人申请表
    db.execute("""
        CREATE TABLE IF NOT EXISTS partner_applications (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            region VARCHAR(255),
            partner_type VARCHAR(100),
            resources TEXT,
            application_no VARCHAR(100) UNIQUE,
            status VARCHAR(50) DEFAULT 'pending',
            submitted_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：partner_applications")

    # 11. 推荐官申请表
    db.execute("""
        CREATE TABLE IF NOT EXISTS referral_applications (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            company VARCHAR(255),
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：referral_applications")

    # 12. 企业咨询表
    db.execute("""
        CREATE TABLE IF NOT EXISTS enterprise_inquiries (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(255),
            contact_name VARCHAR(255),
            contact_email VARCHAR(255),
            contact_phone VARCHAR(50),
            industry VARCHAR(100),
            employee_count VARCHAR(50),
            use_case TEXT,
            interested_products TEXT[],
            budget_range VARCHAR(100),
            timeline VARCHAR(100),
            inquiry_no VARCHAR(100) UNIQUE,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：enterprise_inquiries")

    # 13. 硬件订单表
    db.execute("""
        CREATE TABLE IF NOT EXISTS hardware_orders (
            id SERIAL PRIMARY KEY,
            order_no VARCHAR(100) UNIQUE NOT NULL,
            product_id INTEGER REFERENCES hardware_products(id),
            product_name VARCHAR(255),
            customer_name VARCHAR(255),
            customer_email VARCHAR(255),
            customer_phone VARCHAR(50),
            shipping_address TEXT,
            quantity INTEGER DEFAULT 1,
            total_price INTEGER,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：hardware_orders")

    # 14. 客户端版本表
    db.execute("""
        CREATE TABLE IF NOT EXISTS client_versions (
            id SERIAL PRIMARY KEY,
            platform VARCHAR(50) NOT NULL,
            architecture VARCHAR(50) NOT NULL,
            version VARCHAR(50) NOT NULL,
            build_number INTEGER,
            release_notes TEXT,
            download_url VARCHAR(500),
            file_size BIGINT,
            checksum_sha256 VARCHAR(255),
            recommended BOOLEAN DEFAULT TRUE,
            required BOOLEAN DEFAULT FALSE,
            is_published BOOLEAN DEFAULT TRUE,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (platform, architecture, version)
        )
    """)
    logger.info("创建表：client_versions")

    # 15. API 密钥表
    db.execute("""
        CREATE TABLE IF NOT EXISTS api_keys (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            name VARCHAR(255) NOT NULL,
            key_hash VARCHAR(255) UNIQUE NOT NULL,
            prefix VARCHAR(20),
            is_active BOOLEAN DEFAULT TRUE,
            last_used_at TIMESTAMP,
            request_count INTEGER DEFAULT 0,
            request_limit INTEGER DEFAULT 1000,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP
        )
    """)
    logger.info("创建表：api_keys")

    # 16. 页面浏览统计表
    db.execute("""
        CREATE TABLE IF NOT EXISTS page_views (
            id SERIAL PRIMARY KEY,
            page VARCHAR(255) NOT NULL,
            ip_address VARCHAR(50),
            user_agent TEXT,
            referer VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    logger.info("创建表：page_views")

    logger.info("数据库表创建完成！")


def insert_initial_data():
    """插入初始数据"""
    logger.info("开始插入初始数据...")

    # 1. 插入默认管理员用户
    db.execute("""
        INSERT INTO users (email, username, hashed_password, full_name, is_active, is_verified, is_superuser)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING
    """, ('admin@moltybox.ai', 'admin', '$2b$12$xPNC9Cty3ZaVVSiMaJQVh.zy0ori9ssGL4TgOZuBBpU0YYG0MoxRq', '管理员', True, True, True))
    logger.info("插入数据：admin 用户")

    # 2. 插入 AI 模型
    models_data = [
        ('DeepSeek-V3', 'deepseek-v3', 'DeepSeek V3', 'DeepSeek', '/images/providers/deepseek.png', 'llm', 'DeepSeek', 128000, 8000,
         ['text', 'image'], ['text', 'code'], ['zh', 'en'], 0.27, 1.10, 'CNY', True, True, 1, 'DeepSeek 最新一代大语言模型'),
        ('Claude-3.5-Sonnet', 'claude-3-5-sonnet', 'Claude 3.5 Sonnet', 'Anthropic', '/images/providers/anthropic.png', 'llm', 'Claude', 200000, 8192,
         ['text', 'image'], ['text', 'code'], ['zh', 'en', 'ja'], 3.0, 15.0, 'CNY', True, True, 2, 'Anthropic 最强代码和推理能力模型'),
        ('Qwen2.5-72B', 'qwen2-5-72b', 'Qwen2.5 72B', 'Alibaba', '/images/providers/alibaba.png', 'llm', 'Qwen', 128000, 8192,
         ['text'], ['text', 'code'], ['zh', 'en'], 2.0, 6.0, 'CNY', True, False, 3, '阿里云通义千问开源最强模型'),
        ('GPT-4o', 'gpt-4o', 'GPT-4o', 'OpenAI', '/images/providers/openai.png', 'llm', 'GPT-4', 128000, 4096,
         ['text', 'image', 'audio'], ['text', 'code'], ['zh', 'en', 'ja', 'ko'], 5.0, 15.0, 'CNY', True, True, 0, 'OpenAI 多模态旗舰模型'),
    ]
    for m in models_data:
        db.execute("""
            INSERT INTO ai_models (name, slug, display_name, provider, provider_logo, type, family, context_window, max_output_tokens,
                input_types, output_types, supported_languages, pricing_input, pricing_output, currency, is_available, is_featured, sort_order, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
        """, m)
    logger.info("插入数据：AI 模型")

    # 3. 插入技能
    skills_data = [
        ('Computer Use', 'computer-use', '1.0.0', 'automation', '桌面自动化', ['computer', 'automation', 'gui'],
         '让 AI 控制电脑完成各种任务', '# Computer Use 技能', '/images/skills/computer-use.png', 1, 'MoltyBox', True, 1523, 892, 4.8, 156, True, True),
        ('Web 自动化', 'web-automation', '2.1.0', 'automation', '网页自动化', ['selenium', 'playwright', 'web'],
         '自动执行网页操作任务', '# Web 自动化技能', '/images/skills/web-automation.png', 1, 'MoltyBox', True, 2341, 1567, 4.7, 234, True, True),
        ('数据分析', 'data-analysis', '1.5.0', 'analysis', '数据处理', ['pandas', 'numpy', 'excel'],
         '专业数据分析工具', '# 数据分析技能', '/images/skills/data-analysis.png', 2, 'DataPro', False, 1876, 1234, 4.6, 189, True, False),
        ('文档生成', 'document-generation', '1.2.0', 'creation', '文档处理', ['docx', 'pdf', 'template'],
         '自动生成各类文档', '# 文档生成技能', '/images/skills/doc-gen.png', 1, 'MoltyBox', True, 956, 678, 4.5, 87, True, False),
    ]
    for s in skills_data:
        db.execute("""
            INSERT INTO skills (name, slug, version, category, subcategory, tags, description, long_description, icon_url,
                author_id, author_name, is_official, download_count, install_count, rating, rating_count, is_published, is_featured)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
        """, s)
    logger.info("插入数据：技能")

    # 4. 插入智能体
    agents_data = [
        ('客服助手', 'customer-service-assistant', '7x24 小时智能客服', 'customer_service', '电商',
         '专为电商设计的智能客服助手', '# 客服助手', '/images/agents/customer-service.png', [1, 2], ['multi_turn', 'file_upload'],
         ['whatsapp', 'wechat'], 5623, 1234, 4.7, 342, True, True, True, 'freemium', 0, 1),
        ('数据分析师', 'data-analyst', '你的专属数据分析师', 'analysis', '通用',
         '专业数据分析智能体', '# 数据分析师', '/images/agents/data-analyst.png', [3], ['file_upload', 'code_execution'],
         [], 3421, 876, 4.8, 213, True, True, True, 'paid', 9900, 1),
        ('内容创作家', 'content-creator', '自媒体内容创作助手', 'marketing', '媒体',
         '帮助你创作优质内容', '# 内容创作家', '/images/agents/content-creator.png', [4], ['multi_turn'],
         [], 2156, 543, 4.5, 167, True, False, True, 'free', 0, 2),
    ]
    for a in agents_data:
        db.execute("""
            INSERT INTO agents (name, slug, tagline, category, industry, description, long_description, icon_url,
                skills, capabilities, integrations, usage_count, active_user_count, rating, rating_count,
                is_published, is_featured, is_template, pricing_type, price, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
        """, a)
    logger.info("插入数据：智能体")

    # 5. 插入硬件产品
    mini_specs = '{"processor": "Intel Core i5-12450H", "memory": "8GB DDR4", "storage": "256GB NVMe SSD", "os": "Windows 11 Pro"}'
    mini_features = ['开箱即用', '私有安全', '全能助手', '远程协同', '低功耗', '静音设计']
    mini_images = ['/images/hardware/mini-1.jpg', '/images/hardware/mini-2.jpg']
    db.execute("""
        INSERT INTO hardware_products (name, slug, price, original_price, currency, short_description, tagline, description,
            specs, features, images, cover_image, stock, sku, is_available, is_featured, is_new, sort_order, view_count, purchase_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('MoltyBox Mini', 'moltybox-mini', 299900, 349900, 'CNY',
        '入门级 AI 盒子，适合个人用户', '小巧强大，开箱即用',
        '# MoltyBox Mini', mini_specs, mini_features, mini_images,
        '/images/hardware/mini-cover.jpg', 100, 'MB-MINI-001', True, True, False, 1, 15234, 892))

    pro_specs = '{"processor": "Intel Core i7-13700H", "memory": "32GB DDR5", "storage": "1TB NVMe SSD", "os": "Windows 11 Pro"}'
    pro_features = ['强劲性能', '企业安全', '多模型并发', '专属支持', '可扩展存储', '冗余电源']
    pro_images = ['/images/hardware/pro-1.jpg', '/images/hardware/pro-2.jpg']
    db.execute("""
        INSERT INTO hardware_products (name, slug, price, original_price, currency, short_description, tagline, description,
            specs, features, images, cover_image, stock, sku, is_available, is_featured, is_new, sort_order, view_count, purchase_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('MoltyBox Pro', 'moltybox-pro', 599900, 699900, 'CNY',
        '专业级 AI 盒子，适合企业和团队', '强劲性能，专业之选',
        '# MoltyBox Pro', pro_specs, pro_features, pro_images,
        '/images/hardware/pro-cover.jpg', 50, 'MB-PRO-001', True, True, True, 2, 8765, 234))
    logger.info("插入数据：硬件产品")

    # 6. 插入定价计划
    plans_data = [
        ('个人版', 'free', 0, 0, 'CNY', '适合个人用户和开发者', '永久免费',
         ['10 个技能', '5 个智能体', '基础模型访问', '社区支持'],
         '{"max_skills": 10, "max_agents": 5, "storage_gb": 10}', True, False, 1, 15230),
        ('专业版', 'pro', 29900, 299000, 'CNY', '适合专业用户和小型团队', '最受欢迎',
         ['无限技能', '无限智能体', '所有模型访问', '优先支持', '云端同步', 'API 访问'],
         '{"max_skills": -1, "max_agents": -1, "storage_gb": 100}', True, True, 2, 3420),
        ('团队版', 'team', 99900, 999000, 'CNY', '适合成长型团队', '高效协作',
         ['专业版所有功能', '10 个团队成员', '团队协作空间', '管理员控制台', 'SSO 单点登录', '专属客户成功经理'],
         '{"max_skills": -1, "max_agents": -1, "storage_gb": 500, "max_members": 10}', True, False, 3, 567),
    ]
    for p in plans_data:
        db.execute("""
            INSERT INTO pricing_plans (name, slug, price, annual_price, currency, description, tagline, features, limits,
                is_available, is_popular, sort_order, subscriber_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s)
            ON CONFLICT (slug) DO NOTHING
        """, p)
    logger.info("插入数据：定价计划")

    # 7. 插入博客文章
    db.execute("""
        INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, author_name, category, tags, is_published, view_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('MoltyBox 1.0 正式发布：开启 AI 智能体新时代',
        'moltybox-1-0-release',
        '我们很高兴地宣布 MoltyBox 1.0 正式发布，带来全新的 AI 智能体体验。',
        '# MoltyBox 1.0 正式发布',
        '/images/blog/release-1-0.jpg',
        1, 'MoltyBox 团队', 'product', ['发布', '产品更新'], True, 5234))
    db.execute("""
        INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, author_name, category, tags, is_published, view_count)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('如何使用 Computer Use 技能自动化日常工作',
        'computer-use-tutorial',
        '学习如何使用 Computer Use 技能来自动化你的日常工作流程。',
        '# Computer Use 技能教程',
        '/images/blog/computer-use.jpg',
        1, 'MoltyBox 团队', 'tutorial', ['教程', '技能', '自动化'], True, 3421))
    logger.info("插入数据：博客文章")

    # 8. 插入文档
    db.execute("""
        INSERT INTO documentations (title, slug, parent_id, content, "order", category, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('快速开始', 'quick-start', None, '# 快速开始', 1, 'getting-started', True))
    db.execute("""
        INSERT INTO documentations (title, slug, parent_id, content, "order", category, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('安装指南', 'installation', 1, '# 安装指南', 1, 'getting-started', True))
    db.execute("""
        INSERT INTO documentations (title, slug, parent_id, content, "order", category, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('核心概念', 'core-concepts', None, '# 核心概念', 2, 'concepts', True))
    logger.info("插入数据：文档")

    # 9. 插入企业案例
    db.execute("""
        INSERT INTO enterprise_cases (company_name, slug, industry, challenge, solution, results, testimonial, testimonial_author, is_featured)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('某金融科技公司', 'fintech-customer-service', '金融',
        '客服人力成本高，响应速度慢，客户满意度低',
        '部署 MoltyBox AI 客服系统，处理 80% 的常见咨询',
        ['客服效率提升 300%', '人力成本降低 60%', '客户满意度从 75% 提升至 95%', '7x24 小时不间断服务'],
        'MoltyBox 帮助我们彻底改造了客服体系', '张总，CTO', True))
    db.execute("""
        INSERT INTO enterprise_cases (company_name, slug, industry, challenge, solution, results, testimonial, testimonial_author, is_featured)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO NOTHING
    """, ('某电商公司', 'ecommerce-operations', '电商',
        '运营流程复杂，人工操作错误率高',
        '使用 MoltyBox 自动化技能处理订单、库存、物流',
        ['订单处理时间从 2 小时降至 10 分钟', '错误率从 5% 降至 0.1%', '运营效率提升 400%'],
        'MoltyBox 的自动化技能让我们的运营团队可以专注于更有价值的工作', '李总，运营总监', True))
    logger.info("插入数据：企业案例")

    # 10. 插入客户端版本
    db.execute("""
        INSERT INTO client_versions (platform, architecture, version, build_number, release_notes, download_url, file_size, recommended, required, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (platform, architecture, version) DO NOTHING
    """, ('windows', 'x64', '1.2.0', 120,
        '## 更新内容\n\n- 新增支持 Claude-3.5 模型\n- 优化 Computer Use 技能性能',
        'https://download.moltybox.ai/windows/x64/MoltyBox-1.2.0.exe',
        157286400, True, False, True))
    db.execute("""
        INSERT INTO client_versions (platform, architecture, version, build_number, release_notes, download_url, file_size, recommended, required, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (platform, architecture, version) DO NOTHING
    """, ('macos', 'arm64', '1.2.0', 120,
        '## 更新内容\n\n- 新增支持 Claude-3.5 模型\n- 优化 Computer Use 技能性能',
        'https://download.moltybox.ai/macos/arm64/MoltyBox-1.2.0.dmg',
        145678900, True, False, True))
    logger.info("插入数据：客户端版本")

    logger.info("初始数据插入完成！")


def main():
    """主函数"""
    logger.info("=" * 50)
    logger.info(f"数据库初始化：{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}")
    logger.info("=" * 50)

    try:
        # 测试连接
        logger.info("测试数据库连接...")
        result = db.fetch_one("SELECT version()")
        logger.info(f"PostgreSQL 版本：{result['version'][:60]}")

        # 创建表
        create_tables()

        # 插入初始数据
        insert_initial_data()

        logger.info("=" * 50)
        logger.info("数据库初始化完成！")
        logger.info("=" * 50)

    except Exception as e:
        logger.error(f"数据库初始化失败：{e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
