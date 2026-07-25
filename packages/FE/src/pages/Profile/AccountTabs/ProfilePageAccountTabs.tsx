import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Bookmark } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { composeCdnUrl, cn } from '@/lib/utils';
import config from '@/config';
import { useGetUserRecipes } from '@/queries/recipes';
import { useGetSavedRecipeIds, useGetSavedRecipesData, useSaveRecipe, useUnsaveRecipe } from '@/queries/saved-recipes';
import Tabs, { Tab, TabContent, TabsHeader } from '@/components/common/Tabs';

const RecipeCard = ({
  recipe,
  isLarge,
  isSaved,
  onToggleSave,
  isPending,
}: {
  recipe: { id: string; title: string; thumbnailUrl: string | null; time: number; categories?: { name: string }[] };
  isLarge: boolean;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isPending: boolean;
}) => (
  <div className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group`}>
    <Link
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
    >
      <div
        className={`relative mb-4 overflow-hidden rounded-xl bg-surface-container shadow-sm ${
          isLarge ? 'aspect-[16/9]' : 'aspect-[4/5]'
        }`}
      >
        {recipe.thumbnailUrl && (
          <img
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)}
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-4 right-4 rounded-full p-2 h-auto w-auto min-h-0 min-w-0',
            isSaved
              ? 'bg-orange-500/80 text-white'
              : 'bg-white/40 backdrop-blur-md text-primary',
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(recipe.id);
          }}
          disabled={isPending}
        >
          <Bookmark
            className="w-4 h-4 transition-all"
            fill={isSaved ? 'currentColor' : 'none'}
          />
        </Button>
      </div>
    </Link>
    <Link
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
    >
      <div className="flex justify-between items-start px-2">
        <div>
          <h3 className="text-[24px] leading-[1.3] font-medium font-serif text-primary mb-1">
            {recipe.title}
          </h3>
          <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold text-on-primary-container uppercase">
            {recipe.categories?.[0]?.name} &bull;{' '}
            {Math.floor(recipe.time / 60)} min
          </p>
        </div>
      </div>
    </Link>
  </div>
);

const ProfilePageAccountTabs = () => {
  const { t } = useTranslation();
  const { data: recipes = [] } = useGetUserRecipes();
  const { data: savedRecipes = [] } = useGetSavedRecipesData();
  const { data: savedIds } = useGetSavedRecipeIds();
  const { mutate: saveRecipe, isPending: isSaving } = useSaveRecipe();
  const { mutate: unsaveRecipe, isPending: isUnsaving } = useUnsaveRecipe();

  const savedSet = useMemo(
    () => new Set(savedIds?.map((s) => s.recipeId) ?? []),
    [savedIds],
  );

  const handleToggleSave = (recipeId: string) => {
    if (savedSet.has(recipeId)) {
      unsaveRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
  };

  const isPending = isSaving || isUnsaving;

  return (
    <Tabs defaultIndex={0}>
      <TabsHeader>
        <Tab label="Mis Recetas" />
        <Tab label="Colecciones Guardadas" />
      </TabsHeader>
      <TabContent contentIndex={0}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {recipes.slice(0, 6).map((recipe, i) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isLarge={i === 0 || i === 3}
              isSaved={savedSet.has(recipe.id)}
              onToggleSave={handleToggleSave}
              isPending={isPending}
            />
          ))}
        </div>
      </TabContent>
      <TabContent contentIndex={1}>
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
            {savedRecipes.slice(0, 6).map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isLarge={i === 0 || i === 3}
                isSaved
                onToggleSave={handleToggleSave}
                isPending={isPending}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-on-surface-variant py-20">
            <p className="text-body-lg">No hay colecciones guardadas a&uacute;n.</p>
          </div>
        )}
      </TabContent>
    </Tabs>
  );
};

export default ProfilePageAccountTabs;
