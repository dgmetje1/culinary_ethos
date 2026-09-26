import { useTranslation } from "react-i18next";
import { Plus, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Ingredient {
  id: string;
  value: string;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const IngredientsSection = ({ ingredients, onChange }: IngredientsSectionProps) => {
  const { t } = useTranslation();

  const handleAddIngredient = () => {
    onChange([...ingredients, { id: Date.now().toString(), value: "" }]);
  };

  const handleUpdateIngredient = (id: string, value: string) => {
    onChange(ingredients.map((ing) => (ing.id === id ? { ...ing, value } : ing)));
  };

  const handleRemoveIngredient = (id: string) => {
    onChange(ingredients.filter((ing) => ing.id !== id));
  };

  return (
    <div
      className={cn(
        "bg-white/60 dark:bg-stone-900/60",
        "backdrop-blur-xl",
        "border border-stone-200/30 dark:border-stone-800/30",
        "p-8 rounded-lg",
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className={cn(
            "text-xl font-serif",
            "text-stone-900 dark:text-stone-100",
            "flex items-center gap-2",
          )}
        >
          <span className="text-orange-700 dark:text-orange-500">🥗</span>
          {t("pages.editor.sections.ingredients.title")}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-700 hover:text-orange-900 dark:text-orange-500 dark:hover:text-orange-400"
          onClick={handleAddIngredient}
          type="button"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <ul className="space-y-4">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex gap-3 items-center border-b border-stone-200/20 dark:border-stone-700/20 pb-2"
          >
            <GripVertical className="w-4 h-4 text-stone-400 cursor-grab" />
            <input
              className={cn(
                "bg-transparent w-full",
                "text-base",
                "outline-none border-none p-0 focus:ring-0",
                "placeholder:text-stone-300 dark:placeholder:text-stone-600",
                "text-stone-900 dark:text-stone-100",
              )}
              placeholder={t("pages.editor.sections.ingredients.placeholder")}
              type="text"
              value={ingredient.value}
              onChange={(e) => handleUpdateIngredient(ingredient.id, e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-red-500"
              onClick={() => handleRemoveIngredient(ingredient.id)}
              type="button"
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsSection;
