import axios from '../DashBoard';
import { status200, status200or201 } from '../swagup/status.utils';

const defaultPath = 'https://www.solutiontriangle.com/backend/ajax/redeem/';
const apiPaths = {
  list: `${defaultPath}list.php`,
  get: `${defaultPath}get.php`,
  getbyslug: `${defaultPath}getbyslug.php`,
  create: `${defaultPath}create.php`,
  update: `${defaultPath}update.php`,
  delete: `${defaultPath}delete.php`
};
const convert = d => ({
  ...d,
  id: parseInt(d.id, 10),
  products: JSON.parse(d.products),
  theme: JSON.parse(d.theme),
  allowInternationalShipping: parseInt(d.allowInternationalShipping, 10)
});
const convertToObject = data => data.map(d => convert(d));

export default {
  list: params => axios.get(apiPaths.list, { status200, params }).then(rslt => convertToObject(rslt.data)),

  get: id => axios.get(apiPaths.get, { status200, params: { id } }).then(rslt => convert(rslt.data)),

  getbyslug: slug => axios.get(apiPaths.getbyslug, { status200, params: { slug } }).then(rslt => convert(rslt.data)),

  create: params => axios.post(apiPaths.create, params, status200or201),

  update: params => axios.post(apiPaths.update, params, status200or201),

  delete: id => axios.post(apiPaths.delete, { id }, status200or201)
};
