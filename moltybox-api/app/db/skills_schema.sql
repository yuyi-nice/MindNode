-- 技能表
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    version VARCHAR(50) DEFAULT '1.0.0',

    -- 作者信息
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(500),
    github_repo VARCHAR(500),
    github_path VARCHAR(255),

    -- 来源信息
    source_url VARCHAR(500),
    source_platform VARCHAR(100) DEFAULT 'skillhub',
    external_id VARCHAR(255),

    -- 统计数据
    stars_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    install_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- 评分
    rating_score DECIMAL(3, 2) DEFAULT 0,
    rating_level VARCHAR(10),

    -- 兼容性
    supported_agents TEXT[],

    -- 文件内容
    skill_content TEXT,
    skill_md_url VARCHAR(500),

    -- 元数据
    icon_url VARCHAR(500),
    is_official BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- 时间戳
    source_updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_stars ON skills(stars_count DESC);
CREATE INDEX IF NOT EXISTS idx_skills_rating ON skills(rating_score DESC);
CREATE INDEX IF NOT EXISTS idx_skills_downloads ON skills(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_skills_source_id ON skills(external_id, source_platform);

-- 技能分类表
CREATE TABLE IF NOT EXISTS skill_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    skill_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认分类
INSERT INTO skill_categories (name, slug, description, sort_order) VALUES
('Development', 'development', 'Coding, debugging, code review, refactoring', 1),
('DevOps', 'devops', 'CI/CD, containerization, infrastructure management', 2),
('Testing', 'testing', 'Unit testing, integration testing, performance testing', 3),
('Data', 'data', 'Data analysis, data cleaning, data visualization, ETL', 4),
('AI & ML', 'ai-ml', 'Machine learning, deep learning, model training, inference', 5),
('Automation', 'automation', 'Workflow automation, script execution, batch processing', 6),
('Documentation', 'documentation', 'Documentation generation, technical writing', 7),
('Communication', 'communication', 'Email, messages, notifications, report generation', 8),
('Content', 'content', 'Article writing, translation, summarization', 9),
('Research', 'research', 'Information retrieval, data collection, market research', 10),
('Design', 'design', 'UI/UX, prototyping, image processing', 11),
('Business', 'business', 'CRM, sales, finance, project management', 12),
('Security', 'security', 'Vulnerability scanning, code audit, compliance', 13),
('Integration', 'integration', 'API integration, third-party services', 14),
('Utilities', 'utilities', 'Format conversion, file processing, calculation', 15)
ON CONFLICT (slug) DO NOTHING;