import { createLazyFileRoute } from "@tanstack/react-router";

import CategoriesSection from "@/pages/Management/sections/CategoriesSection";

export const Route = createLazyFileRoute("/management/categories")({
  component: CategoriesSection,
});
