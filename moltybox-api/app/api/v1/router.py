"""
API v1 路由聚合
"""
from fastapi import APIRouter
from app.api.v1 import auth, users, models, skills, agents, hardware
from app.api.v1 import partners, referrals, enterprise, pricing, blog, docs
from app.api.v1 import client, upload, analytics, other, api_keys

api_router = APIRouter()

# 认证
api_router.include_router(auth.router)
api_router.include_router(users.router)

# 内容
api_router.include_router(models.router)
api_router.include_router(skills.router)
api_router.include_router(agents.router)
api_router.include_router(blog.router)
api_router.include_router(docs.router)

# 商务
api_router.include_router(partners.router)
api_router.include_router(referrals.router)
api_router.include_router(enterprise.router)
api_router.include_router(pricing.router)

# 产品
api_router.include_router(hardware.router)
api_router.include_router(client.router)

# 工具
api_router.include_router(upload.router)
api_router.include_router(analytics.router)
api_router.include_router(other.router)
api_router.include_router(api_keys.router)
