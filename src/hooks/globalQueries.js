import { useQuery } from 'react-query';
import apiPaths from '../utils/apiPaths';
import globalApi from '../api/swagup/global';

const oneSecond = 1000;
const fifteenMinutes = 15 * 60 * oneSecond;
const oneHour = 4 * fifteenMinutes;

const defaultOptions = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: fifteenMinutes,
  cacheTime: oneHour
};

const useDefaultQuery = (queryKey, queryFn, options) => {
  return useQuery(queryKey, queryFn, { ...defaultOptions, ...options });
};

const useCompany = (options = {}) => {
  const query = useDefaultQuery(apiPaths.accounts, () => globalApi.fetchAccount(), options);

  return query;
};

const useCountries = (options = {}) => {
  return useDefaultQuery(apiPaths.countries, () => globalApi.fetchCountries(), options);
};

const useSizes = (options = {}) => {
  return useDefaultQuery(apiPaths.sizes, () => globalApi.fetchSizes(), options);
};

const useGlobalQuery = enabled => {
  const sizes = useSizes({ enabled });
  const countries = useCountries({ enabled });

  const queries = [sizes, countries];
  const isLoading = queries.some(query => query.status === 'loading');

  return { isLoading, queries };
};

export { useGlobalQuery, useCompany, useCountries, useSizes};
