# MoltyBox 后端 API 服务 产品需求文档 (PRD)

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品名称 | MoltyBox Backend API |
| 文档版本 | v1.2 |
| 最后更新 | 2026-03-31 |
| 文档状态 | 进行中 |
| 技术栈 | Python 3.11+ / FastAPI 0.109 / Mock 数据 |

---

## 1. 产品概述

### 1.1 后端定位

为 MoltyBox 官方网站、桌面客户端、云端版和移动端提供统一的 RESTful API 服务，支撑以下核心业务：

| 业务域 | 说明 |
|-------|------|
| 内容管理 | 模型库、技能市场、智能体市场、博客、文档 |
| 用户系统 | 认证、权限、个人中心、消息通知 |
| 商务系统 | 合伙人申请、推荐官计划、企业咨询 |
| 产品交付 | 桌面客户端下载、云端版管理、硬件订单 |
| 数据分析 | 访问统计、转化追踪、用户行为分析 |

### 1.2 服务对象

| 客户端 | 说明 |
|-------|------|
| Web 官网 | React SPA，运行于 moltybox.ai |
| 桌面客户端 | Windows/Mac 应用，基于 OpenClaw 框架 |
| 云端版 | 专属云主机管理界面 |
| 移动端 | 远程控制和监控（规划中） |

### 1.3 核心价值主张

- **开箱即用**：软硬件一体化，无需复杂配置
- **私有安全**：数据本地存储，隐私保护
- **全能助手**：支持主流大模型（Claude、GPT-4o、DeepSeek、Qwen、Moonshot、MiniMax 等）
- **远程协同**：通过 WhatsApp/钉钉/飞书/企业微信控制

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │  Web 官网    │  │ 桌面客户端   │  │  云端版     │  │   移动端     │ │
│  │  (React)    │  │  (Electron)  │  │   (Web)     │  │  (Flutter)   │ │
│  └─────────────┘  └──────────────┘  └─────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API Gateway Layer                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Nginx / Traefik                            │   │
│  │              • SSL 终止     • 负载均衡     • 限流               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Application Layer (FastAPI)                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ 认证服务  │ │ 内容服务  │ │ 商务服务  │ │ 用户服务  │ │ 分析服务  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ 模型服务  │ │ 技能服务  │ │ 智能体服务│ │ 硬件服务  │ │ 任务服务  │ │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Data Layer                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │
│  │  PostgreSQL   │  │    Redis      │  │  MinIO/S3     │              │
│  │  (主数据库)   │  │  (缓存/会话)  │  │  (对象存储)   │              │
│  └───────────────┘  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈详情

| 层级 | 技术选型 | 版本 | 说明 |
|-----|---------|------|------|
| **Web 框架** | FastAPI | 0.109.0 | 高性能异步 API 框架，原生支持 OpenAPI |
| **Web 服务器** | Uvicorn + Gunicorn | 0.27.0 / 21.2.0 | ASGI 服务器 |
| **数据验证** | Pydantic | 2.5.3 | 请求/响应数据验证 |
| **认证** | Python-JOSE | 3.3.0 | JWT Token 生成与验证 |
| **密码加密** | Passlib + bcrypt | 1.7.4 | 密码哈希加密 |
| **HTTP 客户端** | HTTPX | 0.26.0 | 异步 HTTP 请求 |
| **测试框架** | Pytest + AsyncIO | 7.4.4 / 0.23.3 | 单元测试 |
| **API 文档** | Swagger UI / ReDoc | - | 自动生成 API 文档 |

**当前使用 Mock 数据，后续计划添加**:
- PostgreSQL (主数据库)
- Redis (缓存/会话)
- SQLAlchemy (ORM)
- Alembic (数据库迁移)

### 2.2 项目结构

```
moltybox-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用入口
│   │
│   ├── api/                 # API 路由
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py    # 路由聚合
│   │   │   ├── auth.py      # 认证接口 ✅
│   │   │   ├── users.py     # 用户接口 ✅
│   │   │   ├── models.py    # 模型接口 ✅
│   │   │   ├── skills.py    # 技能接口 ✅
│   │   │   ├── agents.py    # 智能体接口 ✅
│   │   │   ├── hardware.py  # 硬件接口 ✅
│   │   │   ├── partners.py  # 合伙人接口 ✅
│   │   │   ├── referrals.py # 推荐官接口 ✅
│   │   │   ├── enterprise.py# 企业版接口 ✅
│   │   │   ├── blog.py      # 博客接口 ✅
│   │   │   ├── docs.py      # 文档接口 ✅
│   │   │   ├── pricing.py   # 定价接口 ✅
│   │   │   ├── client.py    # 客户端接口 ✅
│   │   │   ├── upload.py    # 上传接口 ✅
│   │   │   ├── analytics.py # 分析接口 ✅
│   │   │   └── other.py     # 其他接口 ✅
│   │   └── deps.py          # 依赖注入
│   │
│   ├── core/                # 核心模块
│   │   ├── __init__.py
│   │   ├── security.py      # 安全工具（JWT、bcrypt 密码加密）✅
│   │   ├── config.py        # 配置类
│   │   └── exceptions.py    # 自定义异常
│   │
│   ├── schemas/             # Pydantic 模式
│   │   ├── __init__.py
│   │   ├── response.py      # 通用响应结构
│   │   ├── user.py
│   │   ├── model.py
│   │   ├── skill.py
│   │   ├── agent.py
│   │   ├── hardware.py
│   │   ├── partner.py
│   │   ├── content.py
│   │   ├── pricing.py
│   │   └── ...
│   │
│   ├── services/            # 业务逻辑
│   │   └── __init__.py
│   │
│   └── mock/                # Mock 数据（当前使用）
│       ├── __init__.py
│       └── data.py          # 模拟数据
│
├── .env                     # 环境变量
├── .env.example
├── requirements.txt
└── README.md
```

**当前实现状态**:
- ✅ 项目脚手架完成
- ✅ Mock 数据层完成
- ✅ 所有 API 路由基础实现完成
- ✅ 用户认证系统完成（JWT Token）
- ✅ bcrypt 密码加密完成
- ⏳ 数据库集成待实现
- ⏳ 真实业务逻辑待实现

---

## 3. API 设计

### 3.1 API 规范

- **协议**: HTTP/1.1 (开发), HTTPS (生产)
- **格式**: JSON (Request/Response)
- **版本**: `/api/v1/`
- **认证**: Bearer Token (JWT)
- **响应格式**:

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "meta": {
    "total": 100,
    "page": 1,
    "page_size": 20
  }
}
```

### 3.2 错误码定义

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 4. 数据模型

### 4.1 用户系统 (User)

```python
class User(Base):
    __tablename__ = "users"

    id: int (PK, auto-increment)
    email: str (Unique, Index, max_length=255)
    username: str (Unique, max_length=50)
    hashed_password: str (max_length=255)
    full_name: str | null (max_length=100)
    avatar_url: str | null (max_length=500)
    phone: str | null (max_length=20)
    company: str | null (max_length=200)
    job_title: str | null (max_length=100)

    # 账户状态
    is_active: bool (default=True)
    is_verified: bool (default=False)  # 邮箱是否验证
    is_superuser: bool (default=False)
    is_staff: bool (default=False)  # 内部员工

    # 时间戳
    created_at: datetime (Index, default=UTC now)
    updated_at: datetime (default=UTC now, on update)
    last_login: datetime | null
    last_login_ip: str | null  # 匿名化存储

    # 偏好设置
    language: str (default='zh-CN')
    timezone: str (default='Asia/Shanghai')
    marketing_consent: bool (default=False)  # 是否同意营销邮件

    # 关联
    referrals: List[Referral]  # 推荐记录
    partner_applications: List[PartnerApplication]  # 合伙人申请
    enterprise_inquiries: List[EnterpriseInquiry]  # 企业咨询
    created_skills: List[Skill]  # 创建的技能
    created_agents: List[Agent]  # 创建的智能体
    blog_posts: List[BlogPost]  # 博客文章
