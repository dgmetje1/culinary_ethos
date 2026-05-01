import { ApiProperty } from '@nestjs/swagger';

export class KitchenwareContentDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  singularName: string;
}

export class CreateKitchenwareDto {
  @ApiProperty({ type: [KitchenwareContentDto] })
  content: KitchenwareContentDto[];
}

export class UpdateKitchenwareDto extends CreateKitchenwareDto {
  @ApiProperty()
  id: string;
}

export class MergeKitchenwareDto {
  @ApiProperty()
  targetId: string;

  @ApiProperty({ type: [String] })
  kitchenwareIds: string[];
}