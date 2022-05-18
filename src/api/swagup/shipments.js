import axios from 'axios';
import _ from 'lodash';
import { errorAndLog } from '../../utils/utils';
import Dashboard from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { status201, status200 } from './status.utils';

// We should be able to avoid using a loop and change to
// a parallel approach after some changes in the api.
// For now, this works as expected without too much fuzz.
const sendSwag = async (orders, maxPayloadSize) => {
  const chunks = _.chunk(orders, maxPayloadSize);

  const results = [];

  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunks) {
      // eslint-disable-next-line no-await-in-loop
      const result = await Dashboard.post(apiPaths.employeeOrders, chunk, status201);
      results.push(result.data);
    }
  } catch (e) {
    return errorAndLog('sendSwag', e.status, e.data);
  }

  return results;
};

let cancelTokenSource;

export default { 
  sendSwag,
  async fetch({
    offset = 0,
    limit = 24,
    search = '',
    createdAt = 'all',
    statusIn,
    exportCSV,
    isCancellable = true,
    ...rest
  }) {
    if (cancelTokenSource) cancelTokenSource.cancel('Shipment request canceled due to new request');
    const commonParams = {
      search,
      created_at: createdAt,
      ordering: 'is_valid_address,-created_at',
      ...rest
    };
    const params = statusIn
      ? {
          status__in: statusIn,
          ...commonParams
        }
      : commonParams;
    // If the order of the params changes or some param is added or deleted,
    // then check the tests of the components that use this api call
    const config = exportCSV
      ? {
          headers: { Accept: 'text/csv' },
          params
        }
      : {
          params: {
            ...params,
            offset,
            limit
          }
        };

    cancelTokenSource = isCancellable ? axios.CancelToken.source() : null;
    const cancelToken = cancelTokenSource?.token;
    try {

      const result = await Dashboard.get(apiPaths.employeeOrders, { cancelToken, status200, ...config });
      cancelTokenSource = null;
      return result.data;
    }
    catch {
      return [];
    }
  }
 };
