import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Unit, Ingredient, Kitchenware, Recipe, MealPlan } from './domain/models';
import { CategoryRepository, UnitRepository, IngredientRepository, KitchenwareRepository, RecipeRepository, MealPlanRepository } from './infrastructure';
import { CategoriesService, UnitsService, IngredientsService, KitchenwareService, RecipesService, MealPlansService } from './application/services';
import { CategoriesController, UnitsController, IngredientsController, KitchenwareController, RecipesController, MealPlansController } from './interfaces/controllers';
import { CATEGORY_REPOSITORY } from './application/repositories/category.repository';
import { UNIT_REPOSITORY } from './application/repositories/unit.repository';
import { INGREDIENT_REPOSITORY } from './application/repositories/ingredient.repository';
import { KITCHENWARE_REPOSITORY } from './application/repositories/kitchenware.repository';
import { RECIPE_REPOSITORY } from './application/repositories/recipe.repository';
import { MEAL_PLAN_REPOSITORY } from './application/repositories/meal-plan.repository';

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
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: UNIT_REPOSITORY,
      useClass: UnitRepository,
    },
    {
      provide: INGREDIENT_REPOSITORY,
      useClass: IngredientRepository,
    },
    {
      provide: KITCHENWARE_REPOSITORY,
      useClass: KitchenwareRepository,
    },
    {
      provide: RECIPE_REPOSITORY,
      useClass: RecipeRepository,
    },
    {
      provide: MEAL_PLAN_REPOSITORY,
      useClass: MealPlanRepository,
    },
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
    RECIPE_REPOSITORY,
    CATEGORY_REPOSITORY,
  ],
})
export class ContentModule {}