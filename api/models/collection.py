from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base


class CollectionEntry(Base):
    __tablename__ = "collectionentry"

    __table_args__ = (
        UniqueConstraint("user_id", "item_id"),
        CheckConstraint(
            "note IS NULL OR (note >= 1 AND note <= 5)",
            name="ck_collectionentry_note",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"),
        nullable=False,
    )

    item_id: Mapped[int] = mapped_column(
        ForeignKey("item.id"),
        nullable=False,
    )

    statut: Mapped[str] = mapped_column(
        String,
        default="a_decouvrir",
        nullable=False,
    )

    note: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    commentaire: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    date_ajout: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )