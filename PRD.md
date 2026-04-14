# MindNode 官方网站 产品需求文档 (PRD)

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品名称 | MindNode 官方网站 |
| 文档版本 | v1.2 |
| 最后更新 | 2026-04-14 |
| 文档状态 | 进行中 |

---

## 1. 产品概述

### 1.1 产品定位

MindNode 是一个面向 AI 智能体的云平台和硬件一体化解决方案提供商。产品定位为「AI 智能体装配线」，提供从模型、技能到硬件的完整基础设施。

### 1.2 目标用户

| 用户类型 | 描述 | 核心需求 |
|---------|------|---------|
| 个人用户 | 开发者、AI 爱好者 | 快速部署 AI 助手、使用预置技能 |
| 小型企业 | 创业团队、工作室 | 低成本 AI 解决方案、私有化部署 |
| 渠道伙伴 | 区域代理、系统集成商 | 销售返点、技术支持、培训资源 |
| 大型企业 | 中大型公司 | 企业级安全、定制开发、专属支持 |

### 1.3 核心价值主张

- **开箱即用**：软硬件一体化，无需复杂配置
- **私有安全**：数据本地存储，隐私保护
- **全能助手**：支持主流大模型（Claude、GPT-4o、DeepSeek 等）
- **远程协同**：通过 WhatsApp/钉钉/飞书/企业微信控制

---

## 2. 功能架构

### 2.1 网站架构图

```
MindNode 官网
├── 首页 (Home)
├── MindNode（产品下载）
├── 技能库
├── 盒子（硬件）
├── 模型
├── 合伙人
├── 推荐官计划
├── 企业版
├── 资源（下拉菜单）
│   ├── 智能体
│   ├── 定价
│   ├── 文档
│   └── 博客
└── 控制台 (Dashboard) - 需登录
    ├── 概览
    ├── API 密钥
    ├── 账单
    ├── 使用历史
    ├── 邀请记录
    └── 设置
```

### 2.2 页面清单

| 序号 | 页面名称 | 路由 | 页面文件 | 状态 |
|-----|---------|------|---------|-----|
| 1 | 首页 | `/` | Home.jsx | ✅ |
| 2 | MindNode 产品页 | `/moltybox` | MindNode.jsx | ✅ |
| 3 | 技能库 | `/skills` | Skills.jsx | ✅ |
| 4 | 硬件产品页 | `/hardware` | Hardware.jsx | ✅ |
| 5 | 模型页 | `/models` | Models.jsx | ✅ |
| 6 | 合伙人页 | `/partner` | Partner.jsx | ✅ |
| 7 | 推荐官计划 | `/referral-program` | ReferralProgram.jsx | ✅ |
| 8 | 企业版 | `/enterprise` | Enterprise.jsx | ✅ |
| 9 | 智能体 | `/agents` | Agents.jsx | ✅ |
| 10 | 定价 | `/pricing` | Pricing.jsx | ✅ |
| 11 | 文档中心 | `/documentation` | Documentation.jsx | ✅ |
| 12 | 博客 | `/blog` | Blog.jsx | ✅ |
| 13 | 登录 | `/login` | Login.jsx | ✅ |
| 14 | 注册 | `/register` | Register.jsx | ✅ |
| 15 | Dashboard 布局 | `/dashboard` | Dashboard.jsx | ✅ |
| 16 | 控制台概览 | `/dashboard` | DashboardOverview.jsx | ✅ |
| 17 | API 密钥管理 | `/dashboard/api-keys` | DashboardApiKeys.jsx | ✅ |
| 18 | 账单与充值 | `/dashboard/billing` | DashboardBilling.jsx | ✅ |
| 19 | 使用历史 | `/dashboard/usage` | DashboardUsage.jsx | ✅ |
| 20 | 邀请记录 | `/dashboard/referrals` | DashboardReferrals.jsx | ✅ |
| 21 | 账户设置 | `/dashboard/settings` | DashboardSettings.jsx | ✅ |

---

## 3. 页面详情

