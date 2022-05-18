import * as React from 'react';
import { useMatch, useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import useQueryParams from './useQueryParams';
import log from '../utils/logger';

const perPageDefaults = [25, 50, 75, 100];

const pageAndPerPageFromQuery = (query, defaultPerPage) => {
  const p = query.get('page');
  const pp = query.get('per_page');

  const page = +p > 0 ? +p - 1 : 0;
  const perPage = pp ? +pp : defaultPerPage;

  return [page, perPage];
};

const clampPerPage = (perPageOptions, perPage) => {
  const insertionPlace = _.sortedLastIndex(
    perPageOptions.sort((a, b) => a - b),
    perPage
  );
  return perPageOptions[Math.max(0, insertionPlace - 1)];
};

const setQuery = (query, page, clampedPerPage) => {
  query.set('page', page + 1);
  query.set('per_page', clampedPerPage);
};

const getLastPage = (total, perPage) => Math.max(0, Math.ceil(total / perPage) - 1);

const useLocationBuilder = () => {
  const query = useQueryParams();
  // const { pathname } = useMatch();
  const { state, pathname } = useLocation();
  return React.useMemo(
    () => (page, lastPage, perPage) => {
      query.set('page', Math.max(0, Math.min(page, lastPage)) + 1);
      if (perPage) query.set('per_page', perPage);
      const search = `?${query}`;
      return { pathname: pathname, search, state };
    },
    [query, pathname, state]
  );
};

const whatPage = (page, lastPage, perPage, clampedPerPage) => {
  if (page < 1) return 0;
  if (page > lastPage) return lastPage;
  if (perPage !== clampedPerPage) return page;
  return null;
};

const usePagination = (total, perPageArg) => {
  const query = useQueryParams();

  const perPageOptions = _.isEmpty(perPageArg) ? perPageDefaults : perPageArg;
  const [page, perPage] = pageAndPerPageFromQuery(query, perPageOptions[0]);
  const clampedPerPage = clampPerPage(perPageOptions, perPage);
  const lastPage = getLastPage(total, clampedPerPage);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  log.debug('page:', page, 'pathname:', pathname, 'lastPage:', lastPage);
  log.debug('per_page:', perPage, 'search:', query.toString(), 'total:', total);

  setQuery(query, page, clampedPerPage);
  const locationForPage = useLocationBuilder();
  React.useEffect(() => {
    if (total > 0) {
      const p = whatPage(page, lastPage, perPage, clampedPerPage);
      if (p !== null) navigate(locationForPage(p, lastPage, perPage));
    }
  }, [total, page, lastPage, perPage, clampedPerPage, navigate, locationForPage]);

  const setPerPage = newPerPage => {
    const properPerPage = Math.floor((page * clampedPerPage) / newPerPage);
    if (properPerPage !== perPage) {
      const newLastPage = getLastPage(total, newPerPage);

      navigate(locationForPage(page, newLastPage, clampPerPage(perPageOptions, newPerPage)));
    }
  };

  const prevPage = locationForPage(page - 1, lastPage, clampedPerPage);
  const nextPage = locationForPage(page + 1, lastPage, clampedPerPage);
  const setPageIndex = React.useCallback(idx => navigate(locationForPage(idx, lastPage, clampedPerPage)), [
    clampedPerPage,
    navigate,
    lastPage,
    locationForPage
  ]);

  return {
    nextPage,
    pageIndex: page,
    perPage: clampedPerPage,
    sizeOptions: perPageOptions,
    previousPage: prevPage,
    changeSize: setPerPage,
    setPageIndex
  };
};

export default usePagination;
