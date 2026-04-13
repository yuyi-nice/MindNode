"""
客户端 API 路由
"""
from fastapi import APIRouter, Query
from app.mock.data import db
from app.schemas.pricing import ClientVersionCheckResponse, ClientVersionResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/client", tags=["客户端"])


@router.get("/version", response_model=APIResponse[dict])
async def check_version(
    platform: str = Query(..., description="平台：windows / macos / linux"),
    arch: str = Query(..., description="架构：x64 / arm64"),
    version: str = Query(..., description="当前版本号"),
):
    """检查客户端更新"""
    result = db.get_client_version(platform, arch, version)

    response_data = {
        "has_update": result["has_update"],
        "current": result["current"],
    }

    if result["has_update"] and result.get("latest"):
        latest = result["latest"]
        response_data["latest"] = {
            "version": latest["version"],
            "build_number": latest["build_number"],
            "release_notes": latest["release_notes"],
            "download_url": latest["download_url"],
            "file_size": latest["file_size"],
            "checksum_sha256": latest["checksum_sha256"],
            "required": latest["required"],
        }

    return APIResponse(data=response_data)


@router.get("/version/latest", response_model=APIResponse[dict])
async def get_latest_version(
    platform: str = Query(..., description="平台：windows / macos / linux"),
    arch: str = Query(..., description="架构：x64 / arm64"),
):
    """获取最新版本"""
    versions = [
        v for v in db.client_versions
        if v["platform"] == platform and v["architecture"] == arch and v["is_published"]
    ]

    if not versions:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("未找到该平台的版本")

    latest = max(versions, key=lambda x: x["build_number"])
    return APIResponse(data=latest)


@router.get("/versions", response_model=APIResponse[list])
async def get_version_history(
    platform: str = Query(None, description="平台：windows / macos / linux"),
):
    """获取版本历史"""
    versions = db.client_versions
    if platform:
        versions = [v for v in versions if v["platform"] == platform]

    versions = sorted(versions, key=lambda x: x["build_number"], reverse=True)
    return APIResponse(data=versions)


@router.get("/config", response_model=APIResponse[dict])
async def get_client_config():
    """获取客户端配置"""
    return APIResponse(
        data={
            "api_base_url": "https://api.moltybox.ai/api/v1",
            "cdn_url": "https://cdn.moltybox.ai",
            "features": {
                "enable_analytics": True,
                "enable_auto_update": True,
                "enable_crash_report": True,
            },
            "default_settings": {
                "theme": "light",
                "language": "zh-CN",
                "auto_start": False,
            }
        }
    )


@router.post("/report", response_model=APIResponse)
async def report_usage(
    event_type: str,
    data: dict,
    current_user: dict = None
):
    """上报使用统计"""
    # Mock 实现
    return APIResponse(message="上报成功")
