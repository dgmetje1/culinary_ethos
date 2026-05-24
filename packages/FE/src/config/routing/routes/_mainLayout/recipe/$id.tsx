import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import Loader from '@/components/common/Loader';
import { getRecipeOptions } from '@/queries/recipes/options';

const RecipeDetail = lazy(() => import('@/pages/RecipeDetail'));

export const Route = createFileRoute('/_mainLayout/recipe/$id')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getRecipeOptions(id));
  },
  component: RecipeDetail,
  pendingComponent: Loader,
  pendingMs: 1000,
});
