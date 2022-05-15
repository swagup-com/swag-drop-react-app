import axios from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { errorAndLog, okAndLog } from '../../utils/utils';

export default {
  addContact: async contact =>
  axios.post(
    apiPaths.contacts,
    { ...contact, phone_number: contact.phone_number ?? '' },
    { validateStatus: status => status === 201 }
  )
    .then(({ status, data }) => {
      okAndLog('addEmployee', status, data);
      return data;
    })
    .catch(error => errorAndLog('addEmployee', error?.status, error?.data))
};
