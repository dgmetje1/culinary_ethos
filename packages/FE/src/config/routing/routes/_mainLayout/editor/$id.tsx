import { createFileRoute } from '@tanstack/react-router';

import Loader from '@/components/common/Loader';
import RecipeEditorPage from '@/pages/RecipeEditor';
import { getRecipeOptions } from '@/queries/recipes/options';

export const Route = createFileRoute('/_mainLayout/editor/$id')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getRecipeOptions(id));
  },
  component: RecipeEditorPage,
  pendingComponent: Loader,
  pendingMs: 1000,
});
