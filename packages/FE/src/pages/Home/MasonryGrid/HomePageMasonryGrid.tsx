import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Bookmark } from 'lucide-react';
import { useMemo } from 'react';

import AuthorName from '@/components/common/AuthorName/AuthorName';
import { Button } from '@/components/ui/button';
import { cn, composeCdnUrl } from '@/lib/utils';
import { useGetRecipes } from '@/queries/recipes';
import { useGetSavedRecipeIds, useSaveRecipe, useUnsaveRecipe } from '@/queries/saved-recipes';
import { useAuthContext } from '@/context/Auth';
import config from '@/config';
import { useSearch } from '@/context/Search';
import { useHomePageContext } from '../Context';

const HomePageMasonryGrid = () => {
  const { t } = useTranslation();
  const { search } = useSearch();
  const { itemsVisible } = useHomePageContext();
  const { account } = useAuthContext();
  const { data: recipes = [], isLoading } = useGetRecipes({});
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

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return null;

  return (
    <div
      className={cn(
        'columns-1 md:columns-2 lg:columns-3',
        'gap-6',
        'space-y-6',
      )}
    >
      {filteredRecipes.slice(0, itemsVisible).map((recipe) => {
        const isSaved = savedSet.has(recipe.id);
        return (
          <div
            key={recipe.id}
            className={cn('break-inside-avoid', 'group cursor-pointer', 'mb-6')}
          >
            <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
              <div
                className={cn(
                  'relative overflow-hidden mb-3',
                  'rounded-xl',
                  'transition-all duration-500',
                  'group-hover:scale-[1.02]',
                )}
              >
                <img
                  src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)}
                  alt={recipe.title}
                  className={cn(
                    'w-full object-cover',
                    'rounded-xl',
                    'transition-all duration-500',
                    'group-hover:scale-105',
                  )}
                />
                  {account && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'absolute top-4 right-4',
                      isSaved
                        ? 'bg-orange-500/80 text-white'
                        : 'bg-white/30 backdrop-blur-xl text-white hover:bg-white/50',
                      'rounded-full p-2',
                      'transition-all active:scale-90',
                      'shadow-sm border border-white/20',
                      'h-auto w-auto min-h-0 min-w-0',
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleSave(recipe.id);
                    }}
                    disabled={isSaving || isUnsaving}
                    title={t(isSaved ? 'recipe.unsave' : 'recipe.save')}
                  >
                    <Bookmark
                      className="w-4 h-4 transition-all"
                      fill={isSaved ? 'currentColor' : 'none'}
                    />
                  </Button>
                )}
              </div>
            </Link>
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-[0.1em]',
                'text-stone-600 dark:text-stone-400',
              )}
            >
              {recipe.categories?.[0]?.name} • {Math.floor(recipe.time / 60)}{' '}
              {t('pages.home.recipes.minutes')}
            </span>
            <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
              <h3
                className={cn(
                  'text-2xl font-serif font-medium',
                  'text-stone-900 dark:text-stone-100',
                  'mt-2',
                  'group-hover:text-orange-700 dark:group-hover:text-orange-500',
                  'transition-colors',
                )}
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {recipe.title}
              </h3>
            </Link>
            <p
              className={cn(
                'text-base text-stone-600 dark:text-stone-400',
                'mt-1',
              )}
            >
              {t('common.by')} <AuthorName authorId={recipe.author} />
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HomePageMasonryGrid;
