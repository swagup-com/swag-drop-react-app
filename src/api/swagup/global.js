import axiosInstance from '../DashBoard';
import apiPaths from '../../utils/apiPaths';
import { status200 } from './status.utils';

export default {
  fetchAccount: () => axiosInstance.get(apiPaths.accounts, status200).then(response => response.data.results[0]),

  fetchCountries: (active = true) =>
    axiosInstance.get(apiPaths.countries, { params: { active }, ...status200 }).then(response => response.data.results),

  fetchSizes: () => axiosInstance.get(apiPaths.sizes, status200).then(response => response.data.results),
};
