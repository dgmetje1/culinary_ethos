import { Link, useParams } from "@tanstack/react-router";
import { ChefHat, Loader2 } from "lucide-react";

import AuthorName from "@/components/common/AuthorName/AuthorName";
import { composeCdnUrl } from "@/lib/utils";
import config from "@/config";
import { useApiQuery } from "@/middleware/api";
import { getUserSummaryKeys } from "@/queries/users/keys";
import { getUserSummary } from "@/queries/users/queries";
import { useGetUserPublicRecipes } from "@/queries/recipes";

const PublicProfilePage = () => {
  const { userId } = useParams({ from: "/_mainLayout/author/$userId" });
  const { key, queryKey } = getUserSummaryKeys(userId);
  const { data: user, isLoading: userLoading } = useApiQuery(key, queryKey, () =>
    getUserSummary(userId),
  );
  const { data: recipes = [], isLoading: recipesLoading } = useGetUserPublicRecipes(userId);

  const displayName = user?.nickName || user?.name || userId;
  const avatarUrl = user?.profilePicture
    ? composeCdnUrl(config.cdnUrl, user.profilePicture)
    : null;

  return (
    <main className="pb-20 max-w-[1200px] mx-auto px-8">
      <div className="pt-32">
        <section className="flex flex-col md:flex-row items-start md:items-center gap-12 mb-20 p-8 bg-surface-container-low rounded-xl border border-outline-variant/50">
          <div className="w-40 h-40 md:w-48 md:h-48 shrink-0">
            <div className="relative w-full h-full overflow-hidden rounded-full border border-outline-variant">
              {userLoading ? (
                <Loader2 className="w-full h-full text-stone-400 animate-spin" />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ChefHat className="w-full h-full p-4 text-stone-500" />
              )}
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-serif text-primary">
                {displayName}
              </h1>
            </div>
            <div className="flex gap-12 pt-4">
              <div className="flex flex-col">
                <span className="text-[24px] leading-[1.3] font-medium font-serif text-primary">
                  {recipes.length}
                </span>
                <span className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
                  Recetas
                </span>
              </div>
            </div>
          </div>
        </section>

        {recipesLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center text-on-surface-variant py-20">
            <p className="text-body-lg">No hay recetas publicadas a&uacute;n.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
            {recipes.map((recipe, i) => {
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
        )}
      </div>
    </main>
  );
};

export default PublicProfilePage;
