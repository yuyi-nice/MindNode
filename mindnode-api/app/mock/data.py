"""
Mock 数据模块 - 代替真实数据库
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


class MockDatabase:
    """Mock 数据库"""

    def __init__(self):
        # 用户数据
        self.users: List[Dict[str, Any]] = [
            {
                "id": 1,
                "email": "admin@moltybox.ai",
                "username": "admin",
                "hashed_password": "$2b$12$xPNC9Cty3ZaVVSiMaJQVh.zy0ori9ssGL4TgOZuBBpU0YYG0MoxRq",  # "admin123"
                "full_name": "管理员",
                "avatar_url": None,
                "is_active": True,
                "is_verified": True,
                "is_superuser": True,
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow(),
            },
            {
                "id": 2,
                "email": "user@moltybox.ai",
                "username": "testuser",
                "hashed_password": "$2b$12$IABw9/pFrpiizvDhdFgP6el75Ia8b16cStva6gnvaxdsdph1koM/G",  # "user123"
                "full_name": "测试用户",
                "avatar_url": None,
                "is_active": True,
                "is_verified": True,
                "is_superuser": False,
                "created_at": datetime.utcnow() - timedelta(days=30),
                "last_login": datetime.utcnow() - timedelta(hours=2),
            }
        ]

        # AI 模型数据
        self.ai_models: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "DeepSeek-V3",
                "slug": "deepseek-v3",
                "display_name": "DeepSeek V3",
                "provider": "DeepSeek",
                "provider_logo": "/images/providers/deepseek.png",
                "type": "llm",
                "family": "DeepSeek",
                "context_window": 128000,
                "max_output_tokens": 8000,
                "input_types": ["text", "image"],
                "output_types": ["text", "code"],
                "supported_languages": ["zh", "en"],
                "pricing_input": 0.27,
                "pricing_output": 1.10,
                "currency": "CNY",
                "is_available": True,
                "is_featured": True,
                "sort_order": 1,
                "description": "DeepSeek 最新一代大语言模型",
            },
            {
                "id": 2,
                "name": "Claude-3.5-Sonnet",
                "slug": "claude-3-5-sonnet",
                "display_name": "Claude 3.5 Sonnet",
                "provider": "Anthropic",
                "provider_logo": "/images/providers/anthropic.png",
                "type": "llm",
                "family": "Claude",
                "context_window": 200000,
                "max_output_tokens": 8192,
                "input_types": ["text", "image"],
                "output_types": ["text", "code"],
                "supported_languages": ["zh", "en", "ja"],
                "pricing_input": 3.0,
                "pricing_output": 15.0,
                "currency": "CNY",
                "is_available": True,
                "is_featured": True,
                "sort_order": 2,
                "description": "Anthropic 最强代码和推理能力模型",
            },
            {
                "id": 3,
                "name": "Qwen2.5-72B",
                "slug": "qwen2-5-72b",
                "display_name": "Qwen2.5 72B",
                "provider": "Alibaba",
                "provider_logo": "/images/providers/alibaba.png",
                "type": "llm",
                "family": "Qwen",
                "context_window": 128000,
                "max_output_tokens": 8192,
                "input_types": ["text"],
                "output_types": ["text", "code"],
                "supported_languages": ["zh", "en"],
                "pricing_input": 2.0,
                "pricing_output": 6.0,
                "currency": "CNY",
                "is_available": True,
                "is_featured": False,
                "sort_order": 3,
                "description": "阿里云通义千问开源最强模型",
            },
            {
                "id": 4,
                "name": "GPT-4o",
                "slug": "gpt-4o",
                "display_name": "GPT-4o",
                "provider": "OpenAI",
                "provider_logo": "/images/providers/openai.png",
                "type": "llm",
                "family": "GPT-4",
                "context_window": 128000,
                "max_output_tokens": 4096,
                "input_types": ["text", "image", "audio"],
                "output_types": ["text", "code"],
                "supported_languages": ["zh", "en", "ja", "ko"],
                "pricing_input": 5.0,
                "pricing_output": 15.0,
                "currency": "CNY",
                "is_available": True,
                "is_featured": True,
                "sort_order": 0,
                "description": "OpenAI 多模态旗舰模型",
            }
        ]

        # 技能数据
        self.skills: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "Computer Use",
                "slug": "computer-use",
                "version": "1.0.0",
                "category": "automation",
                "subcategory": "桌面自动化",
                "tags": ["computer", "automation", "gui"],
                "description": "让 AI 控制电脑完成各种任务",
                "long_description": "# Computer Use 技能\n\n让 AI 能够控制你的电脑，完成各种桌面操作。",
                "icon_url": "/images/skills/computer-use.png",
                "author_id": 1,
                "author_name": "MoltyBox",
                "is_official": True,
                "download_count": 1523,
                "install_count": 892,
                "rating": 4.8,
                "rating_count": 156,
                "is_published": True,
                "is_featured": True,
                "created_at": datetime.utcnow() - timedelta(days=60),
                "published_at": datetime.utcnow() - timedelta(days=58),
            },
            {
                "id": 2,
                "name": "Web 自动化",
                "slug": "web-automation",
                "version": "2.1.0",
                "category": "automation",
                "subcategory": "网页自动化",
                "tags": ["selenium", "playwright", "web"],
                "description": "自动执行网页操作任务",
                "long_description": "# Web 自动化技能\n\n支持 Selenium 和 Playwright 的网页自动化脚本。",
                "icon_url": "/images/skills/web-automation.png",
                "author_id": 1,
                "author_name": "MoltyBox",
                "is_official": True,
                "download_count": 2341,
                "install_count": 1567,
                "rating": 4.7,
                "rating_count": 234,
                "is_published": True,
                "is_featured": True,
                "created_at": datetime.utcnow() - timedelta(days=90),
                "published_at": datetime.utcnow() - timedelta(days=88),
            },
            {
                "id": 3,
                "name": "数据分析",
                "slug": "data-analysis",
                "version": "1.5.0",
                "category": "analysis",
                "subcategory": "数据处理",
                "tags": ["pandas", "numpy", "excel"],
                "description": "专业数据分析工具",
                "long_description": "# 数据分析技能\n\n使用 pandas、numpy 进行数据处理和分析。",
                "icon_url": "/images/skills/data-analysis.png",
                "author_id": 2,
                "author_name": "DataPro",
                "is_official": False,
                "download_count": 1876,
                "install_count": 1234,
                "rating": 4.6,
                "rating_count": 189,
                "is_published": True,
                "is_featured": False,
                "created_at": datetime.utcnow() - timedelta(days=45),
                "published_at": datetime.utcnow() - timedelta(days=43),
            },
            {
                "id": 4,
                "name": "文档生成",
                "slug": "document-generation",
                "version": "1.2.0",
                "category": "creation",
                "subcategory": "文档处理",
                "tags": ["docx", "pdf", "template"],
                "description": "自动生成各类文档",
                "icon_url": "/images/skills/doc-gen.png",
                "author_id": 1,
                "author_name": "MoltyBox",
                "is_official": True,
                "download_count": 956,
                "install_count": 678,
                "rating": 4.5,
                "rating_count": 87,
                "is_published": True,
                "is_featured": False,
                "created_at": datetime.utcnow() - timedelta(days=30),
                "published_at": datetime.utcnow() - timedelta(days=28),
            }
        ]

        # 智能体数据
        self.agents: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "客服助手",
                "slug": "customer-service-assistant",
                "tagline": "7x24 小时智能客服",
                "category": "customer_service",
                "industry": "电商",
                "description": "专为电商设计的智能客服助手",
                "long_description": "# 客服助手\n\n自动回复客户咨询，处理常见问题。",
                "icon_url": "/images/agents/customer-service.png",
                "skills": [1, 2],
                "capabilities": ["multi_turn", "file_upload"],
                "integrations": ["whatsapp", "wechat"],
                "usage_count": 5623,
                "active_user_count": 1234,
                "rating": 4.7,
                "rating_count": 342,
                "is_published": True,
                "is_featured": True,
                "is_template": True,
                "pricing_type": "freemium",
                "price": 0,
                "created_by": 1,
                "created_at": datetime.utcnow() - timedelta(days=120),
                "published_at": datetime.utcnow() - timedelta(days=118),
            },
            {
                "id": 2,
                "name": "数据分析师",
                "slug": "data-analyst",
                "tagline": "你的专属数据分析师",
                "category": "analysis",
                "industry": "通用",
                "description": "专业数据分析智能体",
                "icon_url": "/images/agents/data-analyst.png",
                "skills": [3],
                "capabilities": ["file_upload", "code_execution"],
                "integrations": [],
                "usage_count": 3421,
                "active_user_count": 876,
                "rating": 4.8,
                "rating_count": 213,
                "is_published": True,
                "is_featured": True,
                "is_template": True,
                "pricing_type": "paid",
                "price": 9900,
                "created_by": 1,
                "created_at": datetime.utcnow() - timedelta(days=90),
                "published_at": datetime.utcnow() - timedelta(days=88),
            },
            {
                "id": 3,
                "name": "内容创作家",
                "slug": "content-creator",
                "tagline": "自媒体内容创作助手",
                "category": "marketing",
                "industry": "媒体",
                "description": "帮助你创作优质内容",
                "icon_url": "/images/agents/content-creator.png",
                "skills": [4],
                "capabilities": ["multi_turn"],
                "integrations": [],
                "usage_count": 2156,
                "active_user_count": 543,
                "rating": 4.5,
                "rating_count": 167,
                "is_published": True,
                "is_featured": False,
                "is_template": True,
                "pricing_type": "free",
                "price": 0,
                "created_by": 2,
                "created_at": datetime.utcnow() - timedelta(days=60),
                "published_at": datetime.utcnow() - timedelta(days=58),
            }
        ]

        # 硬件产品数据
        self.hardware_products: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "MoltyBox Mini",
                "slug": "moltybox-mini",
                "price": 299900,
                "original_price": 349900,
                "currency": "CNY",
                "short_description": "入门级 AI 盒子，适合个人用户",
                "tagline": "小巧强大，开箱即用",
                "description": "# MoltyBox Mini\n\n## 产品亮点\n- 紧凑设计，节省空间\n- 低功耗，静音运行\n- 预装 MoltyBox 系统",
                "specs": {
                    "processor": "Intel Core i5-12450H",
                    "memory": "8GB DDR4",
                    "storage": "256GB NVMe SSD",
                    "os": "Windows 11 Pro",
                    "network": "Gigabit Ethernet + WiFi 6",
                    "ports": "4x USB 3.0, 1x HDMI 2.0, 1x RJ45"
                },
                "features": ["开箱即用", "私有安全", "全能助手", "远程协同", "低功耗", "静音设计"],
                "images": ["/images/hardware/mini-1.jpg", "/images/hardware/mini-2.jpg"],
                "cover_image": "/images/hardware/mini-cover.jpg",
                "stock": 100,
                "sku": "MB-MINI-001",
                "is_available": True,
                "is_featured": True,
                "is_new": False,
                "sort_order": 1,
                "view_count": 15234,
                "purchase_count": 892,
                "created_at": datetime.utcnow() - timedelta(days=180),
                "published_at": datetime.utcnow() - timedelta(days=175),
            },
            {
                "id": 2,
                "name": "MoltyBox Pro",
                "slug": "moltybox-pro",
                "price": 599900,
                "original_price": 699900,
                "currency": "CNY",
                "short_description": "专业级 AI 盒子，适合企业和团队",
                "tagline": "强劲性能，专业之选",
                "description": "# MoltyBox Pro\n\n## 产品亮点\n- 强劲性能，支持多模型并发\n- 大内存，多任务处理\n- 企业级功能支持",
                "specs": {
                    "processor": "Intel Core i7-13700H",
                    "memory": "32GB DDR5",
                    "storage": "1TB NVMe SSD",
                    "os": "Windows 11 Pro",
                    "network": "2.5G Ethernet + WiFi 6E",
                    "ports": "6x USB 3.2, 2x HDMI 2.1, 2x RJ45, Thunderbolt 4"
                },
                "features": ["强劲性能", "企业安全", "多模型并发", "专属支持", "可扩展存储", "冗余电源"],
                "images": ["/images/hardware/pro-1.jpg", "/images/hardware/pro-2.jpg"],
                "cover_image": "/images/hardware/pro-cover.jpg",
                "stock": 50,
                "sku": "MB-PRO-001",
                "is_available": True,
                "is_featured": True,
                "is_new": True,
                "sort_order": 2,
                "view_count": 8765,
                "purchase_count": 234,
                "created_at": datetime.utcnow() - timedelta(days=60),
                "published_at": datetime.utcnow() - timedelta(days=55),
            }
        ]

        # 定价计划
        self.pricing_plans: List[Dict[str, Any]] = [
            {
                "id": 1,
                "name": "个人版",
                "slug": "free",
                "price": 0,
                "annual_price": 0,
                "currency": "CNY",
                "description": "适合个人用户和开发者",
                "tagline": "永久免费",
                "features": [
                    "10 个技能",
                    "5 个智能体",
                    "基础模型访问",
                    "社区支持"
                ],
                "limits": {"max_skills": 10, "max_agents": 5, "storage_gb": 10},
                "is_available": True,
                "is_popular": False,
                "sort_order": 1,
                "subscriber_count": 15230,
            },
            {
                "id": 2,
                "name": "专业版",
                "slug": "pro",
                "price": 29900,
                "annual_price": 299000,
                "currency": "CNY",
                "description": "适合专业用户和小型团队",
                "tagline": "最受欢迎",
                "features": [
                    "无限技能",
                    "无限智能体",
                    "所有模型访问",
                    "优先支持",
                    "云端同步",
                    "API 访问"
                ],
                "limits": {"max_skills": -1, "max_agents": -1, "storage_gb": 100},
                "is_available": True,
                "is_popular": True,
                "sort_order": 2,
                "subscriber_count": 3420,
            },
            {
                "id": 3,
                "name": "团队版",
                "slug": "team",
                "price": 99900,
                "annual_price": 999000,
                "currency": "CNY",
                "description": "适合成长型团队",
                "tagline": "高效协作",
                "features": [
                    "专业版所有功能",
                    "10 个团队成员",
                    "团队协作空间",
                    "管理员控制台",
                    "SSO 单点登录",
                    "专属客户成功经理"
                ],
                "limits": {"max_skills": -1, "max_agents": -1, "storage_gb": 500, "max_members": 10},
                "is_available": True,
                "is_popular": False,
                "sort_order": 3,
                "subscriber_count": 567,
            }
        ]

        # 博客文章
        self.blog_posts: List[Dict[str, Any]] = [
            {
                "id": 1,
                "title": "MoltyBox 1.0 正式发布：开启 AI 智能体新时代",
                "slug": "moltybox-1-0-release",
                "excerpt": "我们很高兴地宣布 MoltyBox 1.0 正式发布，带来全新的 AI 智能体体验。",
                "content": "# MoltyBox 1.0 正式发布\n\n我们很高兴地宣布 MoltyBox 1.0 正式发布...",
                "cover_image": "/images/blog/release-1-0.jpg",
                "author_id": 1,
                "author_name": "MoltyBox 团队",
                "category": "product",
                "tags": ["发布", "产品更新"],
                "is_published": True,
                "is_featured": True,
                "view_count": 5234,
                "created_at": datetime.utcnow() - timedelta(days=10),
                "published_at": datetime.utcnow() - timedelta(days=10),
            },
            {
                "id": 2,
                "title": "如何使用 Computer Use 技能自动化日常工作",
                "slug": "computer-use-tutorial",
                "excerpt": "学习如何使用 Computer Use 技能来自动化你的日常工作流程。",
                "content": "# Computer Use 技能教程\n\n## 什么是 Computer Use？\n\nComputer Use 是一个强大的自动化技能...",
                "cover_image": "/images/blog/computer-use.jpg",
                "author_id": 1,
                "author_name": "MoltyBox 团队",
                "category": "tutorial",
                "tags": ["教程", "技能", "自动化"],
                "is_published": True,
                "is_featured": False,
                "view_count": 3421,
                "created_at": datetime.utcnow() - timedelta(days=5),
                "published_at": datetime.utcnow() - timedelta(days=5),
            }
        ]

        # 文档
        self.documentations: List[Dict[str, Any]] = [
            {
                "id": 1,
                "title": "快速开始",
                "slug": "quick-start",
                "parent_id": None,
                "content": "# 快速开始\n\n欢迎使用 MoltyBox！本指南将帮助你在 5 分钟内完成入门配置。",
                "order": 1,
                "category": "getting-started",
                "is_published": True,
                "updated_at": datetime.utcnow(),
            },
            {
                "id": 2,
                "title": "安装指南",
                "slug": "installation",
                "parent_id": 1,
                "content": "# 安装指南\n\n## 系统要求\n\n- Windows 10 或更高版本\n- macOS 12 或更高版本\n- 4GB 内存（推荐 8GB）\n- 10GB 可用存储空间",
                "order": 1,
                "category": "getting-started",
                "is_published": True,
                "updated_at": datetime.utcnow(),
            },
            {
                "id": 3,
                "title": "核心概念",
                "slug": "core-concepts",
                "parent_id": None,
                "content": "# 核心概念\n\n了解 MoltyBox 的核心概念和架构。",
                "order": 2,
                "category": "concepts",
                "is_published": True,
                "updated_at": datetime.utcnow(),
            }
        ]

        # 企业案例
        self.enterprise_cases: List[Dict[str, Any]] = [
            {
                "id": 1,
                "company_name": "某金融科技公司",
                "slug": "fintech-customer-service",
                "industry": "金融",
                "logo_url": "/images/cases/fintech-logo.png",
                "challenge": "客服人力成本高，响应速度慢，客户满意度低",
                "solution": "部署 MoltyBox AI 客服系统，处理 80% 的常见咨询",
                "results": [
                    "客服效率提升 300%",
                    "人力成本降低 60%",
                    "客户满意度从 75% 提升至 95%",
                    "7x24 小时不间断服务"
                ],
                "testimonial": "MoltyBox 帮助我们彻底改造了客服体系，现在我们的客户等待时间从平均 5 分钟降至 30 秒。",
                "testimonial_author": "张总，CTO",
                "is_featured": True,
                "created_at": datetime.utcnow() - timedelta(days=90),
            },
            {
                "id": 2,
                "company_name": "某电商公司",
                "slug": "ecommerce-operations",
                "industry": "电商",
                "logo_url": "/images/cases/ecommerce-logo.png",
                "challenge": "运营流程复杂，人工操作错误率高",
                "solution": "使用 MoltyBox 自动化技能处理订单、库存、物流",
                "results": [
                    "订单处理时间从 2 小时降至 10 分钟",
                    "错误率从 5% 降至 0.1%",
                    "运营效率提升 400%"
                ],
                "testimonial": "MoltyBox 的自动化技能让我们的运营团队可以专注于更有价值的工作。",
                "testimonial_author": "李总，运营总监",
                "is_featured": True,
                "created_at": datetime.utcnow() - timedelta(days=60),
            }
        ]

        # 合伙人申请
        self.partner_applications: List[Dict[str, Any]] = []

        # 推荐官申请
        self.referral_applications: List[Dict[str, Any]] = []

        # 企业咨询
        self.enterprise_inquiries: List[Dict[str, Any]] = []

        # 硬件订单
        self.hardware_orders: List[Dict[str, Any]] = []

        # 客户端版本
        self.client_versions: List[Dict[str, Any]] = [
            {
                "id": 1,
                "platform": "windows",
                "architecture": "x64",
                "version": "1.2.0",
                "build_number": 120,
                "release_notes": "## 更新内容\n\n- 新增支持 Claude-3.5 模型\n- 优化 Computer Use 技能性能\n- 修复已知问题",
                "download_url": "https://download.moltybox.ai/windows/x64/MoltyBox-1.2.0.exe",
                "file_size": 157286400,
                "checksum_sha256": "abc123def456...",
                "recommended": True,
                "required": False,
                "is_published": True,
                "published_at": datetime.utcnow() - timedelta(days=7),
            },
            {
                "id": 2,
                "platform": "macos",
                "architecture": "arm64",
                "version": "1.2.0",
                "build_number": 120,
                "release_notes": "## 更新内容\n\n- 新增支持 Claude-3.5 模型\n- 优化 Computer Use 技能性能\n- 修复已知问题",
                "download_url": "https://download.moltybox.ai/macos/arm64/MoltyBox-1.2.0.dmg",
                "file_size": 145678900,
                "checksum_sha256": "def456abc789...",
                "recommended": True,
                "required": False,
                "is_published": True,
                "published_at": datetime.utcnow() - timedelta(days=7),
            }
        ]

        # 页面浏览统计
        self.page_views: List[Dict[str, Any]] = []

        # 转化事件
        self.conversion_events: List[Dict[str, Any]] = []

    # ==================== 用户相关 ====================

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """根据邮箱获取用户"""
        for user in self.users:
            if user["email"] == email:
                return user
        return None

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """根据 ID 获取用户"""
        for user in self.users:
            if user["id"] == user_id:
                return user
        return None

    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """根据用户名获取用户"""
        for user in self.users:
            if user["username"] == username:
                return user
        return None

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建用户"""
        user_data["id"] = len(self.users) + 1
        user_data["created_at"] = datetime.utcnow()
        self.users.append(user_data)
        return user_data

    # ==================== AI 模型相关 ====================

    def get_all_models(self, model_type: str = None, provider: str = None, is_available: bool = True) -> List[Dict[str, Any]]:
        """获取 AI 模型列表"""
        models = self.ai_models.copy()
        if model_type:
            models = [m for m in models if m["type"] == model_type]
        if provider:
            models = [m for m in models if m["provider"] == provider]
        if is_available:
            models = [m for m in models if m["is_available"]]
        return sorted(models, key=lambda x: x["sort_order"])

    def get_model_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取模型"""
        for model in self.ai_models:
            if model["slug"] == slug:
                return model
        return None

    def get_providers(self) -> List[str]:
        """获取所有提供商"""
        return list(set(m["provider"] for m in self.ai_models))

    # ==================== 技能相关 ====================

    def get_all_skills(
        self,
        category: str = None,
        is_published: bool = True,
        is_featured: bool = None
    ) -> List[Dict[str, Any]]:
        """获取技能列表"""
        skills = self.skills.copy()
        if category:
            skills = [s for s in skills if s["category"] == category]
        if is_published:
            skills = [s for s in skills if s["is_published"]]
        if is_featured is not None:
            skills = [s for s in skills if s["is_featured"] == is_featured]
        return sorted(skills, key=lambda x: x["download_count"], reverse=True)

    def get_skill_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取技能"""
        for skill in self.skills:
            if skill["slug"] == slug:
                return skill
        return None

    def get_skill_categories(self) -> List[str]:
        """获取所有技能分类"""
        return list(set(s["category"] for s in self.skills))

    # ==================== 智能体相关 ====================

    def get_all_agents(
        self,
        category: str = None,
        is_published: bool = True
    ) -> List[Dict[str, Any]]:
        """获取智能体列表"""
        agents = self.agents.copy()
        if category:
            agents = [a for a in agents if a["category"] == category]
        if is_published:
            agents = [a for a in agents if a["is_published"]]
        return sorted(agents, key=lambda x: x["usage_count"], reverse=True)

    def get_agent_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取智能体"""
        for agent in self.agents:
            if agent["slug"] == slug:
                return agent
        return None

    def get_agent_categories(self) -> List[str]:
        """获取所有智能体分类"""
        return list(set(a["category"] for a in self.agents))

    # ==================== 硬件相关 ====================

    def get_all_hardware(self, is_available: bool = True) -> List[Dict[str, Any]]:
        """获取硬件列表"""
        products = self.hardware_products.copy()
        if is_available:
            products = [p for p in products if p["is_available"]]
        return sorted(products, key=lambda x: x["sort_order"])

    def get_hardware_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取硬件"""
        for product in self.hardware_products:
            if product["slug"] == slug:
                return product
        return None

    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """创建订单"""
        order_data["id"] = len(self.hardware_orders) + 1
        order_no = f"HW-{datetime.utcnow().strftime('%Y%m%d')}-{order_data['id']:04d}"
        order_data["order_no"] = order_no
        order_data["created_at"] = datetime.utcnow()
        self.hardware_orders.append(order_data)
        return order_data

    def get_order_by_no(self, order_no: str) -> Optional[Dict[str, Any]]:
        """根据订单号获取订单"""
        for order in self.hardware_orders:
            if order["order_no"] == order_no:
                return order
        return None

    # ==================== 定价相关 ====================

    def get_all_plans(self) -> List[Dict[str, Any]]:
        """获取所有定价计划"""
        return sorted(self.pricing_plans.copy(), key=lambda x: x["sort_order"])

    def get_plan_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取计划"""
        for plan in self.pricing_plans:
            if plan["slug"] == slug:
                return plan
        return None

    # ==================== 博客相关 ====================

    def get_all_posts(
        self,
        category: str = None,
        is_published: bool = True,
        limit: int = 10,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """获取博客文章列表"""
        posts = self.blog_posts.copy()
        if category:
            posts = [p for p in posts if p["category"] == category]
        if is_published:
            posts = [p for p in posts if p["is_published"]]
        posts = sorted(posts, key=lambda x: x["published_at"], reverse=True)
        return posts[offset:offset + limit]

    def get_post_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取文章"""
        for post in self.blog_posts:
            if post["slug"] == slug:
                return post
        return None

    def get_blog_categories(self) -> List[str]:
        """获取博客分类"""
        return list(set(p["category"] for p in self.blog_posts))

    # ==================== 文档相关 ====================

    def get_documentation_tree(self) -> List[Dict[str, Any]]:
        """获取文档树"""
        docs = [d for d in self.documentations if d["is_published"]]
        root_docs = [d for d in docs if d["parent_id"] is None]
        for root in root_docs:
            root["children"] = [
                d for d in docs if d["parent_id"] == root["id"]
            ]
        return sorted(root_docs, key=lambda x: x["order"])

    def get_doc_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取文档"""
        for doc in self.documentations:
            if doc["slug"] == slug:
                return doc
        return None

    # ==================== 企业案例相关 ====================

    def get_all_cases(self, is_featured: bool = None) -> List[Dict[str, Any]]:
        """获取企业案例"""
        cases = self.enterprise_cases.copy()
        if is_featured is not None:
            cases = [c for c in cases if c["is_featured"] == is_featured]
        return cases

    def get_case_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """根据 slug 获取案例"""
        for case in self.enterprise_cases:
            if case["slug"] == slug:
                return case
        return None

    # ==================== 合伙人相关 ====================

    def create_partner_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """创建合伙人申请"""
        data["id"] = len(self.partner_applications) + 1
        application_no = f"PA-{datetime.utcnow().strftime('%Y%m%d')}-{data['id']:04d}"
        data["application_no"] = application_no
        data["status"] = "pending"
        data["submitted_at"] = datetime.utcnow()
        data["created_at"] = datetime.utcnow()
        self.partner_applications.append(data)
        return data

    def get_all_partner_applications(self) -> List[Dict[str, Any]]:
        """获取所有合伙人申请"""
        return self.partner_applications

    def get_partner_application(self, app_id: int) -> Optional[Dict[str, Any]]:
        """根据 ID 获取申请"""
        for app in self.partner_applications:
            if app["id"] == app_id:
                return app
        return None

    # ==================== 推荐官相关 ====================

    def create_referral_application(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """创建推荐官申请"""
        data["id"] = len(self.referral_applications) + 1
        data["status"] = "pending"
        data["created_at"] = datetime.utcnow()
        self.referral_applications.append(data)
        return data

    # ==================== 企业咨询相关 ====================

    def create_enterprise_inquiry(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """创建企业咨询"""
        data["id"] = len(self.enterprise_inquiries) + 1
        inquiry_no = f"EQ-{datetime.utcnow().strftime('%Y%m%d')}-{data['id']:04d}"
        data["inquiry_no"] = inquiry_no
        data["status"] = "pending"
        data["created_at"] = datetime.utcnow()
        # 字段映射（如果有别名）
        data["company_name"] = data.get("company_name", data.get("company"))
        data["contact_name"] = data.get("contact_name", data.get("name"))
        data["contact_email"] = data.get("contact_email", data.get("email"))
        data["contact_phone"] = data.get("contact_phone", data.get("phone"))
        self.enterprise_inquiries.append(data)
        return data

    def get_all_enterprise_inquiries(self) -> List[Dict[str, Any]]:
        """获取所有企业咨询"""
        return self.enterprise_inquiries

    # ==================== 客户端版本相关 ====================

    def get_client_version(
        self,
        platform: str,
        architecture: str,
        current_version: str
    ) -> Dict[str, Any]:
        """检查客户端版本"""
        versions = [
            v for v in self.client_versions
            if v["platform"] == platform
            and v["architecture"] == architecture
            and v["is_published"]
        ]
        if not versions:
            return {"has_update": False}

        latest = max(versions, key=lambda x: x["build_number"])
        has_update = latest["version"] != current_version

        return {
            "has_update": has_update,
            "latest": latest if has_update else None,
            "current": {
                "version": current_version,
                "deprecated": False
            }
        }


# 全局 Mock 数据库实例
db = MockDatabase()
