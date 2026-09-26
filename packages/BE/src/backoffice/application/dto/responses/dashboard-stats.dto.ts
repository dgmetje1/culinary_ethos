import { ApiProperty } from "@nestjs/swagger";

export class DashboardStatsDto {
  @ApiProperty()
  pendingRecipes: number;

  @ApiProperty()
  totalRecipes: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  newUsers: number;
}
