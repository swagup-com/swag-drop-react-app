

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
  list: id  => axios.get(`${swagDropServicesApiPaths.redemptions}${id ? `/${id}` : 'x'}`, { status200 }).then(rslt => rslt).catch(() => []),

  create: params => axios.post(swagDropServicesApiPaths.redemptions, params, status200or201).then(rslt => rslt.data).catch(() => "error")
};
