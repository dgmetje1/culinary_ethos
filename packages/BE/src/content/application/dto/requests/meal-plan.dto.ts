import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray, IsOptional, IsNumber, ValidateNested, Min } from "class-validator";
import { Type } from "class-transformer";

export class MealPlanEntryDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  day: number;

  @ApiProperty()
  @IsString()
  mealType: string;

  @ApiProperty()
  @IsString()
  recipeId: string;

  @ApiProperty()
  @IsString()
  recipeTitle: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  recipeImageUrl?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  portions?: number;
}

export class CreateMealPlanDto {
  @ApiProperty()
  @IsString()
  weekStart: string;

  @ApiProperty({ type: [MealPlanEntryDto], nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealPlanEntryDto)
  entries?: MealPlanEntryDto[];
}

export class UpdateMealPlanDto {
  @ApiProperty({ type: [MealPlanEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealPlanEntryDto)
  entries: MealPlanEntryDto[];
}
