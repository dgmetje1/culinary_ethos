import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy } from "react";

import Loader from "@/components/common/Loader";

const RecipeEditorCreatePage = lazy(() => import("@/pages/RecipeEditor/RecipeEditorCreatePage"));

export const Route = createFileRoute("/_mainLayout/editor/")({
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
  component: RecipeEditorCreatePage,
  pendingComponent: Loader,
  pendingMs: 1000,
});
