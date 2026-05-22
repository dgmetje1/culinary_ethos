import { createFileRoute, lazy } from "@tanstack/react-router";

import Loader from "@/components/common/Loader";
import i18n from "@/i18n";

const ManagementLayout = lazy(
  () => import("@/components/layouts/Management/ManagementLayout"),
);

export const Route = createFileRoute("/management")({
  component: ManagementLayout,
  pendingComponent: Loader,
  beforeLoad: () => ({ getTitle: () => i18n.t("pages.management.index.title") }),
});
