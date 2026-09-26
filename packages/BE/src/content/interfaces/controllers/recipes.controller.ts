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
} from "@nestjs/common";
import { ApiOperation, ApiTags, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { RecipesService } from "../../application/services";
import {
  CreateRecipeDto,
  RecipeResponseDto,
  RecipeListItemResponseDto,
  RecipeDailyResponseDto,
  RecipeIngredientDto,
  RecipeKitchenwareDto,
  RecipeStepDto,
} from "../../application/dto";
import { Language } from "../../../common/decorators/language.decorator";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { Public } from "../../../auth/decorators/public.decorator";
import type { UserAttributes } from "../../../social/domain/models";

@ApiTags("Recipes")
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get all recipes" })
  @ApiQuery({ name: "category", required: false, type: Number })
  @ApiResponse({ status: 200, type: [RecipeListItemResponseDto] })
  async getAll(
    @Query("category") category?: number,
    @Language() language?: string,
  ): Promise<RecipeListItemResponseDto[]> {
    return this.recipesService.getAll(category, language);
  }

  @ApiBearerAuth()
  @Get("user")
  @ApiOperation({ summary: "Get recipes for the authenticated user" })
  @ApiResponse({ status: 200, type: [RecipeListItemResponseDto] })
  async getByUser(
    @CurrentUser() user: UserAttributes,
    @Language() language?: string,
  ): Promise<RecipeListItemResponseDto[]> {
    return this.recipesService.getByUser(user.id, language);
  }

  @Public()
  @Get("author/:authorId")
  @ApiOperation({ summary: "Get public recipes by author ID" })
  @ApiResponse({ status: 200, type: [RecipeListItemResponseDto] })
  async getByAuthorId(
    @Param("authorId") authorId: string,
    @Language() language?: string,
  ): Promise<RecipeListItemResponseDto[]> {
    return this.recipesService.getByUser(authorId, language);
  }

  @ApiBearerAuth()
  @Get("admin")
  @ApiOperation({ summary: "Get all recipes for admin (with status filter)" })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, type: [RecipeResponseDto] })
  async getAllAdmin(
    @Query("status") status?: string,
    @Language() language?: string,
  ): Promise<RecipeResponseDto[]> {
    return this.recipesService.getAllAdmin(status, language);
  }

  @ApiBearerAuth()
  @Get("daily")
  @ApiOperation({ summary: "Get daily recipe" })
  @ApiResponse({ status: 200, type: RecipeDailyResponseDto })
  async getDaily(): Promise<RecipeDailyResponseDto> {
    return this.recipesService.getDaily();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get recipe by ID" })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async getById(
    @Param("id") id: string,
    @Language() language?: string,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.getById(id, language);
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a recipe" })
  @ApiResponse({ status: 201, type: String })
  async create(@Body() dto: CreateRecipeDto, @CurrentUser() user: UserAttributes): Promise<string> {
    const authorName = user.nick_name || `${user.name} ${user.last_name}` || "Someone";
    return this.recipesService.create(dto, user.id, authorName);
  }

  @ApiBearerAuth()
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update a recipe" })
  @ApiResponse({ status: 204 })
  async update(
    @Param("id") id: string,
    @Body() dto: CreateRecipeDto,
    @CurrentUser() user: UserAttributes,
  ): Promise<void> {
    await this.recipesService.update(id, dto, user.id);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a recipe" })
  @ApiResponse({ status: 204 })
  async delete(@Param("id") id: string): Promise<void> {
    await this.recipesService.delete(id);
  }

  @ApiBearerAuth()
  @Put(":id/approve")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Approve a flagged recipe" })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async approve(
    @Param("id") id: string,
    @Language() language?: string,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.approve(id, "admin", language);
  }

  @ApiBearerAuth()
  @Put(":id/flag")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Flag a published recipe for review" })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async flag(@Param("id") id: string, @Language() language?: string): Promise<RecipeResponseDto> {
    return this.recipesService.flag(id, language);
  }

  @ApiBearerAuth()
  @Put(":id/reject")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reject a flagged recipe (ban it)" })
  @ApiResponse({ status: 200, type: RecipeResponseDto })
  async reject(@Param("id") id: string, @Language() language?: string): Promise<RecipeResponseDto> {
    return this.recipesService.reject(id, "admin", language);
  }

  @ApiBearerAuth()
  @Put(":id/ingredients")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Add ingredients to recipe" })
  @ApiResponse({ status: 204 })
  async addIngredients(
    @Param("id") id: string,
    @Body() ingredients: RecipeIngredientDto[],
  ): Promise<void> {
    await this.recipesService.addIngredients(id, ingredients);
  }

  @ApiBearerAuth()
  @Put(":id/kitchenware")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Add kitchenware to recipe" })
  @ApiResponse({ status: 204 })
  async addKitchenware(
    @Param("id") id: string,
    @Body() kitchenware: RecipeKitchenwareDto[],
  ): Promise<void> {
    await this.recipesService.addKitchenware(id, kitchenware);
  }

  @ApiBearerAuth()
  @Put(":id/steps")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Add steps to recipe" })
  @ApiResponse({ status: 204 })
  async addSteps(@Param("id") id: string, @Body() steps: RecipeStepDto[]): Promise<void> {
    await this.recipesService.addSteps(id, steps);
  }
}
