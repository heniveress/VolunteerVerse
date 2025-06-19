import { useCallback } from 'react';
import useSWR, { mutate as swrMutate } from 'swr';

const useFetchWithSWR = <TData, TError>(swrParams: string | null) => {
  const { data, error, isValidating, isLoading } = useSWR<TData, TError>(
    swrParams,
  );
  const mutate = useCallback(() => swrMutate(swrParams), [swrParams]);
  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useFetchWithSWR;