### 3.1 首页 (Home)

**目标**：展示产品全貌，引导用户了解核心产品

**核心模块**：

| 模块 | 内容 | 功能 |
|-----|------|-----|
| Hero Section | 主标题「驱动下一代 AI 智能体」 | 价值传达，CTA 按钮 |
| 架构总览 | 流程图（Brain → Skills → Scenarios → Runtime） | 展示技术架构 |
| 模型中心 | 支持的模型列表（DeepSeek、Qwen、Moonshot、MiniMax） | 展示生态合作 |
| 技能工作流 | 可复用的 AI 技能展示 | 引导至技能库 |
| 硬件展示 | MindNode Mini 主机 | 引导至硬件购买 |
| CTA 区域 | 「开始使用」按钮 | 转化引导 |

---

### 3.2 MindNode 产品页

**目标**：引导用户下载/使用 MindNode 产品

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 桌面客户端下载 | Windows/Mac 版本下载按钮 |
| 云端版入口 | 跳转云端版入口 |
| Agent 市场导流 | 引导至技能市场 |
| 三步接入流程 | 硬件上电 → 技能调用 → 远程协同 |
| 移动端协同 | 展示远程访问能力 |

---

### 3.3 技能库 (Skills)

**目标**：展示和分发 AI Agent 技能

**核心模块**：

| 模块 | 功能 |
|-----|------|
| 搜索栏 | 搜索技能 |
| 筛选器 | 按类型、热度排序 |
| 技能分类 | 按领域分类展示 |
| FAQ | 解答常见问题 |

---

### 3.4 硬件产品页 (Hardware)

**目标**：销售 MindNode Mini 主机

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 产品展示 | 产品图、价格（¥2999） |
| 核心卖点 | 6 大功能特性 |
| 标准配置 | 处理器、内存、存储等参数 |
| 为什么选择 | 产品优势说明 |

**产品规格**：
- 处理器：Intel Core i7 四核八线程
- 内存：8GB
- 存储：256GB SSD
- 系统：Windows
- 接口：HDMI、USB 3.0、RJ45

---

### 3.5 模型页 (Models)

**目标**：展示支持的 AI 模型列表

**核心模块**：

| 模块 | 功能 |
|-----|------|
| Tab 切换 | LLM / 探索 |
| 搜索 | 模型搜索 |
| 筛选 | 输入类型、上下文窗口、提供商 |
| 模型网格 | 展示模型卡片 |

---

### 3.6 合伙人页 (Partner)

**目标**：招募渠道合作伙伴

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 市场机会 | AI 算力市场分析 |
| 伙伴类型 | 渠道收益伙伴 / 生态共建伙伴 |
| 收益体系 | 销售差价、业绩返点、区域保护 |
| 合作流程 | 5 步流程说明 |
| FAQ | 常见问题解答 |

---

### 3.7 推荐官计划 (ReferralProgram)

**目标**：激励用户推荐新客户

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 推荐流程 | 4 步流程说明 |
| 佣金等级 | 青铜 (10%) / 白银 (15%) / 黄金 (20%) |
| FAQ | 常见问题 |
| 申请表单 | 引导加入 |

---

### 3.8 企业版 (Enterprise)

**目标**：获取企业客户线索

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 企业能力 | 私有化部署、定制开发、安全合规 |
| 企业案例 | 客户案例展示 |
| CTA | 联系销售、预约演示 |

---

### 3.9 智能体 (Agents)

**目标**：展示 AI 智能体应用市场

**核心模块**：

| 模块 | 功能 |
|-----|------|
| 智能体网格 | 展示热门智能体 |
| 分类筛选 | 按领域分类 |
| CTA | 定制智能体引导 |

---

### 3.10 定价页 (Pricing)

**目标**：清晰展示产品价格

**核心模块**：

| 模块 | 内容 |
|-----|------|
| SaaS 方案 | 个人版 (免费) / 专业版 (¥299/月) / 团队版 (¥999/月) |
| 硬件方案 | Mini (¥2999) / Pro (¥5999) |
| FAQ | 价格相关问题 |

