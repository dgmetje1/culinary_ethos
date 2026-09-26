import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { RecipeKitchenware } from "@/types/recipe";

interface RecipeDetailPageKitchenwareCardProps {
  kitchenware: RecipeKitchenware[];
}

const RecipeDetailPageKitchenwareCard = ({ kitchenware }: RecipeDetailPageKitchenwareCardProps) => {
  const { t } = useTranslation();

  if (!kitchenware || kitchenware.length === 0) {
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
        {t("pages.recipe.kitchenware_title")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {kitchenware.map((tool, index) => (
          <span
            key={index}
            className={cn(
              "bg-surface-container-low dark:bg-stone-800",
              "px-4 py-2 text-xs font-semibold uppercase tracking-wider",
              "rounded-sm",
              "text-stone-900 dark:text-stone-100",
            )}
          >
            {tool.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecipeDetailPageKitchenwareCard;
