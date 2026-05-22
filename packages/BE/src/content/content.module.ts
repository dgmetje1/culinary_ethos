import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Unit, Ingredient, Kitchenware, Recipe, MealPlan } from './domain/models';
import { CategoryRepository, UnitRepository, IngredientRepository, KitchenwareRepository, RecipeRepository, MealPlanRepository } from './infrastructure';
import { CategoriesService, UnitsService, IngredientsService, KitchenwareService, RecipesService, MealPlansService } from './application/services';
import { CategoriesController, UnitsController, IngredientsController, KitchenwareController, RecipesController, MealPlansController } from './interfaces/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Unit, Ingredient, Kitchenware, Recipe, MealPlan])],
  controllers: [
    CategoriesController,
    UnitsController,
    IngredientsController,
    KitchenwareController,
    RecipesController,
    MealPlansController,
  ],
  providers: [
    CategoryRepository,
    UnitRepository,
    IngredientRepository,
    KitchenwareRepository,
    RecipeRepository,
    MealPlanRepository,
    CategoriesService,
    UnitsService,
    IngredientsService,
    KitchenwareService,
    RecipesService,
    MealPlansService,
  ],
  exports: [
    CategoriesService,
    UnitsService,
    IngredientsService,
    KitchenwareService,
    RecipesService,
    MealPlansService,
  ],
})
export class ContentModule {}