```

### 4.2 会话与认证 (Session & Auth)

```python
class Session(Base):
    """用户会话表 - 用于管理多端登录"""
    __tablename__ = "sessions"

    id: int (PK)
    user_id: int (FK -> users.id, Index)
    token_hash: str (Unique)  # 存储 token 的哈希值
    refresh_token_hash: str (Unique)

    # 设备信息
    device_type: str (desktop/mobile/tablet)
    device_name: str | null  # 如 "Chrome on Windows"
    os: str | null
    browser: str | null

    # 位置信息（匿名化）
    country: str | null
    city: str | null

    # 状态
    is_active: bool (default=True)
    created_at: datetime
    expires_at: datetime
    last_activity: datetime

    # 索引
    __table_args__ = (
        Index('idx_sessions_user_active', 'user_id', 'is_active'),
        Index('idx_sessions_expires', 'expires_at'),
    )


class PasswordResetToken(Base):
    """密码重置 Token"""
    __tablename__ = "password_reset_tokens"

    id: int (PK)
    user_id: int (FK -> users.id)
    token_hash: str (Unique)
    expires_at: datetime
    used: bool (default=False)
    created_at: datetime


class EmailVerificationToken(Base):
    """邮箱验证 Token"""
    __tablename__ = "email_verification_tokens"

    id: int (PK)
    user_id: int (FK -> users.id)
    token_hash: str (Unique)
    expires_at: datetime
    used: bool (default=False)
    created_at: datetime
```

### 4.3 AI 模型 (AIModel)

```python
class AIModel(Base):
    __tablename__ = "ai_models"

    # 基础信息
    id: int (PK)
    name: str (如 "DeepSeek-V3", "Claude-3.5-Sonnet", "Qwen2.5-72B")
    slug: str (Unique, URL 友好名称)
    display_name: str | null  # 显示名称

    # 提供商
    provider: str (如 "DeepSeek", "Anthropic", "Alibaba", "Meta")
    provider_logo: str | null  # 提供商 Logo URL

    # 模型类型
    type: str (Index: llm / embedding / vision / audio / code)
    family: str | null  # 模型系列，如 "Llama 3", "Qwen2.5"

    # 能力参数
    context_window: int (token 数，如 128000)
    max_output_tokens: int | null
    input_types: JSON (["text", "image", "audio", "video"])
    output_types: JSON (["text", "code", "json"])

    # 支持的语言
    supported_languages: JSON (["zh", "en", "ja", "ko", ...])

    # 价格（每 1M tokens）
    pricing_input: float (如 0.27)
    pricing_output: float (如 1.10)
    currency: str (default="CNY")

    # 状态
    is_available: bool (default=True)  # 是否可用
    is_featured: bool (default=False)  # 是否推荐
    is_self_hosted: bool (default=False)  # 是否自建模型

    # 排序和展示
    sort_order: int (default=0)
    release_date: date | null  # 发布日期

    # 描述和文档
    description: str | null  # 简短描述
    features: JSON | null  # 特性列表
    documentation_url: str | null
    api_endpoint: str | null  # API 端点

    # 使用统计
    total_requests: int (default=0)
    total_tokens: int (default=0)
    avg_latency_ms: float | null

    # 时间戳
    created_at: datetime
    updated_at: datetime

    # 索引
    __table_args__ = (
        Index('idx_models_type_available', 'type', 'is_available'),
        Index('idx_models_provider', 'provider'),
    )
```

### 4.4 技能 (Skill)

```python
class Skill(Base):
    """AI Agent 技能 - 可复用的功能模块"""
    __tablename__ = "skills"

    # 基础信息
    id: int (PK)
    name: str (如 "Computer Use", "Web Automation", "Data Analysis")
    slug: str (Unique, URL 友好)
    version: str (如 "1.0.0", 语义化版本)

    # 分类
    category: str (Index: automation/analysis/creation/communication/research)
    subcategory: str | null
    tags: JSON (["python", "selenium", "pandas"])

    # 内容
    description: str (简短描述，max 500)
    long_description: str | null (Markdown 格式详细描述)
    icon_url: str | null
    screenshots: JSON | null (截图 URL 数组)

    # 作者
    author_id: int | null (FK -> users.id)
    author_name: str | null  # 允许匿名用户
    is_official: bool (default=False)  # 是否官方技能

    # 技术配置
    config_schema: JSON  # JSON Schema 定义配置参数
    entry_point: str | null  # 入口文件/函数
    dependencies: JSON | null  # 依赖列表
    requirements: JSON | null  # 系统要求

    # 统计
    download_count: int (default=0)
    install_count: int (default=0)
    rating: float (1-5, default=0)
    rating_count: int (default=0)
    review_count: int (default=0)

    # 状态
    is_published: bool (default=False)
    is_featured: bool (default=False)
    is_verified: bool (default=False)  # 是否已审核
    compatibility: JSON | null  # 兼容的客户端版本

    # 发布
    release_notes: str | null
    changelog: JSON | null

    # 时间戳
    created_at: datetime
    updated_at: datetime
    published_at: datetime | null

    # 索引
    __table_args__ = (
        Index('idx_skills_category_published', 'category', 'is_published'),
        Index('idx_skills_rating', 'rating', 'rating_count'),
    )


class SkillReview(Base):
    """技能评价"""
    __tablename__ = "skill_reviews"

    id: int (PK)
    skill_id: int (FK -> skills.id, Index)
    user_id: int (FK -> users.id)
    rating: int (1-5)
    title: str | null
    content: str | null
    is_verified_purchase: bool (default=False)  # 是否已使用者
    created_at: datetime
    updated_at: datetime

    __table_args__ = (
        UniqueConstraint('skill_id', 'user_id', name='uq_skill_user_review'),
    )
```

### 4.5 智能体 (Agent)

```python
class Agent(Base):
    """AI 智能体 - 可独立运行的 Agent 应用"""
    __tablename__ = "agents"

    # 基础信息
    id: int (PK)
    name: str (如 "客服助手", "数据分析师", "内容创作家")
    slug: str (Unique)
    tagline: str | null (一句话介绍)

    # 分类
    category: str (Index: customer_service/marketing/analysis/development/hr/finance/operations)
    industry: str | null  # 适用行业

    # 内容
    description: str
    long_description: str | null (Markdown)
    icon_url: str | null
    cover_image: str | null
    demo_video_url: str | null

    # 配置
    skills: JSON  # 关联技能 IDs 和配置 [{"skill_id": 1, "config": {...}}, ...]
    default_model_id: int | null (FK -> ai_models.id)
    model_config: JSON | null  # 模型参数配置

    # 能力
    capabilities: JSON  # ["multi_turn", "file_upload", "web_search", ...]
    integrations: JSON | null  # ["whatsapp", "dingtalk", "feishu", ...]

    # 统计
    usage_count: int (default=0)
    active_user_count: int (default=0)
    rating: float (1-5)
    rating_count: int (default=0)

    # 状态
    is_published: bool (default=False)
    is_featured: bool (default=False)
    is_template: bool (default=False)  # 是否可复制模板
    visibility: str (public/private/team)

    # 作者
    created_by: int (FK -> users.id)
    team_id: int | null

    # 定价
    pricing_type: str (free/freemium/paid/subscription)
    price: int | null (分)
    subscription_price: int | null (月费，分)

    # 时间戳
    created_at: datetime
    updated_at: datetime
    published_at: datetime | null

    # 索引
    __table_args__ = (
        Index('idx_agents_category_published', 'category', 'is_published'),
    )
```

### 4.5 硬件产品 (HardwareProduct)

```python
class HardwareProduct(Base):
    __tablename__ = "hardware_products"

    id: int (PK)
    name: str (如 "MoltyBox Mini", "MoltyBox Pro")
    slug: str (Unique)

    # 价格
    price: int (分，如 299900 = ¥2999)
    original_price: int | null (原价，用于展示折扣)
    currency: str (default="CNY")

    # 描述
    description: str (详细描述，Markdown)
    short_description: str | null (一句话介绍，max 200)
    tagline: str | null (宣传语)

    # 规格
    specs: JSON  # {"processor": "Intel Core i7", "memory": "8GB", "storage": "256GB SSD"}
    features: JSON  # ["开箱即用", "私有安全", "全能助手", ...]

    # 媒体
    images: JSON  # ["url1", "url2", ...]
    cover_image: str | null
    demo_video_url: str | null

    # 库存
    stock: int (default=0)
    sku: str | null

    # 状态
    is_available: bool (default=True)
    is_featured: bool (default=False)
    is_new: bool (default=False)  # 是否新品

    # 排序
    sort_order: int (default=0)

    # 统计
    view_count: int (default=0)
    purchase_count: int (default=0)

    # 时间戳
    created_at: datetime
    updated_at: datetime
    published_at: datetime | null


class HardwareOrder(Base):
    """硬件订单"""
    __tablename__ = "hardware_orders"

    id: int (PK)
    order_no: str (Unique, 如 "HW-20260330-0001")

    # 用户
    user_id: int | null (FK -> users.id)  # 允许游客购买
    email: str  # 联系邮箱
    phone: str  # 联系电话
    name: str  # 收货人姓名

    # 地址
    province: str
    city: str
    district: str
    address: str
    postal_code: str | null

    # 商品
    product_id: int (FK -> hardware_products.id)
    product_name: str  # 快照
    quantity: int (default=1)
    unit_price: int  # 单价（分）

    # 金额
    subtotal: int  # 小计（分）
    shipping_fee: int (default=0)
    discount: int (default=0)
    total_amount: int  # 总金额（分）

    # 状态
    status: str (pending/payment_required/paid/shipping/delivered/completed/cancelled/refunded)
    payment_status: str (unpaid/paid/refunded)

    # 物流
    shipping_company: str | null
    tracking_no: str | null
    shipped_at: datetime | null
    delivered_at: datetime | null

    # 时间戳
    created_at: datetime
    updated_at: datetime
    paid_at: datetime | null


class DeviceActivation(Base):
    """设备激活记录 - 用于追踪硬件激活"""
    __tablename__ = "device_activations"

    id: int (PK)
    serial_number: str (Unique, 设备序列号)
    hardware_id: int (FK -> hardware_products.id)

    # 激活信息
    user_id: int | null (FK -> users.id)
    activated_at: datetime
    activation_ip: str | null

    # 设备信息
    device_info: JSON | null  # 客户端上报的设备信息
    client_version: str | null  # 客户端版本

    # 状态
    status: str (active/inactive/lost/stolen)
    last_seen_at: datetime | null
```

### 4.6 客户端版本 (ClientVersion)

```python
class ClientVersion(Base):
    """桌面客户端版本管理"""
    __tablename__ = "client_versions"

    id: int (PK)
    platform: str (windows/macos/linux)
    architecture: str (x64/arm64)

    # 版本信息
    version: str (如 "1.2.0", 语义化版本)
    build_number: int
    release_notes: str | null
    changelog: JSON | null

    # 下载
    download_url: str
    file_size: int (字节)
    checksum_sha256: str

    # 要求
    min_os_version: str | null
    recommended: bool (default=False)  # 是否推荐更新
    required: bool (default=False)  # 是否强制更新

    # 状态
    is_published: bool (default=False)
    published_at: datetime | null

    # 统计
    download_count: int (default=0)

    # 时间戳
    created_at: datetime
    updated_at: datetime

    # 索引
    __table_args__ = (
        UniqueConstraint('platform', 'architecture', 'version', name='uq_platform_arch_version'),
        Index('idx_client_versions_recommended', 'platform', 'recommended', 'is_published'),
    )


class CloudInstance(Base):
    """云端版实例管理"""
    __tablename__ = "cloud_instances"

    id: int (PK)
    instance_id: str (Unique, 如 "ci-abc123")
    user_id: int (FK -> users.id)

    # 配置
    plan: str (basic/standard/professional)
    region: str (如 "cn-east-1", "cn-north-1")

    # 状态
    status: str (pending/running/stopped/suspended/terminated)
    ip_address: str | null
    domain: str | null  # 专属域名

    # 资源
    cpu_cores: int
    memory_gb: int
    storage_gb: int

    # 计费
    billing_cycle: str (monthly/yearly)
    next_billing_date: date | null

    # 时间戳
    created_at: datetime
    started_at: datetime | null
    expires_at: datetime | null
```

```python
class PartnerApplication(Base):
    __tablename__ = "partner_applications"

    id: int (PK)
    application_no: str (Unique, 如 "PA-20260330-0001")

    # 申请人信息
    user_id: int | null (FK -> users.id)
    company_name: str
    contact_name: str
    contact_email: str
    contact_phone: str
    region: str
    partner_type: str (channel/ecosystem)

    # 公司信息
    annual_revenue: str | null
    team_size: str | null
    business_scope: str | null
    website: str | null

    # 申请说明
    description: str | null
    resources: str | null

    # 审核状态
    status: str (pending/reviewing/approved/rejected)
    rejection_reason: str | null

    # 分配
    assigned_to: int | null (FK -> users.id)
    region_exclusivity: str | null

    # 内部备注
    notes: str | null
    internal_rating: str | null

    # 时间戳
    submitted_at: datetime
    reviewed_at: datetime | null
    created_at: datetime
    updated_at: datetime
```

### 4.13 通知系统 (Notification)

```python
class Notification(Base):
    """站内通知"""
    __tablename__ = "notifications"

    id: int (PK)
    user_id: int (FK -> users.id, Index)

    # 内容
    title: str
    content: str
    type: str (system/order/partner/referral)

    # 关联
    related_type: str | null (如 "order", "partner_application")
    related_id: int | null

    # 状态
    is_read: bool (default=False)
    read_at: datetime | null

    # 动作
    action_url: str | null
    action_text: str | null

    # 时间戳
    created_at: datetime
    expires_at: datetime | null


class EmailLog(Base):
    """邮件发送日志"""
    __tablename__ = "email_logs"

    id: int (PK)
    recipient: str
    template: str
    subject: str

    # 状态
    status: str (pending/sent/failed/bounced)
    error_message: str | null

    # 发送详情
    sent_at: datetime | null
    opened_at: datetime | null
    clicked_at: datetime | null

    # 元数据
    metadata: JSON | null
    created_at: datetime
```

### 4.14 定价与订阅 (Pricing & Subscription)

```python
class PricingPlan(Base):
    """SaaS 定价计划"""
    __tablename__ = "pricing_plans"

    id: int (PK)
    name: str (如 "个人版", "专业版", "团队版")
    slug: str (Unique, 如 "free", "pro", "team")

    # 价格
    price: int (分/月，0 表示免费)
    annual_price: int | null (年付价格，分)
    currency: str (default="CNY")

    # 说明
    description: str | null
    tagline: str | null (如 "适合个人开发者")

    # 功能
    features: JSON (["无限技能", "云端同步", "优先支持", ...])
    limits: JSON ({"max_skills": 10, "max_agents": 5, "storage_gb": 10})

    # 状态
    is_available: bool (default=True)
    is_popular: bool (default=False)  # 是否标记为"最受欢迎"

    # 排序
    sort_order: int (default=0)

    # 统计
    subscriber_count: int (default=0)

    # 时间戳
    created_at: datetime
    updated_at: datetime


