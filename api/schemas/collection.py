from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from schemas.item import ItemResponse


Statut = Literal["a_decouvrir", "en_cours", "termine"]


class CollectionCreate(BaseModel):
    item_id: int
    statut: Statut = "a_decouvrir"
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = Field(default=None, max_length=1000)


class CollectionUpdate(BaseModel):
    statut: Statut | None = None
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = Field(default=None, max_length=1000)


class CollectionEntryResponse(BaseModel):
    id: int
    item: ItemResponse
    statut: Statut
    note: int | None
    commentaire: str | None
    date_ajout: datetime


class CollectionStats(BaseModel):
    total: int
    par_statut: dict[str, int]
    note_moyenne: float | None