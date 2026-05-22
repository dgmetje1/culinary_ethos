import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MealPlansService } from '../../application/services';
import { CreateMealPlanDto, UpdateMealPlanDto, MealPlanResponseDto } from '../../application/dto';

@ApiTags('Meal Plans')
@Controller('meal-plans')
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get meal plan by week start date' })
  @ApiQuery({ name: 'weekStart', required: true, type: String })
  @ApiResponse({ status: 200, type: MealPlanResponseDto, nullable: true })
  async getByWeekStart(
    @Query('weekStart') weekStart: string,
  ): Promise<MealPlanResponseDto | null> {
    return this.mealPlansService.getByWeekStart(weekStart);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal plan by ID' })
  @ApiResponse({ status: 200, type: MealPlanResponseDto })
  async getById(@Param('id') id: string): Promise<MealPlanResponseDto> {
    return this.mealPlansService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a meal plan' })
  @ApiResponse({ status: 201, type: MealPlanResponseDto })
  async create(@Body() dto: CreateMealPlanDto): Promise<MealPlanResponseDto> {
    return this.mealPlansService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a meal plan entries' })
  @ApiResponse({ status: 200, type: MealPlanResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMealPlanDto,
  ): Promise<MealPlanResponseDto> {
    return this.mealPlansService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a meal plan' })
  @ApiResponse({ status: 204 })
  async delete(@Param('id') id: string): Promise<void> {
    await this.mealPlansService.delete(id);
  }
}
