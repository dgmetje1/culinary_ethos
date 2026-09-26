import { Injectable, Inject } from "@nestjs/common";
import {
  RECIPE_REPOSITORY,
  IRecipeRepository,
} from "../../../content/application/repositories/recipe.repository";
import {
  USER_REPOSITORY,
  IUserRepository,
} from "../../../social/application/repositories/i-user.repository";
import { DashboardStatsDto } from "../dto/responses/dashboard-stats.dto";

@Injectable()
export class BackofficeService {
  constructor(
    @Inject(RECIPE_REPOSITORY) private readonly recipeRepository: IRecipeRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const [pendingRecipes, totalRecipes, totalUsers, newUsers] = await Promise.all([
      this.recipeRepository.countByStatus("flagged"),
      this.recipeRepository.countAll(),
      this.userRepository.countAll(),
      this.userRepository.countNewThisMonth(),
    ]);

    return {
      pendingRecipes,
      totalRecipes,
      totalUsers,
      newUsers,
    };
  }
}
