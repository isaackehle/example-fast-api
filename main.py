import uvicorn
from fastapi import FastAPI
from routers.orders import router

app = FastAPI()


app.include_router(router)


@app.get("/api")
async def read_root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
