import { createFileRoute, lazy } from '@tanstack/react-router';

import Loader from '@/components/common/Loader';
import { getRecipeOptions } from '@/queries/recipes/options';

const RecipeEditorPage = lazy(() => import('@/pages/RecipeEditor'));

export const Route = createFileRoute('/_mainLayout/editor/$id')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getRecipeOptions(id));
  },
  component: RecipeEditorPage,
  pendingComponent: Loader,
  pendingMs: 1000,
});
