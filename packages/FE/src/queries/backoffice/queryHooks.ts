import { useApiQuery } from "@/middleware/api";

import { getDashboardStatsKeys } from "./keys";
import { getDashboardStats } from "./queries";

export const useGetDashboardStats = () => {
  const { key, queryKey } = getDashboardStatsKeys();
  return useApiQuery(key, queryKey, () => getDashboardStats());
};
