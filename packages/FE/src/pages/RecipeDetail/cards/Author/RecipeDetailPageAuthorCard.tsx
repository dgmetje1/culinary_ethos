import { useTranslation } from "react-i18next";
import { ChefHat } from "lucide-react";

import { cn } from "@/lib/utils";

interface RecipeDetailPageAuthorCardProps {
  author: string;
}

const RecipeDetailPageAuthorCard = ({ author }: RecipeDetailPageAuthorCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-white/70 dark:bg-stone-900/70",
        "backdrop-blur-xl",
        "p-8 rounded-xl",
        "border border-stone-200/30 dark:border-stone-800/30"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-stone-500" />
        </div>
        <div>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              "text-stone-500 dark:text-stone-400"
            )}
          >
            {t("pages.recipe.author_title").toUpperCase()}
          </p>
          <p className="text-xl font-serif">{author}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPageAuthorCard;