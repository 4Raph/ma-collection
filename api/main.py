from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.base import Base
from db.database import engine
from models import CollectionEntry, Item, User
from routers import auth_router, collection_router, items_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Importer les modèles permet d'enregistrer leurs tables dans Base.metadata.
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    yield

    await engine.dispose()


app = FastAPI(
    title="Ma Collection API",
    description="Catalogue et gestion personnelle d'attaques informatiques.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(items_router)
app.include_router(collection_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": (
            "Bienvenue sur notre site de collection d'attaque cybersécurité !!"
        )
    }