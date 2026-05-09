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