class Subscription(Base):
    """用户订阅"""
    __tablename__ = "subscriptions"

    id: int (PK)
    user_id: int (FK -> users.id, Index)
    plan_id: int (FK -> pricing_plans.id)

    # 状态
    status: str (active/cancelled/expired/past_due/trial)

    # 计费
    billing_cycle: str (monthly/yearly)
    current_period_start: date
    current_period_end: date
    cancel_at_period_end: bool (default=False)

    # 支付
    payment_method: str | null (wechat/alipay/card)
    last_payment_date: date | null
    next_billing_date: date | null

    # 试用
    trial_start: date | null
    trial_end: date | null

    # 时间戳
    created_at: datetime
    updated_at: datetime
    cancelled_at: datetime | null


class UsageRecord(Base):
    """使用量记录"""
    __tablename__ = "usage_records"

    id: int (PK)
    user_id: int (FK -> users.id, Index)
    subscription_id: int | null (FK -> subscriptions.id)

    # 使用类型
    metric_type: str (api_calls/tokens/storage/bandwidth)
    metric_value: int (使用量)

    # 周期
    period_start: date
    period_end: date

    # 时间戳
    created_at: datetime

    __table_args__ = (
        Index('idx_usage_user_period', 'user_id', 'period_start', 'period_end'),
    )
```

### 4.15 页面浏览分析 (PageView Analytics)

```python
class PageView(Base):
    """页面浏览记录"""
    __tablename__ = "page_views"

    id: int (PK)
    session_id: str (Index)  # 会话 ID，用于 UV 统计

    # 页面信息
    path: str (Index, 如 "/moltybox", "/pricing")
    title: str | null
    referrer: str | null  # 来源页面

    # 用户信息 (可选，登录后关联)
    user_id: int | null (FK -> users.id)

    # 设备信息 (匿名化)
    device_type: str (desktop/mobile/tablet)
    browser: str | null
    os: str | null
    country: str | null
    city: str | null

    # 性能
    load_time_ms: int | null  # 页面加载时间

    # 时间戳
    viewed_at: datetime

    # 索引
    __table_args__ = (
        Index('idx_page_views_path_date', 'path', 'viewed_at'),
        Index('idx_page_views_session', 'session_id', 'viewed_at'),
    )


class ConversionEvent(Base):
    """转化事件记录"""
    __tablename__ = "conversion_events"

    id: int (PK)
    session_id: str (Index)
    user_id: int | null (FK -> users.id)

    # 事件类型
    event_type: str (signup/download/purchase/partner_apply/referral)
    event_name: str (如 "download_windows", "purchase_mini")

    # 关联资源
    resource_type: str | null (如 "skill", "agent", "hardware")
    resource_id: int | null

    # 来源
    utm_source: str | null
    utm_medium: str | null
    utm_campaign: str | null

    # 价值
    value: int | null (分，如订单金额)

    # 时间戳
    created_at: datetime

    # 索引
    __table_args__ = (
        Index('idx_conversion_events_type_date', 'event_type', 'created_at'),
    )
```

---

## 5. API 接口详情

### 5.1 认证接口 (Auth)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/auth/register` | 用户注册 | ❌ |
| POST | `/api/v1/auth/login` | 用户登录 | ❌ |
| POST | `/api/v1/auth/logout` | 用户登出 | ✅ |
| POST | `/api/v1/auth/refresh` | 刷新 Token | ✅ |
| POST | `/api/v1/auth/forgot-password` | 忘记密码 | ❌ |
| POST | `/api/v1/auth/reset-password` | 重置密码 | ❌ |
| POST | `/api/v1/auth/verify-email` | 验证邮箱 | ❌ |
| GET | `/api/v1/auth/me` | 获取当前用户 | ✅ |

**示例请求 - 登录**:
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**示例响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "john"
    }
  }
}
```

---

### 5.2 用户接口 (User)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/users/me` | 获取当前用户信息 | ✅ |
| PUT | `/api/v1/users/me` | 更新当前用户信息 | ✅ |
| PUT | `/api/v1/users/me/password` | 修改密码 | ✅ |
| GET | `/api/v1/users/me/referrals` | 我的推荐记录 | ✅ |
| DELETE | `/api/v1/users/me` | 注销账户 | ✅ |

---

### 5.3 模型接口 (Models)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/models` | 获取模型列表 (分页、筛选) | ❌ |
| GET | `/api/v1/models/{slug}` | 获取模型详情 | ❌ |
| GET | `/api/v1/models/providers` | 获取提供商列表 | ❌ |
| POST | `/api/v1/models` | 创建模型 | ✅ Admin |
| PUT | `/api/v1/models/{id}` | 更新模型 | ✅ Admin |
| DELETE | `/api/v1/models/{id}` | 删除模型 | ✅ Admin |

**查询参数**:
- `type`: llm / embedding / vision / audio
- `provider`: 提供商名称
- `input_type`: text / image / audio / video
- `page`: 页码
- `page_size`: 每页数量

---

### 5.4 技能接口 (Skills)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/skills` | 获取技能列表 | ❌ |
| GET | `/api/v1/skills/{slug}` | 获取技能详情 | ❌ |
| GET | `/api/v1/skills/categories` | 获取分类列表 | ❌ |
| GET | `/api/v1/skills/{slug}/download` | 下载技能 | ✅ |
| POST | `/api/v1/skills` | 创建技能 | ✅ |
| PUT | `/api/v1/skills/{id}` | 更新技能 | ✅ (author) |
| DELETE | `/api/v1/skills/{id}` | 删除技能 | ✅ (author) |

---

### 5.5 智能体接口 (Agents)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/agents` | 获取智能体列表 | ❌ |
| GET | `/api/v1/agents/{slug}` | 获取智能体详情 | ❌ |
| GET | `/api/v1/agents/categories` | 获取分类列表 | ❌ |
| POST | `/api/v1/agents` | 创建智能体 | ✅ |
| PUT | `/api/v1/agents/{id}` | 更新智能体 | ✅ (author) |
| DELETE | `/api/v1/agents/{id}` | 删除智能体 | ✅ (author) |

---

### 5.6 硬件接口 (Hardware)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/hardware` | 获取硬件列表 | ❌ |
| GET | `/api/v1/hardware/{slug}` | 获取硬件详情 | ❌ |
| GET | `/api/v1/hardware/{slug}/related` | 相关产品推荐 | ❌ |
| POST | `/api/v1/hardware` | 创建硬件 | ✅ Admin |
| PUT | `/api/v1/hardware/{id}` | 更新硬件 | ✅ Admin |
| DELETE | `/api/v1/hardware/{id}` | 删除硬件 | ✅ Admin |

---

### 5.7 硬件订单接口 (Hardware Orders)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/hardware/orders` | 创建订单 | ❌ |
| GET | `/api/v1/hardware/orders/{order_no}` | 获取订单详情 | ✅ |
| GET | `/api/v1/hardware/orders` | 我的订单列表 | ✅ |
| PUT | `/api/v1/hardware/orders/{order_no}/address` | 修改收货地址 | ✅ |
| POST | `/api/v1/hardware/orders/{order_no}/pay` | 发起支付 | ✅ |
| POST | `/api/v1/hardware/orders/{order_no}/cancel` | 取消订单 | ✅ |
| GET | `/api/v1/hardware/orders/{order_no}/invoice` | 获取发票 | ✅ |
| GET | `/api/v1/hardware/orders/admin` | 订单管理列表 | ✅ Admin |
| PUT | `/api/v1/hardware/orders/admin/{order_no}/ship` | 发货 | ✅ Admin |

