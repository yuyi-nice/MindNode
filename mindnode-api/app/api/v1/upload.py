"""
上传 API 路由
"""
from fastapi import APIRouter, UploadFile, File, Depends
from app.core.exceptions import BadRequestException
from app.api.deps import get_current_user_required
from app.schemas.response import APIResponse
import uuid
import os

router = APIRouter(prefix="/upload", tags=["上传"])


@router.post("/image", response_model=APIResponse[dict])
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user_required)
):
    """上传图片"""
    # 验证文件类型
    allowed_types = ["image/jpeg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        raise BadRequestException("只支持 JPG、PNG、GIF 格式图片")

    # 验证文件大小 (5MB)
    file_size = len(file.file.read())
    if file_size > 5 * 1024 * 1024:
        raise BadRequestException("文件大小不能超过 5MB")

    # 生成文件名
    file_id = str(uuid.uuid4())
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{file_id}.{ext}"

    # Mock 上传成功响应
    return APIResponse(
        data={
            "url": f"https://cdn.moltybox.ai/images/{filename}",
            "filename": filename,
            "size": file_size,
            "type": file.content_type,
        }
    )


@router.post("/file", response_model=APIResponse[dict])
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user_required)
):
    """上传文件"""
    # 验证文件大小 (10MB)
    file_size = len(file.file.read())
    if file_size > 10 * 1024 * 1024:
        raise BadRequestException("文件大小不能超过 10MB")

    # 生成文件名
    file_id = str(uuid.uuid4())
    filename = f"{file_id}-{file.filename}"

    return APIResponse(
        data={
            "url": f"https://cdn.moltybox.ai/files/{filename}",
            "filename": file.filename,
            "size": file_size,
        }
    )


@router.post("/multipart", response_model=APIResponse[dict])
async def upload_multipart(
    file: UploadFile = File(...),
    chunk_index: int = 0,
    total_chunks: int = 1,
    file_id: str = None,
    current_user: dict = Depends(get_current_user_required)
):
    """分片上传"""
    # Mock 分片上传
    if not file_id:
        file_id = str(uuid.uuid4())

    return APIResponse(
        data={
            "file_id": file_id,
            "chunk_index": chunk_index,
            "total_chunks": total_chunks,
            "uploaded": True,
            "complete": chunk_index == total_chunks - 1,
        }
    )


@router.delete("/{file_id}", response_model=APIResponse)
async def delete_file(
    file_id: str,
    current_user: dict = Depends(get_current_user_required)
):
    """删除文件"""
    # Mock 删除
    return APIResponse(message="文件已删除")
