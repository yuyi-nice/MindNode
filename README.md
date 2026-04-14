# MindNode

面向 AI 智能体的云平台和硬件一体化解决方案。

## 项目结构

```
MindNode/
├── mindnode-app/           # 前端项目 (React + Vite + Tailwind CSS)
├── mindnode-api/           # 后端项目 (FastAPI + Python)
├── PRD.md                  # 产品需求文档
├── PRD-BACKEND.md          # 后端详细设计文档
└── images/                 # 静态资源
```

## 功能模块

### 前端 (mindnode-app)

| 页面 | 路由 | 描述 |
|------|------|------|
| 首页 | `/` | 产品展示页 |
| MindNode | `/moltybox` | 产品下载页 |
| 技能库 | `/skills` | AI 技能市场 |
| 盒子 | `/hardware` | 硬件产品介绍 |
| 模型 | `/models` | 支持的 AI 模型列表 |
| 合伙人 | `/partner` | 合作伙伴计划 |
| 企业版 | `/enterprise` | 企业解决方案 |
| 控制台 | `/dashboard` | 用户管理中心 |

### 后端 (mindnode-api)

- FastAPI 框架
- PostgreSQL 数据库
- JWT 认证
- RESTful API

## 快速开始

### 前端

```bash
cd mindnode-app
npm install
npm run dev
```

### 后端

```bash
cd mindnode-api
pip install -r requirements.txt
# 配置 .env 文件（参考 .env.example）
python -m app.main
```

## 技术栈

| 前端 | 后端 |
|------|------|
| React 18 | FastAPI |
| Vite 8 | Python 3.x |
| Tailwind CSS 3 | PostgreSQL |
| React Router 7 | JWT Auth |

## 核心价值

- **开箱即用**：软硬件一体化，无需复杂配置
- **私有安全**：数据本地存储，隐私保护
- **全能助手**：支持主流大模型（Claude、GPT-4o、DeepSeek 等）
- **远程协同**：通过 WhatsApp/钉钉/飞书/企业微信控制

## 许可证

MIT License

## 作者

[yuyi-nice](https://github.com/yuyi-nice)