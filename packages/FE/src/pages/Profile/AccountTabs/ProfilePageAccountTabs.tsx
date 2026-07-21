import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { composeCdnUrl } from "@/lib/utils";
import config from "@/config";
import { useGetUserRecipes } from "@/queries/recipes";
import Tabs, { Tab, TabContent, TabsHeader } from "@/components/common/Tabs";

const ProfilePageAccountTabs = () => {
  const { t } = useTranslation();
  const { data: recipes = [] } = useGetUserRecipes();

  return (
    <Tabs defaultIndex={0}>
      <TabsHeader>
        <Tab label="Mis Recetas" />
        <Tab label="Colecciones Guardadas" />
      </TabsHeader>
      <TabContent contentIndex={0}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {recipes.slice(0, 6).map((recipe, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <Link
                key={recipe.id}
                params={{ id: recipe.id.toString() }}
                to="/recipe/$id"
                className={`${isLarge ? "md:col-span-8" : "md:col-span-4"} group`}
              >
                <div
                  className={`relative mb-4 overflow-hidden rounded-xl bg-surface-container shadow-sm ${
                    isLarge ? "aspect-[16/9]" : "aspect-[4/5]"
                  }`}
                >
                  <img
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)}
                  />
                  <div className="absolute top-4 right-4 p-2 bg-white/40 backdrop-blur-md rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-primary text-xl block leading-none">
                      bookmark
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-[24px] leading-[1.3] font-medium font-serif text-primary mb-1">
                      {recipe.title}
                    </h3>
                    <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
                      {recipe.categories?.[0]?.name} &bull;{" "}
                      {Math.floor(recipe.time / 60)} min
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </TabContent>
      <TabContent contentIndex={1}>
        <div className="mt-12 text-center text-on-surface-variant py-20">
          <p className="text-body-lg">No hay colecciones guardadas a&uacute;n.</p>
        </div>
      </TabContent>
    </Tabs>
  );
};

export default ProfilePageAccountTabs;
