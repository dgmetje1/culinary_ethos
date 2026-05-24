import { createLazyFileRoute } from "@tanstack/react-router";

import IngredientsSection from "@/pages/Management/sections/IngredientsSection";

export const Route = createLazyFileRoute("/management/ingredients")({
  component: IngredientsSection,
});