**创建订单请求示例**:
```json
POST /api/v1/hardware/orders
{
  "product_id": 1,
  "quantity": 1,
  "customer": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000"
  },
  "shipping_address": {
    "province": "上海市",
    "city": "上海市",
    "district": "浦东新区",
    "address": "张江路 123 号",
    "postal_code": "201203"
  }
}
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_no": "HW-20260330-0001",
    "total_amount": 299900,
    "status": "pending_payment",
    "payment_url": "https://pay.wechat.com/...",
    "expires_at": "2026-03-30T12:30:00Z"
  }
}
```

---

### 5.8 设备激活接口 (Device Activation)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/hardware/activate` | 激活设备 | ✅ |
| GET | `/api/v1/hardware/devices` | 我的设备列表 | ✅ |
| GET | `/api/v1/hardware/devices/{serial}` | 设备详情 | ✅ |
| POST | `/api/v1/hardware/devices/{serial}/report` | 上报设备状态 | ✅ |

**设备激活请求示例**:
```json
POST /api/v1/hardware/activate
{
  "serial_number": "MB-MINI-20260330-0001",
  "device_info": {
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "client_version": "1.2.0",
    "os_version": "Windows 11"
  }
}
```

---

### 5.9 合伙人接口 (Partners)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/partners/apply` | 提交申请 | ❌ |
| GET | `/api/v1/partners/benefits` | 获取收益说明 | ❌ |
| GET | `/api/v1/partners/process` | 获取合作流程 | ❌ |
| GET | `/api/v1/partners/faq` | 常见问题 | ❌ |
| GET | `/api/v1/partners/applications` | 申请列表 | ✅ Admin |
| GET | `/api/v1/partners/applications/{id}` | 申请详情 | ✅ Admin |
| PUT | `/api/v1/partners/applications/{id}` | 审核申请 | ✅ Admin |
| POST | `/api/v1/partners/applications/{id}/assign` | 分配跟进人 | ✅ Admin |

**申请请求示例**:
```json
POST /api/v1/partners/apply
{
  "company_name": "某某科技有限公司",
  "contact_name": "张三",
  "contact_email": "zhangsan@company.com",
  "contact_phone": "13800138000",
  "region": "上海市",
  "partner_type": "channel",
  "annual_revenue": "1000-5000 万",
  "team_size": "50-100 人",
  "business_scope": "华东地区 AI 产品销售",
  "description": "希望在华东地区代理 MoltyBox 产品..."
}
```

---

### 5.10 推荐官接口 (Referrals)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/referrals/apply` | 申请成为推荐官 | ✅ |
| GET | `/api/v1/referrals/me` | 获取我的推荐信息 | ✅ |
| GET | `/api/v1/referrals/me/stats` | 推荐统计数据 | ✅ |
| GET | `/api/v1/referrals/me/logs` | 推荐记录列表 | ✅ |
| POST | `/api/v1/referrals/me/withdraw` | 申请提现 | ✅ |
| GET | `/api/v1/referrals/tiers` | 佣金等级说明 | ❌ |
| GET | `/api/v1/referrals/faq` | 常见问题 | ❌ |

**推荐统计数据响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "tier": "gold",
    "commission_rate": 0.20,
    "total_referrals": 15,
    "successful_conversions": 8,
    "total_commission": 1250000,
    "pending_withdrawal": 800000,
    "withdrawn_amount": 450000
  }
}
```

---

### 5.11 企业版接口 (Enterprise)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/enterprise/inquire` | 提交咨询 | ❌ |
| GET | `/api/v1/enterprise/cases` | 客户案例列表 | ❌ |
| GET | `/api/v1/enterprise/cases/{slug}` | 客户案例详情 | ❌ |
| GET | `/api/v1/enterprise/inquiries` | 咨询列表 | ✅ Admin |
| GET | `/api/v1/enterprise/inquiries/{id}` | 咨询详情 | ✅ Admin |
| PUT | `/api/v1/enterprise/inquiries/{id}` | 更新咨询状态 | ✅ Admin |
| POST | `/api/v1/enterprise/inquiries/{id}/assign` | 分配销售跟进 | ✅ Admin |

**企业咨询请求示例**:
```json
POST /api/v1/enterprise/inquire
{
  "company_name": "某某集团有限公司",
  "contact_name": "李四",
  "contact_email": "lisi@enterprise.com",
  "contact_phone": "13900139000",
  "industry": "金融",
  "employee_count": "1000-5000",
  "use_case": "希望部署 AI 客服系统，处理客户咨询...",
  "interested_products": ["私有化部署", "定制开发"],
  "budget_range": "50-100 万",
  "timeline": "3 个月内"
}
```

**客户案例响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "slug": "fintech-customer-service",
      "company_name": "某金融科技公司",
      "industry": "金融",
      "challenge": "客服人力成本高，响应速度慢",
      "solution": "部署 MoltyBox AI 客服系统",
      "results": ["客服效率提升 300%", "成本降低 60%"],
      "testimonial": "MoltyBox 帮助我们..."
    }
  ]
}
```

---

### 5.12 博客接口 (Blog)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/blog/posts` | 获取文章列表 | ❌ |
| GET | `/api/v1/blog/posts/{slug}` | 获取文章详情 | ❌ |
| GET | `/api/v1/blog/categories` | 获取分类列表 | ❌ |
| GET | `/api/v1/blog/posts/{slug}/related` | 相关文章 | ❌ |
| POST | `/api/v1/blog/posts` | 创建文章 | ✅ Admin |
| PUT | `/api/v1/blog/posts/{id}` | 更新文章 | ✅ Admin |
| DELETE | `/api/v1/blog/posts/{id}` | 删除文章 | ✅ Admin |

---

### 5.11 文档接口 (Documentation)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/docs` | 获取文档树 | ❌ |
| GET | `/api/v1/docs/{slug}` | 获取文档详情 | ❌ |
| GET | `/api/v1/docs/search` | 搜索文档 | ❌ |
| POST | `/api/v1/docs` | 创建文档 | ✅ Admin |
| PUT | `/api/v1/docs/{id}` | 更新文档 | ✅ Admin |

---

### 5.12 博客接口 (Blog)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/blog/posts` | 获取文章列表 | ❌ |
| GET | `/api/v1/blog/posts/{slug}` | 获取文章详情 | ❌ |
| GET | `/api/v1/blog/categories` | 获取分类列表 | ❌ |
| GET | `/api/v1/blog/posts/{slug}/related` | 相关文章 | ❌ |
| POST | `/api/v1/blog/posts` | 创建文章 | ✅ Admin |
| PUT | `/api/v1/blog/posts/{id}` | 更新文章 | ✅ Admin |
| DELETE | `/api/v1/blog/posts/{id}` | 删除文章 | ✅ Admin |

---

### 5.13 文档接口 (Documentation)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/docs` | 获取文档树 | ❌ |
| GET | `/api/v1/docs/{slug}` | 获取文档详情 | ❌ |
| GET | `/api/v1/docs/search` | 搜索文档 | ❌ |
| POST | `/api/v1/docs` | 创建文档 | ✅ Admin |
| PUT | `/api/v1/docs/{id}` | 更新文档 | ✅ Admin |

---

### 5.14 客户端接口 (Client)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/client/version` | 检查更新 | ❌ |
| GET | `/api/v1/client/version/latest` | 获取最新版本 | ❌ |
| GET | `/api/v1/client/versions` | 版本历史 | ❌ |
| GET | `/api/v1/client/config` | 客户端配置 | ❌ |
| POST | `/api/v1/client/report` | 上报使用统计 | ✅ |

