import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class IngredientContentDto {
  @ApiProperty()
  @IsString()
  language!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  singularName!: string;
}

export class CreateIngredientDto {
  @ApiProperty({ type: [IngredientContentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientContentDto)
  content!: IngredientContentDto[];
}

export class UpdateIngredientDto extends CreateIngredientDto {
  @ApiProperty()
  id!: string;
}

export class MergeIngredientDto {
  @ApiProperty()
  targetId!: string;

  @ApiProperty({ type: [String] })
  ingredientIds!: string[];
}
