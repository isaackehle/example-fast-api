from models.orders import NewOrder, Order
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)

orders: list[Order] = []

last_order_id = 0


@router.get("/")
def read_items():
    return orders


@router.get("/{item_id}")
def read_item(item_id: int):
    global orders

    try:
        order = orders[item_id]
        return {"order": order}

    except IndexError as e:
        return {"success": "false"}

    except TypeError as e:
        return {"success": "false"}


@router.post("/")
def create_item(new_order: NewOrder):
    global last_order_id, orders
    order: Order = Order(**new_order.dict())
    order.id = last_order_id
    last_order_id = last_order_id + 1
    orders.append(order)
    return {"id": order.id}