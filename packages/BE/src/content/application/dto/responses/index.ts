import { ApiProperty } from '@nestjs/swagger';

export class CategoryContentResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: CategoryContentResponseDto })
  content: Record<string, CategoryContentResponseDto>;
}

export class UnitContentResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  singularName: string;
}

export class UnitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: UnitContentResponseDto })
  content: Record<string, UnitContentResponseDto>;
}

export class IngredientContentResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;
}

export class IngredientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: IngredientContentResponseDto })
  content: Record<string, IngredientContentResponseDto>;
}

export class KitchenwareContentResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;
}

export class KitchenwareResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: KitchenwareContentResponseDto })
  content: Record<string, KitchenwareContentResponseDto>;
}

export class RecipeCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class RecipeListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: RecipeCategoryResponseDto, isArray: true })
  categories: RecipeCategoryResponseDto[];

  @ApiProperty()
  time: number;

  @ApiProperty()
  author: string;

  @ApiProperty({ nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty()
  portions: number;

  @ApiProperty({ nullable: true })
  savedAt?: Date;
}

export class RecipeIngredientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  optional: boolean;

  @ApiProperty({ nullable: true })
  unit: { id: string; name: string; shortName: string } | null;
}

export class RecipeKitchenwareResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;

  @ApiProperty()
  quantity: number;
}

export class RecipeStepResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  number: number;

  @ApiProperty({ nullable: true })
  imageUrl?: string;
}

export class RecipeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty({ nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty({ nullable: true })
  headerImg: string | null;

  @ApiProperty()
  difficulty: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  portions: number;

  @ApiProperty()
  visibility: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  publicationDate: Date;

  @ApiProperty({ type: RecipeCategoryResponseDto, isArray: true })
  categories: RecipeCategoryResponseDto[];

  @ApiProperty({ type: RecipeIngredientResponseDto, isArray: true })
  ingredients: RecipeIngredientResponseDto[];
  @ApiProperty({ type: RecipeKitchenwareResponseDto, isArray: true })
  kitchenware: RecipeKitchenwareResponseDto[];

  @ApiProperty({ type: RecipeStepResponseDto, isArray: true })
  steps: RecipeStepResponseDto[];

  @ApiProperty({ default: 'published' })
  status?: string;

  @ApiProperty({ nullable: true })
  reviewedBy?: string | null;

  @ApiProperty({ nullable: true })
  reviewedAt?: Date | null;
}

export class MealPlanEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  day: number;

  @ApiProperty()
  mealType: string;

  @ApiProperty()
  recipeId: string;

  @ApiProperty()
  recipeTitle: string;

  @ApiProperty({ nullable: true })
  recipeImageUrl?: string;

  @ApiProperty({ nullable: true })
  portions?: number;
}

export class MealPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  weekStart: string;

  @ApiProperty({ type: [MealPlanEntryResponseDto] })
  entries: MealPlanEntryResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RecipeDailyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty()
  time: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  publicationDate: Date;

  @ApiProperty()
  difficulty: number;

  @ApiProperty()
  portions: number;

  @ApiProperty({ type: RecipeCategoryResponseDto, isArray: true })
  categories: RecipeCategoryResponseDto[];

  @ApiProperty({ type: RecipeIngredientResponseDto, isArray: true })
  ingredients: RecipeIngredientResponseDto[];
}
