import { useApiQuery, useSuspenseApiQuery } from "@/middleware/api";

import { getKitchenwareKeys } from "./keys";
import { getKitchenware } from "./queries";

export const useGetKitchenware = () => {
  const { key, queryKey } = getKitchenwareKeys();

  return useApiQuery(key, queryKey, () => getKitchenware());
};

export const useSuspenseGetKitchenware = () => {
  const { key } = getKitchenwareKeys();

  return useSuspenseApiQuery(key, {
    queryKey: [key],
    queryFn: () => getKitchenware(),
  });
};