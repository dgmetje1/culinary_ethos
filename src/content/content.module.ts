import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Unit, Ingredient, Kitchenware, Recipe } from './domain/models';
import { CategoryRepository, UnitRepository, IngredientRepository, KitchenwareRepository, RecipeRepository } from './infrastructure';
import { CategoriesService, UnitsService, IngredientsService, KitchenwareService, RecipesService } from './application/services';
import { CategoriesController, UnitsController, IngredientsController, KitchenwareController, RecipesController } from './interfaces/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Unit, Ingredient, Kitchenware, Recipe])],
  controllers: [
    CategoriesController,
    UnitsController,
    IngredientsController,
    KitchenwareController,
    RecipesController,
  ],
  providers: [
    CategoryRepository,
    UnitRepository,
    IngredientRepository,
    KitchenwareRepository,
    RecipeRepository,
    CategoriesService,
    UnitsService,
    IngredientsService,
    KitchenwareService,
    RecipesService,
  ],
  exports: [
    CategoriesService,
    UnitsService,
    IngredientsService,
    KitchenwareService,
    RecipesService,
  ],
})
export class ContentModule {}