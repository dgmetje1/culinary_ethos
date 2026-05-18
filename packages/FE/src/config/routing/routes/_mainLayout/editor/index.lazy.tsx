import { createLazyFileRoute } from '@tanstack/react-router';

import { RecipeEditorCreatePage } from '@/pages/RecipeEditor';

export const Route = createLazyFileRoute('/_mainLayout/editor/')({
  component: RecipeEditorCreatePage,
});
