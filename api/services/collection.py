from datetime import datetime, timezone
from typing import Literal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from models import CollectionEntry, Item, User
from schemas.collection import (
    CollectionCreate,
    CollectionEntryResponse,
    CollectionStats,
    CollectionUpdate,
)
from schemas.item import ItemResponse


def build_item_response(item: Item) -> ItemResponse:
    """Construit une réponse à partir d'un item déjà chargé."""
    return ItemResponse(
        id=item.id,
        titre=item.titre,
        categorie=item.categorie,
        description=item.description,
        image_url=item.image_url,
        annee=item.annee,
        type=item.type,
        niveau=item.niveau,
    )


async def list_collection(
    session: AsyncSession,
    user: User,
    statut: str | None = None,
    tri: Literal["date", "note"] = "date",
) -> list[CollectionEntryResponse]:
    statement = select(CollectionEntry).where(
        CollectionEntry.user_id == user.id
    )

    if statut:
        statement = statement.where(CollectionEntry.statut == statut)

    if tri == "note":
        statement = statement.order_by(CollectionEntry.note.desc())
    else:
        statement = statement.order_by(CollectionEntry.date_ajout.desc())

    result = await session.execute(statement)
    entries = result.scalars().all()

    responses: list[CollectionEntryResponse] = []

    for entry in entries:
        item_result = await session.execute(
            select(Item).where(Item.id == entry.item_id)
        )
        item = item_result.scalar_one_or_none()

        if item is not None:
            responses.append(
                CollectionEntryResponse(
                    id=entry.id,
                    item=build_item_response(item),
                    statut=entry.statut,
                    note=entry.note,
                    commentaire=entry.commentaire,
                    date_ajout=entry.date_ajout,
                )
            )

    return responses


async def add_to_collection(
    session: AsyncSession,
    user: User,
    data: CollectionCreate,
) -> CollectionEntryResponse:
    item_result = await session.execute(
        select(Item).where(Item.id == data.item_id)
    )
    item = item_result.scalar_one_or_none()

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item introuvable",
        )

    item_response = build_item_response(item)

    existing = await session.execute(
        select(CollectionEntry).where(
            CollectionEntry.user_id == user.id,
            CollectionEntry.item_id == data.item_id,
        )
    )

    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette attaque est déjà dans votre collection",
        )

    entry = CollectionEntry(
        user_id=user.id,
        item_id=data.item_id,
        statut=data.statut,
        note=data.note,
        commentaire=data.commentaire,
        date_ajout=datetime.now(timezone.utc),
    )

    session.add(entry)

    try:
        await session.flush()

        response = CollectionEntryResponse(
            id=entry.id,
            item=item_response,
            statut=entry.statut,
            note=entry.note,
            commentaire=entry.commentaire,
            date_ajout=entry.date_ajout,
        )

        await session.commit()
        return response

    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette attaque est déjà dans votre collection",
        )


async def update_collection_entry(
    session: AsyncSession,
    user: User,
    entry_id: int,
    data: CollectionUpdate,
) -> CollectionEntryResponse:
    result = await session.execute(
        select(CollectionEntry).where(
            CollectionEntry.id == entry_id,
            CollectionEntry.user_id == user.id,
        )
    )
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrée introuvable",
        )

    changes = data.model_dump(exclude_unset=True)

    for field, value in changes.items():
        setattr(entry, field, value)

    await session.commit()
    await session.refresh(entry)

    item_result = await session.execute(
        select(Item).where(Item.id == entry.item_id)
    )
    item = item_result.scalar_one_or_none()

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item introuvable",
        )

    return CollectionEntryResponse(
        id=entry.id,
        item=build_item_response(item),
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
    )


async def delete_collection_entry(
    session: AsyncSession,
    user: User,
    entry_id: int,
) -> None:
    result = await session.execute(
        select(CollectionEntry).where(
            CollectionEntry.id == entry_id,
            CollectionEntry.user_id == user.id,
        )
    )
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entrée introuvable",
        )

    await session.delete(entry)
    await session.commit()


async def get_collection_stats(
    session: AsyncSession,
    user: User,
) -> CollectionStats:
    total_result = await session.execute(
        select(func.count())
        .select_from(CollectionEntry)
        .where(CollectionEntry.user_id == user.id)
    )
    total = total_result.scalar_one()

    counts: dict[str, int] = {
        "a_decouvrir": 0,
        "en_cours": 0,
        "termine": 0,
    }

    status_result = await session.execute(
        select(
            CollectionEntry.statut,
            func.count(CollectionEntry.id),
        )
        .where(CollectionEntry.user_id == user.id)
        .group_by(CollectionEntry.statut)
    )

    for statut, count in status_result.all():
        counts[statut] = count

    average_result = await session.execute(
        select(func.avg(CollectionEntry.note)).where(
            CollectionEntry.user_id == user.id,
            CollectionEntry.note.is_not(None),
        )
    )
    average = average_result.scalar_one()

    return CollectionStats(
        total=total,
        par_statut=counts,
        note_moyenne=(
            round(float(average), 2)
            if average is not None
            else None
        ),
    )