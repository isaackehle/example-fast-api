from pydantic import BaseModel


class Order(BaseModel):
    id: int
    name: str
    description: str
    cost: float
    reason_for_purchase: str


# Partial update model for creating orders (id will be auto-generated)
class NewOrder(BaseModel):
    name: str
    description: str
    cost: float
    reason_for_purchase: str
