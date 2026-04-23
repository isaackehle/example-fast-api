import uvicorn
from fastapi import APIRouter, FastAPI
from routers.orders import orderRouter

app = FastAPI()
router = APIRouter()


app.include_router(orderRouter)
app.include_router(router)


@router.get("/")
async def read_root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
