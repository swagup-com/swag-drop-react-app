

import swagDropServicesApiPaths from '../../utils/swagDropServicesApiPaths';
import axios from '../SwagDropServiceAPI';
import { status200, status200or201 } from '../swagup/status.utils';

export default {
  address: address => axios.post(swagDropServicesApiPaths.verifyAddress, address, status200or201)
  .then(rslt => rslt.data).catch(err => err.response?.data || err.message),

  names: param => axios.post(swagDropServicesApiPaths.verifyName, param, status200or201)
  .then(rslt => rslt.data).catch(err => err.response?.data || err.message)
};
