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
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IngredientsService } from '../../application/services';
import { CreateIngredientDto, UpdateIngredientDto, MergeIngredientDto, IngredientResponseDto } from '../../application/dto';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({ status: 200, type: [IngredientResponseDto] })
  async getAll(): Promise<IngredientResponseDto[]> {
    return this.ingredientsService.getAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an ingredient' })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateIngredientDto): Promise<{ id: string }> {
    return this.ingredientsService.create(dto);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update an ingredient' })
  @ApiResponse({ status: 204 })
  async update(@Body() dto: UpdateIngredientDto): Promise<void> {
    await this.ingredientsService.update(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an ingredient' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.ingredientsService.delete(id);
  }

  @Post('merge')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Merge ingredients' })
  @ApiResponse({ status: 204 })
  async merge(@Body() dto: MergeIngredientDto): Promise<void> {
    await this.ingredientsService.merge(dto);
  }
}