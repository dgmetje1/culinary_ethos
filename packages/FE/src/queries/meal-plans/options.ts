import { queryOptions } from "@tanstack/react-query";

import { getMealPlanByWeekKeys } from "./keys";
import { getMealPlanByWeek } from "./queries";

export const getMealPlanByWeekOptions = (weekStart: string) => {
  const { queryKey } = getMealPlanByWeekKeys(weekStart);
  return queryOptions({
    queryKey,
    queryFn: () => getMealPlanByWeek(weekStart),
  });
};
