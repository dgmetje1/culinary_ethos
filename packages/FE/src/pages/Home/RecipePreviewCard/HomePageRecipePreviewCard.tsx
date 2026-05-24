import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import List from "@/components/common/List";
import config from "@/config";
import { composeCdnUrl } from "@/lib/utils";
import { printTime } from "@/lib/parsers/time";
import { useGetDailyRecipe } from "@/queries/recipes";
import { DailyRecipe, RecipeDifficulty } from "@/types/recipe";

const CARD_FIELDS: {
  key: keyof DailyRecipe;
  getValue: (recipe: DailyRecipe) => string;
}[] = [
  {
    key: "time",
    getValue: (recipe: DailyRecipe) => printTime(recipe.time),
  },
  {
    key: "difficulty",
    getValue: (recipe: DailyRecipe) => RecipeDifficulty[recipe["difficulty"]].toLocaleLowerCase(),
  },
  {
    key: "portions",
    getValue: (recipe: DailyRecipe) => recipe["portions"].toString(),
  },
];

const HomePageRecipePreviewCard = () => {
  const { t } = useTranslation();
  const { data: recipe, isLoading } = useGetDailyRecipe();
  const recipeContent = useMemo(() => {
    if (isLoading || !recipe) return null;

    return (
      <div style={{ display: "grid", columnGap: "1rem", gridTemplateColumns: "repeat(12, 1fr)", rowGap: "0.5rem" }}>
        <div style={{ gridColumn: "span 12" }}>
          <h4 style={{ color: "#444", fontWeight: 600, fontSize: "1.25rem" }}>
            {t("pages.home.recipe_preview.title")}
          </h4>
        </div>
        <div style={{ gridColumn: "span 4" }}>
          <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
            <img
              src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)}
              width="100%"
              style={{ borderRadius: "0.5rem", boxShadow: "2px 1px 3px #aaa" }}
            />
          </Link>
        </div>
        <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
            <h5 style={{ fontWeight: 600, fontSize: "1.15rem" }}>{recipe.title}</h5>
          </Link>
          <div style={{ display: "grid", columnGap: "0.5rem", gridTemplateColumns: "repeat(12, 1fr)" }}>
            <div style={{ gridColumn: "span 6", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {recipe.categories?.map(category => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", rowGap: "0.5rem" }}>
                {CARD_FIELDS.map(field => (
                  <p key={field.key}>
                    <strong>{t(`recipe.fields.${field.key}`)}: </strong>
                    {field.getValue(recipe)}
                  </p>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "span 6" }}>
              {!!recipe.ingredients.length && (
                <List
                  items={recipe.ingredients.slice(0, 5)}
                  renderItem={ingredient =>
                    `${ingredient.quantity} ${ingredient.unit?.shortName || ''} de ${ingredient.name.toLocaleLowerCase()}`
                  }
                  shouldSeeMoreBeShown={recipe.ingredients.length > 5}
                  title={
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {t("pages.home.recipe_preview.ingredients_title")}
                    </p>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [isLoading, recipe, t]);

  return (
    <section style={{ padding: "1.25rem", backgroundColor: "#f0efef", borderRadius: "var(--radius)" }}>
      {recipeContent}
    </section>
  );
};

export default HomePageRecipePreviewCard;
