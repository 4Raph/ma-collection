from routers.auth import router as auth_router
from routers.collection import router as collection_router
from routers.items import router as items_router

__all__ = [
    "auth_router",
    "collection_router",
    "items_router",
]