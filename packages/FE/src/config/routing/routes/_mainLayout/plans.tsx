import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy } from "react";

import Loader from "@/components/common/Loader";

const PlansPage = lazy(() => import("@/pages/Plans"));

export const Route = createFileRoute("/_mainLayout/plans")({
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
  component: PlansPage,
  pendingComponent: Loader,
  pendingMs: 1000,
});
