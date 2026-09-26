import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import { getUnitsKeys } from "./keys";
import { getUnits } from "./queries";

export const useGetUnits = () => {
  const { key, queryKey } = getUnitsKeys();

  return useApiQuery(key, queryKey, () => getUnits());
};

export const useSuspenseGetUnits = () => {
  const { key } = getUnitsKeys();

  return useSuspenseApiQuery(key, {
    queryKey: [key],
    queryFn: () => getUnits(),
  });
};
