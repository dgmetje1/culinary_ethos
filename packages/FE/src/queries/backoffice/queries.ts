import { Api } from "@/lib/api";

export interface DashboardStats {
  pendingRecipes: number;
  totalRecipes: number;
  totalUsers: number;
  newUsers: number;
}

export const getDashboardStats = () => {
  return new Api().get<DashboardStats>("backoffice/stats");
};
