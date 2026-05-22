import { createFileRoute, lazy } from "@tanstack/react-router";

import Loader from "@/components/common/Loader";

const LoginPage = lazy(() => import("@/pages/auth/Login"));

export const Route = createFileRoute("/login")({
  component: LoginPage,
  pendingComponent: Loader,
});
