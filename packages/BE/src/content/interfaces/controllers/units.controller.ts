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
import { UnitsService } from '../../application/services';
import { CreateUnitDto, UpdateUnitDto, UnitResponseDto } from '../../application/dto';

@ApiBearerAuth()
@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({ status: 200, type: [UnitResponseDto] })
  async getAll(): Promise<UnitResponseDto[]> {
    return this.unitsService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a unit' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateUnitDto): Promise<void> {
    await this.unitsService.create(dto);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a unit' })
  @ApiResponse({ status: 204 })
  async update(@Body() dto: UpdateUnitDto): Promise<void> {
    await this.unitsService.update(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a unit' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.unitsService.delete(id);
  }
}