export interface RecipePublication {
  language: string;
  title: string;
  description: string;
}

export interface RecipeStep {
  number: number;
  content: {
    language: string;
    title: string;
    body: string;
  }[];
  imageUrl?: string;
}

export interface RecipeIngredient {
  id: string;
  unitId: string | null;
  quantity: number;
  isOptional: boolean;
}

export interface RecipeKitchenware {
  id: string;
  quantity: number;
}

export interface RecipeAttributes {
  id: string;
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  uniqueId: string;
  thumbnailUrl: string | null;
  headerImg: string | null;
  publicationDate: Date;
  publications: RecipePublication[];
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  categoryIds: string[];
  status: string;
  reviewedBy: string | null;
  reviewedAt: Date | null;
}

export interface CreateRecipeInput {
  difficulty: number;
  time: number;
  portions: number;
  visibility: number;
  author: string;
  publications: RecipePublication[];
  categoryIds: string[];
  ingredients: RecipeIngredient[];
  kitchenware: RecipeKitchenware[];
  steps: RecipeStep[];
  thumbnailUrl?: string;
  headerImg?: string;
  status?: string;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
}
