"""
企业版 API 路由
"""
from fastapi import APIRouter
from app.mock.data import db
from app.schemas.partner import EnterpriseInquiryCreate, EnterpriseCaseResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/enterprise", tags=["企业版"])


@router.post("/inquire", response_model=APIResponse[dict])
async def submit_inquiry(inquiry_data: EnterpriseInquiryCreate):
    """提交企业咨询"""
    inquiry = db.create_enterprise_inquiry(inquiry_data.model_dump())

    return APIResponse(
        data={
            "inquiry_no": inquiry["inquiry_no"],
            "status": inquiry["status"],
            "message": "咨询已提交，我们的销售团队将在 24 小时内联系您",
        }
    )


@router.get("/cases", response_model=APIResponse[list[EnterpriseCaseResponse]])
async def get_enterprise_cases():
    """获取客户案例列表"""
    cases = db.get_all_cases(is_featured=True)
    return APIResponse(
        data=[EnterpriseCaseResponse(**c) for c in cases],
    )


@router.get("/cases/{slug}", response_model=APIResponse[dict])
async def get_enterprise_case(slug: str):
    """获取客户案例详情"""
    case = db.get_case_by_slug(slug)
    if not case:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("案例不存在")

    return APIResponse(data=case)


@router.get("/inquiries", response_model=APIResponse[list])
async def get_all_inquiries():
    """获取所有企业咨询（管理员）"""
    inquiries = db.get_all_enterprise_inquiries()
    return APIResponse(data=inquiries)