**检查更新请求**:
```json
GET /api/v1/client/version?platform=windows&arch=x64&version=1.0.0
```

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "latest": {
      "version": "1.2.0",
      "build_number": 120,
      "release_notes": "新增支持 Claude-3.5 模型...",
      "download_url": "https://...",
      "file_size": 157286400,
      "checksum_sha256": "abc123...",
      "required": false
    },
    "current": {
      "version": "1.0.0",
      "deprecated": false
    }
  }
}
```

### 5.15 云端实例接口 (Cloud)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| GET | `/api/v1/cloud/instances` | 我的实例列表 | ✅ |
| POST | `/api/v1/cloud/instances` | 创建实例 | ✅ |
| GET | `/api/v1/cloud/instances/{id}` | 实例详情 | ✅ |
| POST | `/api/v1/cloud/instances/{id}/start` | 启动实例 | ✅ |
| POST | `/api/v1/cloud/instances/{id}/stop` | 停止实例 | ✅ |
| POST | `/api/v1/cloud/instances/{id}/restart` | 重启实例 | ✅ |
| PUT | `/api/v1/cloud/instances/{id}` | 升降配 | ✅ |
| DELETE | `/api/v1/cloud/instances/{id}` | 删除实例 | ✅ |
| GET | `/api/v1/cloud/regions` | 可用区域列表 | ❌ |
| GET | `/api/v1/cloud/plans` | 套餐列表 | ❌ |

### 5.16 文件上传接口 (Upload)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/upload/image` | 上传图片 | ✅ |
| POST | `/api/v1/upload/file` | 上传文件 | ✅ |
| POST | `/api/v1/upload/multipart` | 分片上传 | ✅ |
| DELETE | `/api/v1/upload/{id}` | 删除文件 | ✅ |

---

### 5.17 其他接口

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/newsletter/subscribe` | 邮件订阅 | ❌ |
| POST | `/api/v1/newsletter/unsubscribe` | 取消订阅 | ❌ |
| POST | `/api/v1/contact` | 联系表单 | ❌ |
| GET | `/api/v1/analytics/summary` | 访问统计摘要 | ✅ Admin |
| GET | `/api/v1/analytics/page-views` | 页面浏览数据 | ✅ Admin |
| GET | `/api/v1/analytics/conversions` | 转化数据 | ✅ Admin |

**联系表单请求示例**:
```json
POST /api/v1/contact
{
  "name": "王五",
  "email": "wangwu@example.com",
  "subject": "产品咨询",
  "message": "我想了解一下 MoltyBox 的企业版功能..."
}
```

**邮件订阅请求示例**:
```json
POST /api/v1/newsletter/subscribe
{
  "email": "user@example.com",
  "consent": true
}
```

---

### 5.18 定价与订阅接口 (Pricing & Subscription)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/analytics/pageview` | 上报页面浏览 | ❌ |
| POST | `/api/v1/analytics/event` | 上报事件 | ❌ |
| GET | `/api/v1/analytics/dashboard` | 获取仪表盘数据 | ✅ Admin |
| GET | `/api/v1/analytics/page-views` | 页面浏览趋势 | ✅ Admin |
| GET | `/api/v1/analytics/conversions` | 转化事件列表 | ✅ Admin |
| GET | `/api/v1/analytics/conversions/summary` | 转化统计摘要 | ✅ Admin |
| GET | `/api/v1/analytics/sources` | 流量来源分析 | ✅ Admin |
| GET | `/api/v1/analytics/devices` | 设备分布统计 | ✅ Admin |

---

### 5.19 数据分析接口 (Analytics)

| 方法 | 路径 | 说明 | 认证 |
|-----|------|------|-----|
| POST | `/api/v1/analytics/pageview` | 上报页面浏览 | ❌ |
| POST | `/api/v1/analytics/event` | 上报事件 | ❌ |
| GET | `/api/v1/analytics/dashboard` | 获取仪表盘数据 | ✅ Admin |
| GET | `/api/v1/analytics/page-views` | 页面浏览趋势 | ✅ Admin |
| GET | `/api/v1/analytics/conversions` | 转化事件列表 | ✅ Admin |
| GET | `/api/v1/analytics/conversions/summary` | 转化统计摘要 | ✅ Admin |
| GET | `/api/v1/analytics/sources` | 流量来源分析 | ✅ Admin |
| GET | `/api/v1/analytics/devices` | 设备分布统计 | ✅ Admin |

**页面浏览上报示例**:
```json
POST /api/v1/analytics/pageview
{
  "path": "/moltybox",
  "title": "MoltyBox - AI 智能体云平台",
  "referrer": "https://www.google.com/",
  "load_time_ms": 234
}
```

**事件上报示例**:
```json
POST /api/v1/analytics/event
{
  "event_type": "download",
  "event_name": "download_windows",
  "resource_type": "client",
  "utm_source": "google",
  "utm_medium": "cpc"
}
```

