export const API_ACTION_BASE = "backoffice";

export const getDashboardStatsKeys = () => {
  const queryKey = [API_ACTION_BASE, "getDashboardStats"];
  const key = queryKey.join("/");
  return { key, queryKey };
};
