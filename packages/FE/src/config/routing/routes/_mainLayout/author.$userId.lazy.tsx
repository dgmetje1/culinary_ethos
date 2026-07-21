import { createLazyFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const PublicProfilePage = lazy(() => import("@/pages/Profile/PublicProfilePage"));

export const Route = createLazyFileRoute("/_mainLayout/author/$userId")({
  component: PublicProfilePage,
});
