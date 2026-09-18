from sqlmodel import Field, SQLModel


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titre: str
    categorie: str
    description: str
    image_url: str
    annee: int
    type: str
    niveau: str