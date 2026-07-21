import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { BackofficeService } from '../../application/services/backoffice.service';
import { DashboardStatsDto } from '../../application/dto/responses/dashboard-stats.dto';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles('admin')
@ApiTags('Backoffice')
@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get dashboard statistics for backoffice' })
  @ApiResponse({ status: 200, type: DashboardStatsDto })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.backofficeService.getDashboardStats();
  }
}
