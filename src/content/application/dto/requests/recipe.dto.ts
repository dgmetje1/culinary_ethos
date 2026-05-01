import { ApiProperty } from '@nestjs/swagger';

export class RecipePublicationDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}

export class RecipeStepContentDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}

export class RecipeStepDto {
  @ApiProperty()
  number: number;

  @ApiProperty({ type: [RecipeStepContentDto] })
  content: RecipeStepContentDto[];
}

export class RecipeIngredientDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  unitId: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  isOptional: boolean;
}

export class RecipeKitchenwareDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;
}

export class CreateRecipeDto {
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

  @ApiProperty({ type: [RecipePublicationDto] })
  publications: RecipePublicationDto[];

  @ApiProperty({ type: [String], nullable: true })
  categories?: string[];

  @ApiProperty({ type: [RecipeIngredientDto], nullable: true })
  ingredients?: RecipeIngredientDto[];

  @ApiProperty({ type: [RecipeKitchenwareDto], nullable: true })
  kitchenware?: RecipeKitchenwareDto[];

  @ApiProperty({ type: [RecipeStepDto], nullable: true })
  steps?: RecipeStepDto[];
}