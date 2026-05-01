import { ApiProperty } from '@nestjs/swagger';

export class CategoryContentDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class CreateCategoryDto {
  @ApiProperty({ type: [CategoryContentDto] })
  content: CategoryContentDto[];
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiProperty()
  id: string;
}