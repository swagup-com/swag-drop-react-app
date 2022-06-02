

import swagDropServicesApiPaths from '../../utils/swagDropServicesApiPaths';
import axios from '../SwagDropServiceAPI';
import { status200, status200or201 } from '../swagup/status.utils';
export default {
  list: params => axios.get(swagDropServicesApiPaths.redeemPages, { status200 }).then(rslt => rslt).catch(() => []),

  get: slug => axios.get(swagDropServicesApiPaths.redeemPage(slug), { status200 }).then(rslt => rslt).catch(() => []),

  create: params => axios.post(swagDropServicesApiPaths.redeemPages, params, status200or201),

  update: (id, params) => axios.patch(swagDropServicesApiPaths.redeemPage(id), params),

  export: id => axios.get(swagDropServicesApiPaths.export(id))
};
