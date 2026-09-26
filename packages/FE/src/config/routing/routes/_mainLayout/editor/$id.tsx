import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy } from "react";

import Loader from "@/components/common/Loader";
import { getRecipeOptions } from "@/queries/recipes/options";

const RecipeEditorPage = lazy(() => import("@/pages/RecipeEditor"));

export const Route = createFileRoute("/_mainLayout/editor/$id")({
  beforeLoad: ({ context, location }) => {
    if (!context.authContext.isAuthenticated && !context.authContext.isAuthenticatedLoading) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(getRecipeOptions(id));
  },
  component: RecipeEditorPage,
  pendingComponent: Loader,
  pendingMs: 1000,
});
