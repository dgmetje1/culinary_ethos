import {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

const DEFAULT_RETRY = 3;
const DEFAULT_RETRY_DELAY = 1000;

export const useApiQuery = <T,>(
  actionKey: string,
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  queryConfig?: Omit<UndefinedInitialDataOptions<T>, 'queryKey'>,
) => {
  return useQuery({
    queryKey,
    queryFn,
    retry: DEFAULT_RETRY,
    retryDelay: (attemptIndex) =>
      DEFAULT_RETRY_DELAY * Math.pow(2, attemptIndex),
    ...queryConfig,
  });
};

export const useSuspenseApiQuery = <T, Q extends QueryKey>(
  actionKey: string,
  queryOptions: UseSuspenseQueryOptions<T, Error, T, Q>,
) => {
  return useSuspenseQuery(queryOptions);
};

export const useApiMutation = <T, D extends unknown>(
  actionKey: string,
  mutationFn: MutationFunction<D, T>,
  mutationConfig?: Omit<UseMutationOptions<D, Error, T>, 'mutationFn'>,
) => {
  return useMutation({
    mutationFn,
    retry: DEFAULT_RETRY,
    retryDelay: (attemptIndex) =>
      DEFAULT_RETRY_DELAY * Math.pow(2, attemptIndex),

    ...mutationConfig,
  });
};
