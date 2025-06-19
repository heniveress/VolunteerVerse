import { BareFetcher, PublicConfiguration } from 'swr/_internal';

export type SwrErrorHandler<TError, TData> = (
  err: TError,
  key: string,
  config: Readonly<PublicConfiguration<TData, TError, BareFetcher<TData>>>,
) => void | Promise<void> | undefined;
