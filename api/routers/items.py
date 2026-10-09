from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from schemas.item import ItemListResponse
from services.items import get_items
from services.items import get_item_by_id
from schemas.item import ItemResponse


router = APIRouter(
    prefix="/items",
    tags=["Items"],
)


@router.get("",response_model=ItemListResponse,summary="Lister les attaques",)
async def list_items(
    q: str | None = Query(default=None),
    categorie: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
    session: AsyncSession = Depends(get_session),
) -> ItemListResponse:
    return await get_items(
        session=session,
        q=q,
        categorie=categorie,
        page=page,
        limit=limit,
    )

@router.get("/{item_id}",response_model=ItemResponse,summary="Détail d'une attaque")
async def read_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ItemResponse:
    return await get_item_by_id(session, item_id)