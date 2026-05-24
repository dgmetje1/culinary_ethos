import { createLazyFileRoute } from "@tanstack/react-router";

import UnitsSection from "@/pages/Management/sections/UnitsSection";

export const Route = createLazyFileRoute("/management/units")({
  component: UnitsSection,
});
