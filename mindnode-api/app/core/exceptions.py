"""
自定义异常处理
"""
from fastapi import HTTPException, status
from typing import Any, Optional


class APIException(HTTPException):
    """API 基础异常"""

    def __init__(
        self,
        status_code: int = 500,
        message: str = "Internal Server Error",
        code: int = 500,
        data: Optional[Any] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "code": code,
                "message": message,
                "data": data
            }
        )


class BadRequestException(APIException):
    """400 错误 - 请求参数错误"""

    def __init__(self, message: str = "Bad Request", data: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            code=400,
            data=data
        )


class UnauthorizedException(APIException):
    """401 错误 - 未认证"""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            code=401
        )


class ForbiddenException(APIException):
    """403 错误 - 无权限"""

    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            code=403
        )


class NotFoundException(APIException):
    """404 错误 - 资源不存在"""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            code=404
        )


class ConflictException(APIException):
    """409 错误 - 资源冲突"""

    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            message=message,
            code=409
        )
