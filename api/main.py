from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel

from db.database import engine
from models import CollectionEntry, Item, User


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)

    yield


app = FastAPI(
    title="Ma Collection API",
    lifespan=lifespan,
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Bienvenue sur notre collection d'attaque cybersécurité !!"}