/* eslint-disable no-unused-expressions */
import * as React from 'react';
import _ from 'lodash';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, useQueryClient } from 'react-query';
import usePagination from './usePagination';

const oneMinute = 60 * 1000;
const defaultQueryOptions = {
  keepPreviousData: true,
  staleTime: 5 * oneMinute
};

const usePaginationWrapper = ({ queryKey, queryFn, queryOptions, perPageOptions, usePaginationHook }) => {
  const [total, setTotal] = React.useState(0);
  const pagination = usePaginationHook(total, perPageOptions);
  const [enabled, setEnabled] = React.useState(true);

  const offset = pagination.pageIndex * pagination.perPage;
  const handleError = useErrorHandler();

  const paginatedQueryKey = [...queryKey, pagination.perPage, offset];

  const query = useQuery(paginatedQueryKey, () => queryFn(pagination.perPage, offset), {
    ...defaultQueryOptions,
    ...queryOptions,
    enabled,
    onError: e => {
      queryOptions?.onError?.(e);
      handleError(e.data);
    }
  });

  const { data, isPreviousData } = query;
  React.useLayoutEffect(() => {
    if (data) setTotal(data.count);
  }, [data]);

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (data?.next && !isPreviousData) {
      const nextOffset = offset + pagination.perPage;
      const debouncedFn = setTimeout(() => {
        queryClient.prefetchQuery(
          [...queryKey, pagination.perPage, nextOffset],
          () => queryFn(pagination.perPage, nextOffset),
          { staleTime: 5 * oneMinute, ...queryOptions }
        );
      }, 500);
      return () => clearTimeout(debouncedFn);
    }

    return () => {};
  }, [data, isPreviousData, offset, pagination.perPage, queryClient, queryKey, queryOptions, queryFn]);

  const debouncedSetEnabled = React.useCallback(_.debounce(setEnabled, 500), []);
  const handlePageChange = onPageChange => () => {
    setEnabled(false);
    debouncedSetEnabled(true);
    onPageChange?.();
  };

  return {
    query,
    queryKey: paginatedQueryKey,
    pagination: {
      count: total,
      perPage: pagination.perPage,
      pageIndex: pagination.pageIndex,
      next: pagination.nextPage,
      onNext: handlePageChange(pagination.onNext),
      previous: pagination.previousPage,
      onPrevious: handlePageChange(pagination.onPrevious),
      sizeOptions: pagination.sizeOptions,
      onPerPageChange: pagination.changeSize,
      setPageIndex: pagination.setPageIndex
    }
  };
};

export const usePaginatedQuery = args => usePaginationWrapper({ ...args, usePaginationHook: usePagination });
