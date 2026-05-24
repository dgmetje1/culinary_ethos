import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

import Loader from "@/components/common/Loader";

const LoginPage = lazy(() => import("@/pages/auth/Login"));

export const Route = createFileRoute("/login")({
  component: LoginPage,
  pendingComponent: Loader,
});
