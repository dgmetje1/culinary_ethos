import { createLazyFileRoute } from "@tanstack/react-router";

import { UsersSection } from "@/pages/Management/sections";

export const Route = createLazyFileRoute("/management/users")({
  component: UsersSection,
});
