import { ApiProperty } from '@nestjs/swagger';

export class IngredientContentDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;
}

export class CreateIngredientDto {
  @ApiProperty({ type: [IngredientContentDto] })
  content: IngredientContentDto[];
}

export class UpdateIngredientDto extends CreateIngredientDto {
  @ApiProperty()
  id: string;
}

export class MergeIngredientDto {
  @ApiProperty()
  targetId: string;

  @ApiProperty({ type: [String] })
  ingredientIds: string[];
}