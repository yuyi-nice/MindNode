# MoltyBox Backend API - 快速开始指南

## 项目结构

```
moltybox-api/
├── app/
│   ├── main.py              # 应用入口
│   ├── config.py            # 配置管理
│   ├── api/
│   │   ├── v1/
│   │   │   ├── router.py    # 路由聚合 (19 个路由模块)
│   │   │   ├── auth.py      # 认证接口
│   │   │   ├── users.py     # 用户接口
│   │   │   ├── models.py    # AI 模型接口
│   │   │   ├── skills.py    # 技能接口
│   │   │   ├── agents.py    # 智能体接口
│   │   │   ├── hardware.py  # 硬件接口
│   │   │   ├── partners.py  # 合伙人接口
│   │   │   ├── referrals.py # 推荐官接口
│   │   │   ├── enterprise.py# 企业版接口
│   │   │   ├── pricing.py   # 定价接口
│   │   │   ├── blog.py      # 博客接口
│   │   │   ├── docs.py      # 文档接口
│   │   │   ├── client.py    # 客户端接口
│   │   │   ├── upload.py    # 上传接口
│   │   │   ├── analytics.py # 分析接口
│   │   │   └── other.py     # 其他接口
│   │   └── deps.py          # 依赖注入
│   ├── core/
│   │   ├── config.py        # 配置类
│   │   ├── security.py      # JWT/密码加密
│   │   └── exceptions.py    # 自定义异常
│   ├── mock/
│   │   └── data.py          # Mock 数据库 (所有假数据)
│   └── schemas/             # Pydantic 模式
├── requirements.txt
├── .env
└── README.md
```

## 启动服务器

```bash
cd moltybox-api
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

访问 http://localhost:8000/docs 查看 API 文档。

## API 端点总览

| 分组 | 端点数 | 说明 |
|-----|-------|------|
| 认证 | 6 | 注册、登录、登出、刷新 Token |
| 用户 | 5 | 用户信息、修改密码 |
| AI 模型 | 3 | 模型列表、详情、提供商 |
| 技能 | 4 | 技能列表、详情、下载 |
| 智能体 | 3 | 智能体列表、详情 |
| 硬件 | 4 | 产品列表、订单创建 |
| 合伙人 | 5 | 申请、收益说明、流程 |
| 推荐官 | 7 | 申请、统计、提现 |
| 企业版 | 4 | 咨询、案例 |
| 定价 | 7 | 计划、订阅 |
| 博客 | 4 | 文章列表、详情 |
| 文档 | 3 | 文档树、详情、搜索 |
| 客户端 | 5 | 版本检查、配置 |
| 上传 | 4 | 图片、文件上传 |
| 分析 | 8 | 页面浏览、事件追踪 |
| 其他 | 3 | 订阅、联系表单 |
| **总计** | **110+** | - |

## Mock 数据说明

所有数据都存储在 `app/mock/data.py` 中的 `MockDatabase` 类中，包括：

- **用户**: 2 个预置用户（admin、testuser）
- **AI 模型**: 4 个模型（DeepSeek-V3、Claude-3.5-Sonnet、Qwen2.5-72B、GPT-4o）
- **技能**: 4 个技能（Computer Use、Web 自动化、数据分析、文档生成）
- **智能体**: 3 个智能体（客服助手、数据分析师、内容创作家）
- **硬件**: 2 个产品（MoltyBox Mini、MoltyBox Pro）
- **定价**: 3 个计划（个人版、专业版、团队版）
- **博客**: 2 篇文章
- **文档**: 3 篇文档
- **企业案例**: 2 个案例
- **客户端版本**: 2 个版本（Windows、macOS）

## 测试 API

```bash
# 获取模型列表
curl http://localhost:8000/api/v1/models

# 获取技能列表
curl http://localhost:8000/api/v1/skills

# 获取定价计划
curl http://localhost:8000/api/v1/pricing/plans

# 用户登录
curl -X POST "http://localhost:8000/api/v1/auth/login?email=admin@moltybox.ai&password=admin123"

# 获取硬件产品
curl http://localhost:8000/api/v1/hardware
```

## 下一步

1. 替换 Mock 数据为真实数据库连接
2. 实现文件上传的实际存储逻辑
3. 配置真实的邮件发送服务
4. 添加支付接口集成
5. 实现 Celery 异步任务
