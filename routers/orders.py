from models.orders import NewOrder, Order
from fastapi import APIRouter

orderRouter = APIRouter(
    prefix="/orders",
    tags=["orders"],
    dependencies=[],
    responses={404: {"description": "Not found"}},
)

orders: Order[list] = []
last_order_id = 0


@orderRouter.get("/")
def read_items():
    return orders


@orderRouter.get("/{item_id}")
def read_item(item_id: int):
    global orders

    try:
        order = orders[item_id]
        return {"order": order}

    except IndexError as e:
        return {"success": "false"}

    except TypeError as e:
        return {"success": "false"}


@orderRouter.post("/")
def create_item(new_order: NewOrder):
    global last_order_id, orders
    order: Order = Order(**new_order.dict())
    order.id = last_order_id
    last_order_id = last_order_id + 1
    orders.append(order)
    return {"id": order.id}
