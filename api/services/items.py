from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status
from models import Item
from schemas.item import ItemListResponse, ItemResponse


async def get_items(session: AsyncSession,q: str | None,categorie: str | None,page: int,limit: int) -> ItemListResponse:
    statement = select(Item)

    if q:
        statement = statement.where(
            Item.titre.ilike(f"%{q}%")
            | Item.description.ilike(f"%{q}%")
        )

    if categorie:
        statement = statement.where(Item.categorie == categorie)

    count_statement = select(func.count()).select_from(
        statement.subquery()
    )

    count_result = await session.exec(count_statement)
    total = count_result.one()

    offset = (page - 1) * limit

    statement = statement.offset(offset).limit(limit)

    result = await session.exec(statement)
    items = result.all()

    return ItemListResponse(
        total=total,
        page=page,
        limit=limit,
        results=[ItemResponse.model_validate(item)for item in items],)


async def get_item_by_id(
    session: AsyncSession,
    item_id: int,
) -> ItemResponse:
    result = await session.exec(
        select(Item).where(Item.id == item_id)
    )
    item = result.first()

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item introuvable",
        )

    return ItemResponse.model_validate(item)