import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { RecipeIngredient } from "@/types/recipe";

interface RecipeDetailPageIngredientsCardProps {
  ingredients: RecipeIngredient[];
}

const RecipeDetailPageIngredientsCard = ({ ingredients }: RecipeDetailPageIngredientsCardProps) => {
  const { t } = useTranslation();

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-surface-container dark:bg-stone-900/70",
        "backdrop-blur-xl",
        "p-8 rounded-xl",
      )}
    >
      <h3 className={cn("text-xl font-serif border-b border-outline-variant", "pb-4 mb-6")}>
        {t("pages.recipe.ingredients_title")}
      </h3>
      <ul className="space-y-4">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b border-surface-container"
          >
            <div className="flex items-center gap-2">
              <span className="text-base text-stone-900 dark:text-stone-100">
                {ingredient.name}
              </span>
              {ingredient.optional && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded",
                    "bg-stone-200 dark:bg-stone-700",
                    "text-stone-600 dark:text-stone-400",
                  )}
                >
                  {t("pages.editor.optional")}
                </span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                "text-stone-500 dark:text-stone-400",
              )}
            >
              {ingredient.quantity} {ingredient.unit?.shortName || ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetailPageIngredientsCard;
