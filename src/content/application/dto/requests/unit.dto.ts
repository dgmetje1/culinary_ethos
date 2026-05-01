import { ApiProperty } from '@nestjs/swagger';

export class UnitContentDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  shortName: string;

  @ApiProperty()
  singularName: string;
}

export class CreateUnitDto {
  @ApiProperty()
  isVisible: boolean;

  @ApiProperty({ type: [UnitContentDto] })
  content: UnitContentDto[];
}

export class UpdateUnitDto extends CreateUnitDto {
  @ApiProperty()
  id: string;
}