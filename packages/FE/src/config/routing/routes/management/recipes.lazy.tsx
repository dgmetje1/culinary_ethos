import { createLazyFileRoute } from "@tanstack/react-router";

import { RecipesSection } from "@/pages/Management/sections";

export const Route = createLazyFileRoute("/management/recipes")({
  component: RecipesSection,
});
