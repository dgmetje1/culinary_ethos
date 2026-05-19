import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class KitchenwareContentDto {
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

export class CreateKitchenwareDto {
  @ApiProperty({ type: [KitchenwareContentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KitchenwareContentDto)
  content!: KitchenwareContentDto[];
}

export class UpdateKitchenwareDto extends CreateKitchenwareDto {
  @ApiProperty()
  id!: string;
}

export class MergeKitchenwareDto {
  @ApiProperty()
  targetId!: string;

  @ApiProperty({ type: [String] })
  kitchenwareIds!: string[];
}
