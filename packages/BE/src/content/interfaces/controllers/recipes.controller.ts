import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from '../../application/services';
import {
  CreateRecipeDto,
  RecipeResponseDto,
  RecipeListItemResponseDto,
  RecipeDailyResponseDto,
  RecipeIngredientDto,
  RecipeKitchenwareDto,
  RecipeStepDto,
} from '../../application/dto';
import { Language } from '../../../common/decorators/language.decorator';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiQuery({ name: 'category', required: false, type: Number })
  @ApiResponse({ status: 200, type: [RecipeListItemResponseDto] })
  async getAll(
    @Query('category') category?: number,
    @Language() language?: string,
  ): Promise<RecipeListItemResponseDto[]> {
    return this.recipesService.getAll(category, language);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily recipe' })
  @ApiResponse({ status: 200, type: RecipeDailyResponseDto })
  async getDaily(): Promise<RecipeDailyResponseDto> {
    return this.recipesService.getDaily();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async getById(
    @Param('id') id: string,
    @Language() language?: string,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.getById(id, language);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a recipe' })
  @ApiResponse({ status: 201, type: String })
  async create(@Body() dto: CreateRecipeDto): Promise<string> {
    return this.recipesService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiResponse({ status: 204 })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateRecipeDto,
  ): Promise<void> {
    await this.recipesService.update(id, dto);
  }

  @Put(':id/ingredients')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add ingredients to recipe' })
  @ApiResponse({ status: 204 })
  async addIngredients(
    @Param('id') id: string,
    @Body() ingredients: RecipeIngredientDto[],
  ): Promise<void> {
    await this.recipesService.addIngredients(id, ingredients);
  }

  @Put(':id/kitchenware')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add kitchenware to recipe' })
  @ApiResponse({ status: 204 })
  async addKitchenware(
    @Param('id') id: string,
    @Body() kitchenware: RecipeKitchenwareDto[],
  ): Promise<void> {
    await this.recipesService.addKitchenware(id, kitchenware);
  }

  @Put(':id/steps')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add steps to recipe' })
  @ApiResponse({ status: 204 })
  async addSteps(
    @Param('id') id: string,
    @Body() steps: RecipeStepDto[],
  ): Promise<void> {
    await this.recipesService.addSteps(id, steps);
  }
}
