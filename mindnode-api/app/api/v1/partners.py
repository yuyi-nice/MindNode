"""
合伙人 API 路由
"""
from fastapi import APIRouter, Depends
from app.mock.data import db
from app.schemas.partner import PartnerApplicationCreate, PartnerApplicationResponse, ReferralStats
from app.schemas.response import APIResponse
from app.api.deps import get_current_user_required

router = APIRouter(prefix="/partners", tags=["合伙人"])


@router.post("/apply", response_model=APIResponse[dict])
async def apply_partner(application_data: PartnerApplicationCreate):
    """提交合伙人申请"""
    application = db.create_partner_application(application_data.model_dump())

    return APIResponse(
        data={
            "application_no": application["application_no"],
            "status": application["status"],
            "message": "申请已提交，我们将在 3 个工作日内审核",
        }
    )


@router.get("/benefits", response_model=APIResponse[dict])
async def get_partner_benefits():
    """获取合伙人收益说明"""
    return APIResponse(
        data={
            "channel_partner": {
                "title": "渠道收益伙伴",
                "benefits": [
                    {"name": "销售差价", "description": "产品售价与伙伴价之间的差价收益"},
                    {"name": "业绩返点", "description": "季度销售额 5%-15% 返点"},
                    {"name": "区域保护", "description": " exclusive 区域销售保护"},
                    {"name": "培训支持", "description": "产品培训和销售支持"},
                ]
            },
            "ecosystem_partner": {
                "title": "生态共建伙伴",
                "benefits": [
                    {"name": "技术支持", "description": "专属技术支持和开发资源"},
                    {"name": "联合营销", "description": "联合市场推广活动"},
                    {"name": "收入分成", "description": "解决方案收入分成"},
                    {"name": "优先合作", "description": "新项目优先合作机会"},
                ]
            }
        }
    )


@router.get("/process", response_model=APIResponse[dict])
async def get_partner_process():
    """获取合作流程"""
    return APIResponse(
        data={
            "steps": [
                {"step": 1, "title": "提交申请", "description": "填写合伙人申请表"},
                {"step": 2, "title": "资质审核", "description": "我们的团队审核您的资质"},
                {"step": 3, "title": "签约合作", "description": "签订正式合作协议"},
                {"step": 4, "title": "培训认证", "description": "参加产品培训和认证"},
                {"step": 5, "title": "开展业务", "description": "正式开展销售和合作"},
            ]
        }
    )


@router.get("/faq", response_model=APIResponse[list])
async def get_partner_faq():
    """获取常见问题"""
    return APIResponse(
        data=[
            {"question": "成为合伙人需要什么条件？", "answer": "我们寻找有 AI 相关产品销售经验或技术集成能力的合作伙伴..."},
            {"question": "合伙人的收益如何计算？", "answer": "渠道伙伴可获得销售差价和季度返点，生态伙伴可获得项目分成..."},
            {"question": "有区域保护吗？", "answer": "是的，对于核心渠道伙伴，我们提供区域独家销售保护..."},
        ]
    )


@router.get("/applications", response_model=APIResponse[list])
async def get_all_applications(current_user: dict = Depends(get_current_user_required)):
    """获取所有合伙人申请（管理员）"""
    if not current_user.get("is_superuser"):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException("无权限访问")

    applications = db.get_all_partner_applications()
    return APIResponse(data=applications)