**仪表盘数据响应示例**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "summary": {
      "today_pv": 1523,
      "today_uv": 892,
      "yesterday_pv": 1421,
      "yesterday_uv": 856,
      "total_users": 12580,
      "total_conversions": 342
    },
    "conversion_funnel": {
      "page_view": 15000,
      "product_page": 5200,
      "download": 1200,
      "signup": 450,
      "purchase": 85
    },
    "top_pages": [
      {"path": "/", "pv": 5000, "uv": 3200},
      {"path": "/moltybox", "pv": 3200, "uv": 2100},
      {"path": "/pricing", "pv": 1800, "uv": 1500}
    ]
  }
}
```

---

## 6. 安全设计

### 6.1 认证机制

**JWT Token 配置**:
- Access Token 有效期：1 小时
- Refresh Token 有效期：7 天
- 算法：HS256 / RS256

**Token 刷新流程**:
```
1. 客户端使用 refresh_token 请求 /api/v1/auth/refresh
2. 服务端验证 refresh_token 有效性
3. 返回新的 access_token 和 refresh_token
```

### 6.2 密码安全

- 最小长度：8 字符
- 哈希算法：bcrypt (cost=12)
- 密码重置：邮件发送一次性 Token，30 分钟有效

### 6.3 速率限制

| 接口类型 | 限制 |
|---------|------|
| 登录/注册 | 10 次/分钟/IP |
| 密码重置 | 5 次/小时/IP |
| 普通 API | 100 次/分钟/IP |
| 文件上传 | 10 次/分钟/IP |

### 6.4 CORS 配置

```python
CORS(
    allow_origins=[
        "http://localhost:5179",  # 开发环境
        "https://moltybox.ai",    # 生产环境
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 7. 数据库设计

### 7.1 ER 图 (完整)

```
                                 ┌──────────────────┐
                                 │      users       │
                                 │──────────────────│
                                 │ id (PK)          │
                                 │ email            │
                                 │ username         │
                                 │ hashed_password  │
                                 │ ...              │
                                 └────────┬─────────┘
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         │                                │                                │
         ▼                                ▼                                ▼
┌─────────────────┐            ┌──────────────────┐            ┌──────────────────┐
│    sessions     │            │  subscriptions   │            │ partner_         │
│─────────────────│            │──────────────────│            │ applications     │
│ id (PK)         │            │ id (PK)          │            │──────────────────│
│ user_id (FK)    │            │ user_id (FK)     │            │ id (PK)          │
│ token_hash      │            │ plan_id (FK)     │            │ user_id (FK)     │
│ device_info     │            │ status           │            │ company_name     │
│ expires_at      │            │ billing_cycle    │            │ status           │
└─────────────────┘            └────────┬─────────┘            └──────────────────┘
                                       │
                                ┌──────┴────────┐
                                ▼               ▼
                       ┌──────────────┐  ┌──────────────┐
                       │usage_records │  │  invoices    │
                       └──────────────┘  └──────────────┘

         ┌────────────────────────────────┐
         │                                │
         ▼                                ▼
┌─────────────────┐            ┌──────────────────┐
│  referrals      │            │ enterprise_      │
│─────────────────│            │ inquiries        │
│ id (PK)         │            │──────────────────│
│ user_id (FK)    │            │ id (PK)          │
│ referrer_id (FK)│            │ company_name     │
│ commission      │            │ use_case         │
│ status          │            │ status           │
└────────┬────────┘            └──────────────────┘
         │
         ▼
┌─────────────────┐
│  referral_logs  │
└─────────────────┘


┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   ai_models     │────<│     agents       │────<│  agent_skills    │
│─────────────────│     │──────────────────│     │──────────────────│
│ id (PK)         │     │ id (PK)          │     │ agent_id (FK)    │
│ name            │     │ name             │     │ skill_id (FK)    │
│ provider        │     │ category         │     │ config           │
│ type            │     │ skills (JSON)    │     └──────────────────┘
│ pricing_*       │     │ created_by (FK)  │
└─────────────────┘     └──────────────────┘

┌─────────────────┐
│     skills      │
│─────────────────│
│ id (PK)         │
│ name            │
│ author_id (FK)  │
│ category        │
│ rating          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  skill_reviews  │
└─────────────────┘


┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│hardware_        │────<│ hardware_orders  │────<│ order_items      │
│ products        │     │──────────────────│     │──────────────────│
│─────────────────│     │ id (PK)          │     │ order_id (FK)    │
│ id (PK)         │     │ order_no         │     │ product_id (FK)  │
│ name            │     │ user_id (FK)     │     │ quantity         │
│ price           │     │ status           │     └──────────────────┘
│ specs (JSON)    │     │ total_amount     │
└─────────────────┘     │ shipping_*       │
                        └──────────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │ device_          │
                        │ activations      │
                        └──────────────────┘


┌─────────────────┐
│ cloud_instances │
│─────────────────│
│ id (PK)         │
│ instance_id     │
│ user_id (FK)    │
│ plan            │
│ status          │
└─────────────────┘


┌─────────────────┐     ┌──────────────────┐
│   blog_posts    │────<│  post_categories │
│─────────────────│     └──────────────────┘
│ id (PK)         │
│ title           │
│ author_id (FK)  │
│ content         │
└─────────────────┘

┌─────────────────┐
│  documentation  │
│─────────────────│
│ id (PK)         │
│ slug            │
│ parent_id (FK)  │
│ content         │
└─────────────────┘


┌─────────────────┐
│   page_views    │
│─────────────────│
│ id (PK)         │
│ session_id      │
│ path            │
│ user_id (FK)    │
│ viewed_at       │
└─────────────────┘

┌─────────────────┐
│conversion_events│
│─────────────────│
│ id (PK)         │
│ event_type      │
│ user_id (FK)    │
│ value           │
└─────────────────┘
```

---

## 8. 部署架构

### 8.1 环境配置

**开发环境**:
```bash
# .env
DATABASE_URL=postgresql://moltybox:password@localhost:5432/moltybox_dev
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=True
```

**生产环境**:
```bash
# .env
DATABASE_URL=postgresql://user:pass@db.internal:5432/moltybox_prod
REDIS_URL=redis://redis.internal:6379/0
SECRET_KEY=<secure-random-key>
DEBUG=False
ALLOWED_HOSTS=moltybox.ai,api.moltybox.ai
```

### 8.2 Docker Compose 部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://moltybox:password@db:5432/moltybox
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
      - redis
    networks:
      - moltybox-net

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=moltybox
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=moltybox
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - moltybox-net

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - moltybox-net

  celery-worker:
    build: .
    command: celery -A app.tasks worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://moltybox:password@db:5432/moltybox
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    networks:
      - moltybox-net

  celery-beat:
    build: .
    command: celery -A app.tasks beat --loglevel=info
    environment:
      - DATABASE_URL=postgresql://moltybox:password@db:5432/moltybox
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    networks:
      - moltybox-net

volumes:
  postgres-data:
  redis-data:

networks:
  moltybox-net:
    driver: bridge
```

### 8.3 Nginx 配置

```nginx
# API 服务器
server {
    listen 443 ssl;
    server_name api.moltybox.ai;

    ssl_certificate /etc/ssl/certs/moltybox.crt;
    ssl_certificate_key /etc/ssl/private/moltybox.key;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 限流
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=50 nodelay;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# 静态资源（前端）
server {
    listen 443 ssl;
    server_name moltybox.ai www.moltybox.ai;

    ssl_certificate /etc/ssl/certs/moltybox.crt;
    ssl_certificate_key /etc/ssl/private/moltybox.key;

    root /var/www/moltybox;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /images/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTP 重定向
server {
    listen 80;
    server_name moltybox.ai www.moltybox.ai api.moltybox.ai;
    return 301 https://$host$request_uri;
}
```

### 8.4 Kubernetes 部署（生产环境）

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moltybox-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: moltybox-api
  template:
    metadata:
      labels:
        app: moltybox-api
    spec:
      containers:
      - name: api
        image: moltybox/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: moltybox-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: moltybox-secrets
              key: redis-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: moltybox-secrets
              key: secret-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: moltybox-api
  namespace: production
spec:
  selector:
    app: moltybox-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
```

---

## 9. 监控与日志

### 9.1 日志配置

```python
# app/core/logging_config.py
import logging
import logging.handlers
from pathlib import Path

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] %(name)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": "INFO",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 10,
            "formatter": "json",
            "level": "DEBUG",
        },
        "error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/error.log",
            "maxBytes": 10485760,
            "backupCount": 5,
            "formatter": "json",
            "level": "ERROR",
        },
    },
    "loggers": {
        "uvicorn": {"level": "INFO", "handlers": ["console", "file"]},
        "uvicorn.access": {"level": "INFO", "handlers": ["console", "file"], "propagate": False},
        "app": {"level": "DEBUG", "handlers": ["console", "file", "error_file"]},
    },
}
```

### 9.2 Prometheus 监控指标

```python
# app/metrics.py
from prometheus_client import Counter, Histogram, Gauge

# API 请求指标
REQUEST_COUNT = Counter(
    'api_request_total',
    'Total API requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'api_request_latency_seconds',
    'API request latency',
    ['method', 'endpoint'],
    buckets=[0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

# 业务指标
ACTIVE_USERS = Gauge(
    'active_users',
    'Active users count'
)

CONVERSIONS = Counter(
    'conversions_total',
    'Total conversions',
    ['type']  # signup, download, purchase
)

# 数据库指标
DB_CONNECTIONS = Gauge(
    'database_connections_active',
    'Active database connections'
)
```

### 9.3 Grafana 仪表板

**核心面板**:

| 面板名称 | 指标 | 说明 |
|---------|------|------|
| Request Rate | `rate(api_request_total[1m])` | 每秒请求数 |
| Error Rate | `rate(api_request_total{status=~"5.."}[1m])` | 错误请求数 |
| P95 Latency | `histogram_quantile(0.95, rate(api_request_latency_seconds_bucket[1m]))` | P95 延迟 |
| Active Users | `active_users` | 活跃用户数 |
| Conversion Funnel | `conversions_total` | 转化漏斗 |

### 9.4 告警规则

```yaml
# prometheus/alerts.yml
groups:
- name: moltybox_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(api_request_total{status=~"5.."}[1m]) / rate(api_request_total[1m]) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "高错误率 - {{ $value | humanizePercentage }}"

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(api_request_latency_seconds_bucket[1m])) > 0.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "P95 延迟过高 - {{ $value }}s"

  - alert: DatabaseConnectionHigh
    expr: database_connections_active / database_connections_max > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "数据库连接池使用率过高"

  - alert: DiskUsageHigh
    expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.15
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: "磁盘使用率超过 85%"
```

---

## 10. 测试策略

### 10.1 测试分类

| 测试类型 | 工具 | 覆盖率目标 |
|---------|------|----------|
| 单元测试 | pytest + pytest-asyncio | > 80% |
| 集成测试 | pytest + TestClient | 核心流程 100% |
| API 测试 | pytest + httpx | 所有端点 |
| 负载测试 | locust | 关键接口 |
| E2E 测试 | Playwright | 主要用户流程 |

### 10.2 单元测试示例

```python
# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db, override_get_db

client = TestClient(app)

def test_register_success(db_session):
    """测试用户注册成功"""
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "SecurePass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 0
    assert "access_token" in data["data"]

def test_login_invalid_credentials(db_session):
    """测试登录失败"""
    response = client.post("/api/v1/auth/login", json={
        "email": "notexist@example.com",
        "password": "WrongPass"
    })
    assert response.status_code == 401
    data = response.json()
    assert data["code"] == 401

def test_refresh_token(db_session, auth_token):
    """测试刷新 Token"""
    response = client.post("/api/v1/auth/refresh",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data["data"]
```

### 10.3 集成测试示例

```python
# tests/integration/test_partner_flow.py
def test_partner_application_flow(db_session):
    """测试合伙人申请完整流程"""
    # 1. 提交申请
    response = client.post("/api/v1/partners/apply", json={
        "company_name": "测试公司",
        "contact_name": "张三",
        "contact_email": "test@company.com",
        "region": "北京市",
        "partner_type": "channel"
    })
    assert response.status_code == 200
    application_no = response.json()["data"]["application_no"]

    # 2. 管理员审核
    admin_token = get_admin_token()
    response = client.put(
        f"/api/v1/partners/applications/{application_no}",
        json={"status": "approved"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200

    # 3. 验证申请状态
    response = client.get(
        f"/api/v1/partners/applications/{application_no}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    data = response.json()["data"]
    assert data["status"] == "approved"
```

### 10.4 CI/CD 流程

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest-cov

    - name: Run tests
      run: |
        pytest --cov=app --cov-report=xml
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
        REDIS_URL: redis://localhost:6379/0

    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Build Docker image
      run: docker build -t moltybox/api:${{ github.sha }} .

    - name: Push to registry
      run: |
        echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u admin --password-stdin registry.example.com
        docker push registry.example.com/moltybox/api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production
      run: |
        kubectl set image deployment/moltybox-api api=registry.example.com/moltybox/api:${{ github.sha }}
```

---

## 11. 发布计划

### 11.1 阶段规划

| 阶段 | 内容 | 预计时间 |
|-----|------|---------|
| Phase 1 | 项目脚手架、数据库模型 | 1 周 |
| Phase 2 | 用户认证系统、基础 CRUD | 1 周 |
| Phase 3 | 内容管理 API（模型/技能/智能体） | 1 周 |
| Phase 4 | 商务系统（合伙人/推荐官/企业版） | 1 周 |
| Phase 5 | 博客、文档、分析系统 | 1 周 |
| Phase 6 | 测试、优化、部署 | 1 周 |

### 11.2 里程碑

| 里程碑 | 交付物 |
|-------|-------|
| M1 | API 文档 (Swagger/OpenAPI) |
| M2 | 数据库迁移完成 |
| M3 | 所有 API 接口实现 |
| M4 | 前后端联调完成 |
| M5 | 生产环境部署 |

---

## 附录

### A. 环境变量清单

| 变量名 | 说明 | 默认值 |
|-------|------|-------|
| `DATABASE_URL` | PostgreSQL 连接串 | - |
| `REDIS_URL` | Redis 连接串 | - |
| `SECRET_KEY` | JWT 密钥 | - |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access Token 有效期 | 60 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh Token 有效期 | 7 |
| `SMTP_HOST` | SMTP 服务器 | - |
| `SMTP_PORT` | SMTP 端口 | 587 |
| `SMTP_USER` | SMTP 用户 | - |
| `SMTP_PASSWORD` | SMTP 密码 | - |
| `FROM_EMAIL` | 发件人邮箱 | - |
| `ALLOWED_HOSTS` | 允许的域名 | localhost |
| `DEBUG` | 调试模式 | False |
| `CELERY_BROKER_URL` | Celery Broker URL | redis://localhost:6379/0 |
| `STORAGE_TYPE` | 存储类型 (s3/minio/local) | local |
| `STORAGE_ENDPOINT` | 对象存储端点 | - |
| `STORAGE_ACCESS_KEY` | 对象存储 Access Key | - |
| `STORAGE_SECRET_KEY` | 对象存储 Secret Key | - |
| `STORAGE_BUCKET` | 存储桶名称 | moltybox-uploads |

### B. 依赖包清单

```txt
# requirements.txt
# Web 框架
fastapi==0.109.0
uvicorn[standard]==0.27.0
gunicorn==21.2.0

# 数据库
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
asyncpg==0.29.0

# 缓存/消息队列
redis==5.0.1
celery==5.3.6

# 数据验证
pydantic==2.5.3
pydantic-settings==2.1.0

# 认证安全
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# 对象存储
boto3==1.34.34

# 监控日志
python-json-logger==2.0.7
prometheus-client==0.19.0

# 工具
httpx==0.26.0  # 异步 HTTP 客户端
email-validator==2.1.0
```

### C. API 接口汇总表

| 分组 | 端点数 | 说明 |
|-----|-------|------|
| Auth | 8 | 用户认证（注册、登录、Token 刷新） |
| User | 5 | 用户信息 management |
| Models | 6 | AI 模型 CRUD |
| Skills | 7 | 技能市场 |
| Agents | 6 | 智能体市场 |
| Hardware | 14 | 硬件产品 + 订单 + 设备激活 |
| Partners | 8 | 合伙人申请管理 |
| Referrals | 7 | 推荐官系统 |
| Enterprise | 7 | 企业版销售 |
| Pricing | 9 | SaaS 订阅管理 |
| Blog | 7 | 博客 CMS |
| Documentation | 5 | 文档中心 |
| Client | 5 | 客户端版本管理 |
| Cloud | 9 | 云端实例管理 |
| Upload | 4 | 文件上传 |
| Analytics | 8 | 数据分析 |
| Other | 3 | 新闻订阅、联系表单 |
| **总计** | **110+** | - |

### D. 前端 API 调用示例

```typescript
// frontend: src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// 通用请求封装
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ code: number; message: string; data: T }> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// 获取 AI 模型列表
export async function fetchModels(params?: ModelParams) {
  return request<Model[]>(`/models?${new URLSearchParams(params)}`);
}

// 提交合伙人申请
export async function submitPartnerApplication(application: PartnerApplication) {
  return request<{ application_no: string }>('/partners/apply', {
    method: 'POST',
    body: JSON.stringify(application),
  });
}

// 获取我的订阅
export async function getMySubscription() {
  return request<Subscription>('/pricing/my-subscription', {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
  });
}

// 检查客户端更新
export async function checkClientVersion(platform: string, arch: string, version: string) {
  return request<ClientVersionInfo>(
    `/client/version?platform=${platform}&arch=${arch}&version=${version}`
  );
}
```

### E. 文档修订记录

| 版本 | 日期 | 修订内容 | 修订人 |
|-----|------|---------|-------|
| v1.0 | 2026-03-30 | 初始版本 | - |
| v1.1 | 2026-03-30 | 完善数据模型、补充 API 详情、添加测试和 CI/CD | - |

---

**文档结束**
