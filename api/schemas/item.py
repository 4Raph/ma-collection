from pydantic import BaseModel, ConfigDict


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titre: str
    categorie: str
    description: str
    image_url: str
    annee: int
    type: str
    niveau: str


class ItemListResponse(BaseModel):
    total: int
    page: int
    limit: int
    results: list[ItemResponse]