---

### 3.11 文档中心 (Documentation)

**目标**：提供开发者文档

**核心模块**：

| 模块 | 内容 |
|-----|------|
| 文档分类 | 快速开始、核心概念、技能开发、模型集成、部署运维、安全合规 |
| 搜索 | 文档搜索 |
| 资源链接 | GitHub、SDK、API Playground |

---

### 3.12 博客 (Blog)

**目标**：内容营销、SEO

**核心模块**：

| 模块 | 功能 |
|-----|------|
| 精选文章 | 置顶重要文章 |
| 文章列表 | 按分类筛选 |
| 邮件订阅 | 获取更新通知 |

---

### 3.21 账户设置 (DashboardSettings)

**目标**：管理用户账户信息

**核心模块**：

| 模块 | 功能 |
|-----|------|
| 用户管理 | 修改用户名、全名、头像，修改密码，注销账户 |
| 账户类型 | 显示当前订阅套餐 |

**所需 API 接口**：

| 接口 | 方法 | 路径 | 说明 |
|-----|------|------|------|
| 获取当前用户信息 | GET | `/auth/me` | 返回用户基本信息 |
| 更新用户信息 | PUT | `/users/me` | 更新 username、full_name、avatar_url |
| 修改密码 | PUT | `/users/me/password` | 需验证旧密码 |
| 注销账户 | DELETE | `/users/me` | 软删除用户账户 |
| 获取用户订阅信息 | GET | `/users/me/subscription` | 返回当前套餐类型、功能限制等 |

**接口详情**：

#### GET /auth/me
获取当前登录用户信息

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser",
    "full_name": "测试用户",
    "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com",
    "is_active": true,
    "is_verified": false,
    "created_at": "2026-04-01T10:00:00"
  }
}
```

#### PUT /users/me
更新当前用户信息

**请求体**：
```json
{
  "username": "newusername",
  "full_name": "新名称",
  "avatar_url": "https://example.com/avatar.png"
}
```

#### PUT /users/me/password
修改密码

**请求体**：
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

#### DELETE /users/me
注销账户（软删除）

#### GET /users/me/subscription
获取用户订阅信息

**响应示例**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "plan_slug": "free",
    "plan_name": "个人版",
    "price": 0,
    "currency": "CNY",
    "billing_cycle": null,
    "started_at": null,
    "expires_at": null,
    "is_active": true,
    "features": ["10 个技能", "5 个智能体", "基础模型访问", "社区支持"],
    "limits": {
      "max_skills": 10,
      "max_agents": 5,
      "storage_gb": 10
    }
  }
}
```

---

## 4. 技术架构

### 4.1 技术栈

| 层级 | 技术选型 | 版本 |
|-----|---------|------|
| 框架 | React | 18.3.1 |
| 构建工具 | Vite | 8.0.3 |
| 路由 | React Router DOM | 7.13.2 |
| 样式 | Tailwind CSS | 3.4.1 |
| CSS 处理 | PostCSS | 8.5.8 |
| 状态管理 | React Context API | - |
| HTTP 客户端 | Fetch API | - |
| 后端框架 | FastAPI | 0.109.0 |
| ASGI 服务器 | Uvicorn | 0.27.0 |
| 生产服务器 | Gunicorn | 21.2.0 |
| 数据验证 | Pydantic | 2.5.3 |
| 数据库 | PostgreSQL | 18.3 |
| 数据库驱动 | psycopg2-binary | 2.9.9 |

### 4.2 项目结构

