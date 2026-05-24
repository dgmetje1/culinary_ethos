import { createLazyFileRoute } from "@tanstack/react-router";

import KitchenwareSection from "@/pages/Management/sections/KitchenwareSection";

export const Route = createLazyFileRoute("/management/kitchenware")({
  component: KitchenwareSection,
});
