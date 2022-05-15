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

export default { sendSwag };
