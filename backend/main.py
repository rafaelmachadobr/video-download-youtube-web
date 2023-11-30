from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api import router as router_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(router_app, prefix="/api")
