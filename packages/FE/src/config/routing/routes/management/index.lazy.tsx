import { createLazyFileRoute } from "@tanstack/react-router";

import { DashboardSection } from "@/pages/Management/sections";

export const Route = createLazyFileRoute("/management/")({
  component: DashboardSection,
});
