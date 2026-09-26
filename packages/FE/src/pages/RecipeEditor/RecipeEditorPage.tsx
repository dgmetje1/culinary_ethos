import { useTranslation } from "react-i18next";

import RecipeEditorForm from "./Form/RecipeEditorForm";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipe";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_mainLayout/editor/$id");

const RecipeEditorPage = () => {
  const { t } = useTranslation();
  const loaderData: Recipe = routeApi.useLoaderData();

  const isEditing = !!loaderData;

  return (
    <div className={cn("min-h-screen bg-[#faf9f7] dark:bg-stone-950")}>
      <section className="pt-12 pb-5">
        <div className="max-w-[1200px] mx-auto px-8">
          <header className="mb-12">
            <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2 italic">
              {isEditing ? t("pages.editor.edit_title") : t("pages.editor.title")}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl">
              {isEditing ? t("pages.editor.edit_description") : t("pages.editor.description")}
            </p>
          </header>
        </div>
      </section>
      <RecipeEditorForm initialData={loaderData} />
    </div>
  );
};

export default RecipeEditorPage;
