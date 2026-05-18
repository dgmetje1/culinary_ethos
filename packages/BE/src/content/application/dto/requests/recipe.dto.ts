import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsOptional, IsNumber, ValidateNested, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipePublicationDto {
  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class RecipeStepContentDto {
  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;
}

export class RecipeStepDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({ type: [RecipeStepContentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepContentDto)
  content: RecipeStepContentDto[];
}

export class RecipeIngredientDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  unitId: string | null;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty()
  @IsBoolean()
  isOptional: boolean;
}

export class RecipeKitchenwareDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  time: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  portions: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(2)
  visibility: number;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty({ type: [RecipePublicationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipePublicationDto)
  publications: RecipePublicationDto[];

  @ApiProperty({ type: [String], nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ type: [RecipeIngredientDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients?: RecipeIngredientDto[];

  @ApiProperty({ type: [RecipeKitchenwareDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeKitchenwareDto)
  kitchenware?: RecipeKitchenwareDto[];

  @ApiProperty({ type: [RecipeStepDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  steps?: RecipeStepDto[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  headerImg?: string;
}