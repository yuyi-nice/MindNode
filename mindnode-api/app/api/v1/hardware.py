"""
硬件产品 API 路由
"""
from fastapi import APIRouter
from app.mock.data import db
from app.schemas.hardware import HardwareProductResponse, HardwareOrderCreate, HardwareOrderResponse
from app.schemas.response import APIResponse

router = APIRouter(prefix="/hardware", tags=["硬件产品"])


@router.get("", response_model=APIResponse[list[HardwareProductResponse]])
async def get_hardware():
    """获取硬件产品列表"""
    products = db.get_all_hardware(is_available=True)
    return APIResponse(
        data=[HardwareProductResponse(**p) for p in products],
    )


@router.get("/{slug}", response_model=APIResponse[HardwareProductResponse])
async def get_hardware_detail(slug: str):
    """获取硬件产品详情"""
    product = db.get_hardware_by_slug(slug)
    if not product:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("产品不存在")

    return APIResponse(data=HardwareProductResponse(**product))


@router.post("/orders", response_model=APIResponse[dict])
async def create_order(order_data: HardwareOrderCreate):
    """创建硬件订单"""
    # 获取产品信息
    product = db.get_hardware_by_slug(str(order_data.product_id))
    if not product:
        product = db.get_all_hardware()[0]  # Mock: 获取第一个产品

    # 计算金额
    quantity = order_data.quantity
    unit_price = product["price"]
    subtotal = unit_price * quantity
    shipping_fee = 0
    discount = 0
    total_amount = subtotal - discount + shipping_fee

    # 创建订单
    order = db.create_order({
        "product_id": product["id"],
        "product_name": product["name"],
        "quantity": quantity,
        "unit_price": unit_price,
        "email": order_data.customer_email,
        "phone": order_data.customer_phone,
        "name": order_data.customer_name,
        "province": order_data.province,
        "city": order_data.city,
        "district": order_data.district,
        "address": order_data.address,
        "postal_code": order_data.postal_code,
        "subtotal": subtotal,
        "shipping_fee": shipping_fee,
        "discount": discount,
        "total_amount": total_amount,
        "status": "pending_payment",
        "payment_status": "unpaid",
    })

    return APIResponse(
        data={
            "order_no": order["order_no"],
            "total_amount": order["total_amount"],
            "status": order["status"],
            "payment_url": "https://pay.example.com/mock",
            "expires_at": "2026-03-30T12:30:00Z",
        }
    )


@router.get("/orders/{order_no}", response_model=APIResponse[dict])
async def get_order(order_no: str):
    """获取订单详情"""
    order = db.get_order_by_no(order_no)
    if not order:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("订单不存在")

    return APIResponse(data=order)
