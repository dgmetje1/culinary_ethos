import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bookmark, Pencil } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import config from "@/config";
import { useAuthContext } from "@/context/Auth";
import { cn, composeCdnUrl } from "@/lib/utils";
import { useSuspenseGetRecipe } from "@/queries/recipes";
import { useGetIsRecipeSaved, useSaveRecipe, useUnsaveRecipe } from "@/queries/saved-recipes";

import RecipeDetailPageIngredientsCard from "./cards/Ingredients";
import RecipeDetailPageKitchenwareCard from "./cards/Kitchenware";
import RecipeDetailPageInfoCard from "./cards/Info";
import RecipeDetailPageAuthorCard from "./cards/Author";
import RecipeDetailPageStepsSection from "./sections/Steps";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/_mainLayout/recipe/$id");

const RecipeDetailPage = () => {
  const { id } = route.useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const { account, isAuthenticated } = useAuthContext();
  const { data: recipe } = useSuspenseGetRecipe(id);
  const { data: savedStatus } = useGetIsRecipeSaved(id, { enabled: isAuthenticated });
  const { mutate: saveRecipe, isPending: isSaving } = useSaveRecipe();
  const { mutate: unsaveRecipe, isPending: isUnsaving } = useUnsaveRecipe();

  const isSaved = savedStatus?.saved ?? false;
  const isSavePending = isSaving || isUnsaving;

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveRecipe(id);
    } else {
      saveRecipe(id);
    }
  };

  const categoryName = useMemo(() => {
    if (!recipe.categories?.length) return "Recipe";
    return recipe.categories.map((c) => c.name).join(" • ");
  }, [recipe.categories]);

  const timeInMinutes = useMemo(() => {
    return Math.floor(recipe.time / 60);
  }, [recipe.time]);

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-stone-950">
      {/* Hero Section */}
      <section className="relative w-full h-[716px] overflow-hidden">
        {recipe.headerImg ? (
          <img
            alt={recipe.title}
            className="w-full h-full object-cover"
            src={composeCdnUrl(config.cdnUrl, recipe.headerImg)}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full",
              "bg-gradient-to-br from-orange-100 to-stone-200",
              "dark:from-orange-900/30 dark:to-stone-900",
            )}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
          <div className="max-w-[1200px] mx-auto w-full px-8 pb-16">
            <div
              className={cn(
                "inline-block bg-white/20 backdrop-blur-md",
                "px-4 py-1 rounded-full mb-6 border border-white/30",
              )}
            >
              <span
                className={cn("text-xs font-semibold uppercase tracking-[0.1em]", "text-white")}
              >
                {categoryName} • {timeInMinutes} {t("pages.home.recipes.minutes")}
              </span>
            </div>
            <h1 className="font-serif text-5xl text-white max-w-2xl italic">{recipe.title}</h1>
          </div>
        </div>
        {account?.id !== recipe.author && (
          <Button
            className={cn(
              "absolute top-8 right-8 p-5 rounded-full shadow-lg",
              isSaved ? "bg-orange-500 text-white" : "glass text-orange-700",
            )}
            size="icon"
            onClick={handleToggleSave}
            disabled={isSavePending}
            title={t(isSaved ? "recipe.unsave" : "recipe.save")}
          >
            <Bookmark className="w-6 h-6 transition-all" fill={isSaved ? "currentColor" : "none"} />
          </Button>
        )}
        {account?.id === recipe.author && (
          <Button
            className="absolute top-8 right-8 glass p-5 rounded-full shadow-lg text-orange-700"
            size="icon"
            onClick={() =>
              router.navigate({
                to: "/editor/$id",
                params: { id: recipe.id },
                search: {},
              } as any)
            }
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}
      </section>

      {/* Recipe Content Shell */}
      <div className="max-w-[1200px] mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar: Ingredients & Tools */}
        <aside className="md:col-span-4 space-y-12">
          <RecipeDetailPageIngredientsCard ingredients={recipe.ingredients} />
          <RecipeDetailPageKitchenwareCard kitchenware={recipe.kitchenware} />
          <RecipeDetailPageInfoCard
            difficulty={recipe.difficulty}
            time={recipe.time}
            portions={recipe.portions}
          />
          <RecipeDetailPageAuthorCard authorId={recipe.author} />
        </aside>

        {/* Main: Description & Steps */}
        <article className="md:col-span-8 space-y-16">
          {recipe.description && (
            <div
              className={cn(
                "bg-white/70 dark:bg-stone-900/70",
                "backdrop-blur-xl",
                "p-8 rounded-xl",
                "border border-stone-200/30 dark:border-stone-800/30",
              )}
            >
              <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed italic">
                {recipe.description}
              </p>
            </div>
          )}
          <div
            className={cn(
              "bg-white/70 dark:bg-stone-900/70",
              "backdrop-blur-xl",
              "p-12 rounded-xl",
              "border border-stone-200/30 dark:border-stone-800/30",
            )}
          >
            <h3
              className={cn(
                "text-xl font-serif border-b border-stone-300 dark:border-stone-700",
                "pb-4 mb-12",
              )}
            >
              {t("pages.recipe.steps_title")}
            </h3>
            <RecipeDetailPageStepsSection steps={recipe.steps} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
