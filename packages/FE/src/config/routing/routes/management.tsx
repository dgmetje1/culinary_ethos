import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy } from "react";

import Loader from "@/components/common/Loader";
import i18n from "@/i18n";

const ManagementLayout = lazy(
  () => import("@/components/layouts/Management/ManagementLayout"),
);

export const Route = createFileRoute("/management")({
  component: ManagementLayout,
  pendingComponent: Loader,
  beforeLoad: ({ context, location }) => {
    if (!context.authContext.isAuthenticated && !context.authContext.isAuthenticatedLoading) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
    if (context.authContext.account?.role !== "admin") {
      throw redirect({ to: "/" });
    }
    return { getTitle: () => i18n.t("pages.management.index.title") };
  },
});