```
moltybox-app/
├── public/
│   ├── images/          # 图片资源
│   │   └── logo.png
│   └── favicon.png
├── src/
│   ├── components/
│   │   └── Layout.jsx   # 布局组件（Header + Footer）
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MindNode.jsx
│   │   ├── Skills.jsx
│   │   ├── Hardware.jsx
│   │   ├── Models.jsx
│   │   ├── Partner.jsx
│   │   ├── ReferralProgram.jsx
│   │   ├── Enterprise.jsx
│   │   ├── Agents.jsx
│   │   ├── Pricing.jsx
│   │   ├── Documentation.jsx
│   │   ├── Blog.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx          # Dashboard 布局（左侧导航）
│   │   ├── DashboardOverview.jsx  # 控制台概览
│   │   ├── DashboardApiKeys.jsx   # API 密钥管理
│   │   ├── DashboardBilling.jsx   # 账单与充值
│   │   ├── DashboardUsage.jsx     # 使用历史
│   │   ├── DashboardReferrals.jsx # 邀请记录
│   │   └── DashboardSettings.jsx  # 账户设置
│   ├── contexts/
│   │   └── AuthContext.jsx  # 认证上下文
│   ├── lib/
│   │   └── api.js         # API 调用工具
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # 入口文件
│   └── index.css          # 全局样式
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### 4.3 设计系统

**CSS 变量（Design Tokens）**：

| 变量名 | 值 | 用途 |
|-------|-----|-----|
| `--v2-bg-page` | #fafafa | 页面背景 |
| `--v2-bg-surface` | #ffffff | 卡片背景 |
| `--v2-fg` | #0a0a0a | 主文字 |
| `--v2-fg-secondary` | #525252 | 次要文字 |
| `--v2-fg-tertiary` | #737373 | 辅助文字 |
| `--v2-border` | #e5e5e5 | 边框颜色 |
| `--v2-accent` | #6366f1 | 强调色 |
| `--v2-accent-muted` | #eef2ff | 强调色浅色 |
| `--v2-accent-fg` | #4338ca | 强调色深色 |

---

## 5. 用户体验

### 5.1 导航结构

**顶部导航栏**：
- Logo（返回首页）
- 主导航：MindNode、技能库、盒子、模型、合伙人、推荐官计划
- 下拉菜单：资源（智能体、定价、文档、博客）
- 企业版
- 用户头像（登录后显示，点击弹出菜单）

**用户头像下拉菜单**（登录后）：
- 用户信息（头像、邮箱）
- 控制台
- API 密钥
- 账单
- 使用历史
- 分隔线
- 主题切换（浅色/深色）
- 分隔线
- 退出登录

**Dashboard 左侧导航**：
- 概览
- API 密钥
- 账单
- 使用历史
- 邀请记录
- 分隔线
- 设置

**页脚导航**：
- 产品栏目
- 资源栏目
- 公司栏目
- 社交媒体链接（LinkedIn、邮件、Discord）

### 5.2 响应式设计

| 断点 | 尺寸 | 适配 |
|-----|------|-----|
| Mobile | < 640px | 隐藏导航，汉堡菜单 |
| Tablet | 640px - 1024px | 简化布局 |
| Desktop | > 1024px | 完整布局 |

---

## 6. 已实现功能

### 6.1 核心功能

| 功能 | 描述 | 状态 |
|-----|------|-----|
| 用户注册/登录 | 邮箱密码认证，JWT Token | ✅ |
| 用户头像 | DiceBear 随机头像生成 | ✅ |
| 页面路由 | 完整 21 个页面前端路由 | ✅ |
| Dashboard | 左侧导航布局，5 个子页面 | ✅ |
| API 密钥管理 | 创建、查看、吊销 API 密钥 | ✅ |
| 账单系统 | 余额查看、在线充值、自动充值 | ✅ |
| 使用历史 | API 调用记录、筛选、导出 | ✅ |
| 邀请记录 | 推荐记录查看、统计 | ✅ |
| 模型展示 | 模型列表、筛选、搜索 | ✅ |
| 技能市场 | 技能分类、筛选 | ✅ |

### 6.2 高优先级（待实现）

| 功能 | 描述 |
|-----|------|
| 隐私条款页 | `/privacy-terms` 页面 |
| 语言切换 | 中英文切换 |

**备注**: 后端 API 对接已于 2026-04-02 完成，所有主要页面（Models、Skills、Agents、Hardware、Pricing、Partner、ReferralProgram、Enterprise、Blog、Documentation、ContactUs）均已接入真实 API。

### 6.3 中优先级

| 功能 | 描述 |
|-----|------|
| 搜索功能 | 全局搜索组件 |
| 博客文章详情 | 文章阅读页 |
| 文档详情页 | 文档阅读页 |
| 移动端适配 | 汉堡菜单、响应式优化 |

### 6.4 低优先级

| 功能 | 描述 |
|-----|------|
| 后台管理 | 内容管理系统 |
| 数据分析 | 访问统计 |
| 邮件通知 | 注册验证、密码重置 |

---

## 7. 数据指标

### 7.1 核心指标

| 指标 | 定义 | 目标 |
|-----|------|-----|
| PV | 页面浏览量 | - |
| UV | 独立访客数 | - |
| 跳出率 | 单页离开比例 | < 40% |
| 平均停留时长 | 用户在站时长 | > 2 分钟 |
| 转化率 | CTA 点击比例 | > 5% |

### 7.2 转化漏斗

```
访问首页 → 产品页 → 下载/购买 → 注册 → 活跃用户
```

---

## 8. 发布计划

### 8.1 阶段规划

| 阶段 | 内容 | 状态 |
|-----|------|-----|
| Phase 1 | 官网前端开发 | ✅ 已完成 |
| Phase 2 | 用户认证系统 | ✅ 已完成 |
| Phase 3 | Dashboard 用户中心 | ✅ 已完成 |
| Phase 4 | 后端 API 对接 | ✅ 已完成 |
| Phase 5 | 内容填充 | ⏳ 待开始 |
| Phase 6 | 上线发布 | ⏳ 待开始 |

### 8.2 发布里程碑

| 里程碑 | 交付物 | 状态 |
|-------|-------|------|
| M1 | 前端页面完成 | ✅ 完成 |
| M2 | 用户认证完成 | ✅ 完成 |
| M3 | Dashboard 完成 | ✅ 完成 |
| M4 | 后端 API Mock | ✅ 完成 |
| M5 | 真实数据对接 | ✅ 完成 |
| M6 | 数据库初始化 | ✅ 完成 |
| M7 | 生产环境部署 | ⏳ 待开始 |

---

## 附录

### A. 路由映射表

| 路由 | 组件 | 状态 |
|-----|------|-----|
| `/` | Home | ✅ 完成 |
| `/moltybox` | MindNode | ✅ 完成 |
| `/skills` | Skills | ✅ 完成 |
| `/hardware` | Hardware | ✅ 完成 |
| `/models` | Models | ✅ 完成 |
| `/partner` | Partner | ✅ 完成 |
| `/referral-program` | ReferralProgram | ✅ 完成 |
| `/enterprise` | Enterprise | ✅ 完成 |
| `/agents` | Agents | ✅ 完成 |
| `/pricing` | Pricing | ✅ 完成 |
| `/documentation` | Documentation | ✅ 完成 |
| `/blog` | Blog | ✅ 完成 |
| `/login` | Login | ✅ 完成 |
| `/register` | Register | ✅ 完成 |
| `/dashboard` | Dashboard | ✅ 完成 |
| `/dashboard/api-keys` | DashboardApiKeys | ✅ 完成 |
| `/dashboard/billing` | DashboardBilling | ✅ 完成 |
| `/dashboard/usage` | DashboardUsage | ✅ 完成 |
| `/dashboard/referrals` | DashboardReferrals | ✅ 完成 |
| `/dashboard/settings` | DashboardSettings | ✅ 完成 |
| `/contact-us` | - | ⏳ 待开发 |
| `/privacy-terms` | - | ⏳ 待开发 |

### B. 开发环境

- 前端开发服务器：`http://localhost:5173/`
- 后端开发服务器：`http://localhost:8000/`
- API 文档：`http://localhost:8000/docs`
- Node 版本：根据项目配置
- 包管理器：npm
- 后端：Python 3.11+ / FastAPI

---

**文档结束**
