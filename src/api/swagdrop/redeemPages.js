

import swagDropServicesApiPaths from '../../utils/swagDropServicesApiPaths';
import axios from '../SwagDropServiceAPI';
import { status200, status200or201 } from '../swagup/status.utils';

// const baseURL = 'https://swagdrop-service.dev.swagup.ninja/api/v1';
// export default {
//   list: () => fetch(`${baseURL}${swagDropServicesApiPaths.redeemPages}`, {
//     mode: 'no-cors' // 'cors' by default
//   })
//   .then(response => response).catch(() => [])
// };

export default {
  list: params => axios.get(swagDropServicesApiPaths.redeemPages, { status200 }).then(rslt => rslt).catch(() => []),

  get: slug => axios.get(swagDropServicesApiPaths.redeemPage(slug), { status200 }).then(rslt => rslt).catch(() => []),

  create: params => axios.post(swagDropServicesApiPaths.redeemPages, params, status200or201),

  update: (id, params) => axios.patch(swagDropServicesApiPaths.redeemPage(id), params),
};
