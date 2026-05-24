import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from '../content/domain/models/recipe.entity';
import { User } from '../social/domain/models/user.entity';
import { RecipeRepository } from '../content/infrastructure/repositories/recipe.repository';
import { UserRepository } from '../social/infrastructure/repositories/user.repository';
import { RECIPE_REPOSITORY } from '../content/application/repositories/recipe.repository';
import { USER_REPOSITORY } from '../social/application/repositories/i-user.repository';
import { BackofficeController } from './interfaces/controllers/backoffice.controller';
import { BackofficeService } from './application/services/backoffice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User])],
  controllers: [BackofficeController],
  providers: [
    {
      provide: RECIPE_REPOSITORY,
      useClass: RecipeRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    BackofficeService,
  ],
})
export class BackofficeModule {}
