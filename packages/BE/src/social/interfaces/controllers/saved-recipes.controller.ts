import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Language } from '../../../common/decorators/language.decorator';
import { SavedRecipesService } from '../../application/services/saved-recipes.service';
import { RecipeListItemResponseDto } from '../../../content/application/dto';
import type { UserAttributes } from '../../../social/domain/models';

@ApiBearerAuth()
@ApiTags('Saved Recipes')
@Controller('saved-recipes')
export class SavedRecipesController {
  constructor(private readonly savedRecipesService: SavedRecipesService) {}

  @Post(':recipeId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save a recipe' })
  @ApiResponse({ status: 201, description: 'Recipe saved successfully' })
  @ApiResponse({ status: 409, description: 'Recipe already saved' })
  async save(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<{ id: string }> {
    return this.savedRecipesService.save(user.id, recipeId);
  }

  @Delete(':recipeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unsave a recipe' })
  @ApiResponse({ status: 204, description: 'Recipe unsaved successfully' })
  @ApiResponse({ status: 404, description: 'Saved recipe not found' })
  async unsave(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<void> {
    await this.savedRecipesService.unsave(user.id, recipeId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all saved recipe IDs for the current user' })
  @ApiResponse({ status: 200, description: 'List of saved recipe IDs' })
  async getSaved(
    @CurrentUser() user: UserAttributes,
  ): Promise<{ recipeId: string; savedAt: Date }[]> {
    return this.savedRecipesService.getSavedRecipeIds(user.id);
  }

  @Get(':recipeId/status')
  @ApiOperation({ summary: 'Check if a recipe is saved by the current user' })
  @ApiResponse({ status: 200, description: 'Saved status' })
  async isSaved(
    @Param('recipeId') recipeId: string,
    @CurrentUser() user: UserAttributes,
  ): Promise<{ saved: boolean }> {
    return this.savedRecipesService.isSaved(user.id, recipeId);
  }

  @Get('recipes')
  @ApiOperation({ summary: 'Get full recipe data for all saved recipes' })
  @ApiResponse({ status: 200, type: [RecipeListItemResponseDto] })
  async getSavedRecipes(
    @CurrentUser() user: UserAttributes,
    @Language() language?: string,
  ): Promise<RecipeListItemResponseDto[]> {
    return this.savedRecipesService.getSavedRecipes(user.id, language);
  }

  @Get(':recipeId/count')
  @ApiOperation({ summary: 'Get the number of times a recipe has been saved' })
  @ApiResponse({ status: 200, description: 'Saved count' })
  async getCount(
    @Param('recipeId') recipeId: string,
  ): Promise<{ count: number }> {
    return this.savedRecipesService.getSavedCount(recipeId);
  }
}
