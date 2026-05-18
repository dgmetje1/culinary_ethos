import { useTranslation } from "react-i18next";
import { ChefHat, Clock, Flame, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { RecipeDifficulty } from "@/types/recipe";

interface RecipeDetailPageInfoCardProps {
  difficulty: RecipeDifficulty;
  time: number;
  portions: number;
}

const printTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

const RecipeDetailPageInfoCard = ({ difficulty, time, portions }: RecipeDetailPageInfoCardProps) => {
  const { t } = useTranslation();

  const getDifficultyLabel = (level: RecipeDifficulty): string => {
    switch (level) {
      case RecipeDifficulty.EASY:
        return t("recipe.difficulty.1");
      case RecipeDifficulty.MEDIUM:
        return t("recipe.difficulty.2");
      case RecipeDifficulty.HARD:
        return t("recipe.difficulty.3");
      default:
        return t("recipe.difficulty.2");
    }
  };

  return (
    <div
      className={cn(
        "bg-white/70 dark:bg-stone-900/70",
        "backdrop-blur-xl",
        "p-8 rounded-xl",
        "border border-stone-200/30 dark:border-stone-800/30",
        "space-y-6"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <ChefHat className="w-5 h-5 text-orange-700 dark:text-orange-500" />
        </div>
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              "text-stone-500 dark:text-stone-400"
            )}
          >
            {t("recipe.fields.difficulty").toUpperCase()}
          </p>
          <p className="text-base font-medium">{getDifficultyLabel(difficulty)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Clock className="w-5 h-5 text-orange-700 dark:text-orange-500" />
        </div>
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              "text-stone-500 dark:text-stone-400"
            )}
          >
            {t("recipe.fields.time").toUpperCase()}
          </p>
          <p className="text-base font-medium">{printTime(time)}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Users className="w-5 h-5 text-orange-700 dark:text-orange-500" />
        </div>
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              "text-stone-500 dark:text-stone-400"
            )}
          >
            {t("recipe.fields.portions").toUpperCase()}
          </p>
          <p className="text-base font-medium">{portions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPageInfoCard;