export interface Attack {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  image_url: string;
  annee: number;
  type: string;
  niveau: string;
}

export interface ItemResponse {
  total: number;
  page: number;
  limit: number;
  results: Attack[];
}