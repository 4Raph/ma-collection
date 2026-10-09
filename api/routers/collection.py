from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from dependencies.auth import get_current_user
from models import User
from schemas.collection import (
    CollectionCreate,
    CollectionEntryResponse,
    CollectionStats,
    CollectionUpdate,
)
from services.collection import (
    add_to_collection,
    delete_collection_entry,
    get_collection_stats,
    list_collection,
    update_collection_entry,
)


router = APIRouter(tags=["Collection personnelle"])


@router.get(
    "/me/collection",
    response_model=list[CollectionEntryResponse],
    summary="Afficher ma collection",
)
async def read_collection(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
    statut: str | None = Query(default=None),
    tri: Literal["date", "note"] = Query(default="date"),
) -> list[CollectionEntryResponse]:
    return await list_collection(session, user, statut, tri)


@router.post(
    "/me/collection",
    response_model=CollectionEntryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter une attaque à ma collection",
)
async def create_collection_entry(
    data: CollectionCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> CollectionEntryResponse:
    return await add_to_collection(session, user, data)


@router.patch(
    "/me/collection/{entry_id}",
    response_model=CollectionEntryResponse,
    summary="Modifier une entrée de ma collection",
)
async def edit_collection_entry(
    entry_id: int,
    data: CollectionUpdate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> CollectionEntryResponse:
    return await update_collection_entry(
        session,
        user,
        entry_id,
        data,
    )


@router.delete(
    "/me/collection/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une entrée de ma collection",
)
async def remove_collection_entry(
    entry_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Response:
    await delete_collection_entry(session, user, entry_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/me/stats",
    response_model=CollectionStats,
    summary="Afficher les statistiques de ma collection",
)
async def read_collection_stats(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> CollectionStats:
    return await get_collection_stats(session, user)