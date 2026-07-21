import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { z } from "zod";

import Loader from "@/components/common/Loader";

const LoginPage = lazy(() => import("@/pages/auth/Login"));

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
  pendingComponent: Loader,
});
