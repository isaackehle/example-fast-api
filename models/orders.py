from typing import Optional

from pydantic import BaseModel


class Order(BaseModel):
    id: int
    name: str
    description: str
    cost: float
    reason_for_purchase: str


# Partial update model
class NewOrder(Order):
    id: Optional[int] = 0
