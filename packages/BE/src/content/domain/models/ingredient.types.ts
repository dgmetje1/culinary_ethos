export interface IngredientContent {
  language: string;
  name: string;
  singularName: string;
}

export interface IngredientAttributes {
  id: string;
  content: IngredientContent[];
}
