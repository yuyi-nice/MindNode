# MoltyBox Backend API
基于 FastAPI 的后端 API 服务。
## 快速开始
### 安装依赖
```bash
pip install -r requirements.txt
```
### 配置数据库
编辑 `.env` 文件配置数据库连接：
```env
# 数据库配置
DATABASE_HOST=101.43.232.243
DATABASE_PORT=5432
DATABASE_NAME=mydb
DATABASE_USER=myuser
DATABASE_PASSWORD=mysecretpassword
```
### 初始化数据库
首次运行需要初始化数据库：
```bash
python -m app.db.init_db
```
### 启动开发服务器
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
访问 http://localhost:8000/docs 查看 API 文档。
## 测试账户
| 邮箱 | 密码 | 角色 |
|------|------|------|
| `admin@moltybox.ai` | `admin123` | 管理员 |
| `user@moltybox.ai` | `user123` | 普通用户 |
### 登录 API 示例
```bash
# 登录
curl -X POST "http://localhost:8000/api/v1/auth/login?email=admin@moltybox.ai&password=admin123"
# 返回示例
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@moltybox.ai",
      "username": "admin",
      "full_name": "管理员",
      "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin%40moltybox.ai"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```
## 功能特性
### 认证系统
- JWT Token 认证（Access Token + Refresh Token）
- bcrypt 密码加密
- 用户注册与登录
- 头像自动生成（使用 DiceBear 服务）
### 主要 API 模块
- **认证** - 登录、注册、登出、刷新 Token
- **用户** - 用户信息管理
- **AI 模型** - 模型列表、详情、提供商
- **技能** - 技能市场、分类、安装
- **智能体** - 智能体列表、详情、分类
- **硬件** - 硬件产品、订单
- **定价** - 价格计划、对比
- **博客** - 文章列表、详情
- **文档** - 文档树、搜索
- **企业版** - 案例、咨询
## 项目结构
```
app/
├── main.py              # 应用入口
├── config.py            # 配置管理
├── api/
│   └── v1/
│       ├── router.py    # 路由聚合
│       ├── auth.py      # 认证接口
│       ├── users.py     # 用户接口
│       ├── models.py    # AI 模型接口
│       ├── skills.py    # 技能接口
│       ├── agents.py    # 智能体接口
│       ├── hardware.py  # 硬件接口
│       ├── partners.py  # 合伙人接口
│       ├── referrals.py # 推荐官接口
│       ├── enterprise.py# 企业版接口
│       ├── blog.py      # 博客接口
│       ├── docs.py      # 文档接口
│       ├── pricing.py   # 定价接口
│       ├── client.py    # 客户端接口
│       ├── upload.py    # 上传接口
│       └── analytics.py # 分析接口
├── core/
│   ├── security.py      # 安全工具
│   └── exceptions.py    # 异常处理
├── schemas/             # Pydantic 模式
├── services/            # 业务逻辑
└── mock/                # Mock 数据
```

## 数据库

项目使用 PostgreSQL 18.3 数据库，已创建以下 16 张表：

| 表名 | 描述 |
|------|------|
| `users` | 用户表 |
| `ai_models` | AI 模型表 |
| `skills` | 技能表 |
| `agents` | 智能体表 |
| `hardware_products` | 硬件产品表 |
| `pricing_plans` | 定价计划表 |
| `blog_posts` | 博客文章表 |
| `documentations` | 文档表 |
| `enterprise_cases` | 企业案例表 |
| `partner_applications` | 合伙人申请表 |
| `referral_applications` | 推荐官申请表 |
| `enterprise_inquiries` | 企业咨询表 |
| `hardware_orders` | 硬件订单表 |
| `client_versions` | 客户端版本表 |
| `api_keys` | API 密钥表 |
| `page_views` | 页面浏览统计表 |

### 数据库连接池

使用 `psycopg2.pool.SimpleConnectionPool` 实现连接池：
- 最小连接数：1
- 最大连接数：10
- 游标类型：`RealDictCursor`（返回字典格式结果）

### 默认管理员账户

数据库初始化后会自动创建默认管理员账户：
- 邮箱：`admin@moltybox.ai`
- 密码：`admin123`

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| Web 框架 | FastAPI | 0.109.0 |
| ASGI 服务器 | Uvicorn | 0.27.0 |
| 生产服务器 | Gunicorn | 21.2.0 |
| 数据验证 | Pydantic | 2.5.3 |
| 配置管理 | pydantic-settings | 2.1.0 |
| 数据库 | PostgreSQL | 18.3 |
| 数据库驱动 | psycopg2-binary | 2.9.9 |
| 认证 | python-jose + cryptography | 3.3.0 |
| 密码加密 | passlib + bcrypt | 1.7.4 |
| HTTP 客户端 | httpx | 0.26.0 |
| 测试 | pytest + pytest-asyncio | 0.23.3 |
