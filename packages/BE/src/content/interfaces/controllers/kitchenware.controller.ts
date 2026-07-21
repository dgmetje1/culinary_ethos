import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KitchenwareService } from '../../application/services';
import { CreateKitchenwareDto, UpdateKitchenwareDto, MergeKitchenwareDto, KitchenwareResponseDto } from '../../application/dto';

@ApiBearerAuth()
@ApiTags('Kitchenware')
@Controller('kitchenware')
export class KitchenwareController {
  constructor(private readonly kitchenwareService: KitchenwareService) {}

  @Get()
  @ApiOperation({ summary: 'Get all kitchenware' })
  @ApiResponse({ status: 200, type: [KitchenwareResponseDto] })
  async getAll(): Promise<KitchenwareResponseDto[]> {
    return this.kitchenwareService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create kitchenware' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateKitchenwareDto): Promise<{ id: string }> {
    return this.kitchenwareService.create(dto);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update kitchenware' })
  @ApiResponse({ status: 204 })
  async update(@Body() dto: UpdateKitchenwareDto): Promise<void> {
    await this.kitchenwareService.update(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete kitchenware' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.kitchenwareService.delete(id);
  }

  @Post('merge')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Merge kitchenware' })
  @ApiResponse({ status: 204 })
  async merge(@Body() dto: MergeKitchenwareDto): Promise<void> {
    await this.kitchenwareService.merge(dto);
  }
}