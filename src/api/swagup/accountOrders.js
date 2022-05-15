import axios from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { status200 } from './status.utils';

export default {
  fetch: id => axios.get(`${apiPaths.accountOrders}${id}/`).then(response => response.data),

  fetchOrders: query => axios.get(`${apiPaths.accountOrders}?${query}`, status200).then(response => response.data)
};