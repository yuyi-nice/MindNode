# 技能爬虫脚本使用说明

## 概述

`crawl_skills.py` 是一个用于从 skillhub.club 爬取 AI Agent 技能数据并保存到本地数据库的命令行工具。

## 前置要求

1. **数据库配置**：确保 PostgreSQL 数据库已启动，并在 `app/core/config.py` 中正确配置连接信息

2. **安装依赖**：
   ```bash
   pip install aiohttp
   ```

## 使用方法

### 基本命令

```bash
cd moltybox-api
python -m app.scripts.crawl_skills [选项]
```

### 命令行选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--max` | int | 100 | 最大爬取数量 |
| `--init-db` | flag | false | 初始化数据库表（首次使用时需要） |
| `--enrich` | flag | false | 从 GitHub 补充技能内容 |

### 使用示例

#### 1. 首次使用（初始化数据库）

```bash
python -m app.scripts.crawl_skills --init-db --max 100
```

这会：
- 创建 `skills` 表和 `skill_categories` 表
- 插入默认的 15 个分类
- 爬取最多 100 个技能

#### 2. 常规爬取

```bash
python -m app.scripts.crawl_skills --max 50
```

仅爬取 50 个技能，不初始化数据库。

#### 3. 补充技能内容

```bash
python -m app.scripts.crawl_skills --enrich
```

从 GitHub 仓库获取 SKILL.md 文件内容，补充到已有技能中。

## 数据结构

### 技能数据字段

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 技能名称 |
| slug | string | URL 友好的唯一标识 |
| description | string | 简短描述 |
| long_description | text | 详细描述 |
| category | string | 分类 slug |
| tags | array | 标签列表 |
| version | string | 版本号 |
| author_name | string | 作者名称 |
| github_repo | string | GitHub 仓库 (owner/repo) |
| github_path | string | 技能在仓库中的路径 |
| stars_count | int | Star 数量 |
| download_count | int | 下载次数 |
| rating_score | float | 评分 (0-10) |
| rating_level | string | 评级 (S/A/B/C/D) |
| supported_agents | array | 兼容的 Agent 列表 |
| skill_content | text | SKILL.md 文件内容 |

### 默认分类

1. Development - 开发
2. DevOps - 运维
3. Testing - 测试
4. Data - 数据
5. AI & ML - 人工智能
6. Automation - 自动化
7. Documentation - 文档
8. Communication - 通讯
9. Content - 内容
10. Research - 研究
11. Design - 设计
12. Business - 商业
13. Security - 安全
14. Integration - 集成
15. Utilities - 工具

## API 接口

爬取完成后，可通过以下 API 访问数据：

### 获取技能列表

```
GET /api/v1/skills?category=development&sort_by=stars&page=1&page_size=20
```

### 获取技能详情

```
GET /api/v1/skills/{slug}
```

### 下载技能

```
GET /api/v1/skills/{slug}/download
```

### 获取分类列表

```
GET /api/v1/skills/categories
```

### 搜索技能

```
GET /api/v1/skills/search?q=react&limit=10
```

## 注意事项

1. **速率限制**：爬虫内置了 1 秒的延迟，避免对目标网站造成过大压力

2. **GitHub API 限制**：未认证的 GitHub API 请求有速率限制（60次/小时），如需大量获取内容，建议配置 GitHub Token

3. **数据更新**：重复运行爬虫会更新已存在的技能数据（基于 `external_id` 去重）

4. **错误处理**：爬虫会记录错误日志，单个技能爬取失败不会影响整体流程

## 故障排除

### 数据库连接失败

检查 `app/core/config.py` 中的数据库配置：
```python
DATABASE_HOST = "localhost"
DATABASE_PORT = 5432
DATABASE_NAME = "moltybox"
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "your_password"
```

### 技能内容为空

部分技能可能没有公开的 GitHub 仓库，或仓库中没有 SKILL.md 文件。可以使用 `--enrich` 选项尝试补充。

### 爬取数量少于预期

目标网站可能没有足够的技能数据，或页面结构发生了变化。检查日志输出了解详情。