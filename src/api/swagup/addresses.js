import axios from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { status201 } from './status.utils';

export default {
  validate: async addresses =>
    axios
      .post(apiPaths.addresses, addresses, status201)
      .then(({ status }) => ({ result: 'ok', status }))
      .catch(({ status, data }) => ({ result: 'error', status, data }))
};
