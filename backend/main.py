from fastapi import FastAPI

from app.api import router as router_app

app = FastAPI()

app.include_router(router_app, prefix="/api")
