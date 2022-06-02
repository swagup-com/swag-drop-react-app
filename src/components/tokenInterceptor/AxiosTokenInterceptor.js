import { useEffect, useContext } from 'react';
// import { useRouter } from 'next/router';
import { AuthContext } from '../authentication/AuthProvider';
import withAuth from '../authentication/withAuth';

const AxiosTokenInterceptor = ({ axios }) => {
  const { login, oktaAuth } = useContext(AuthContext);
  // const router = useRouter();

  const addAuthInterceptor = (axiosInstance) => axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await oktaAuth.getAccessToken();
      console.log('request interceptor, config:', config);
      return token
        ? {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          },
        }
        : config;
    },
    (error) => Promise.reject(error),
  );

  const addErrorInterceptor = (axiosInstance) => axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('response interceptor, error:', error, 'error.response:', error.response);
      if (error.response && error.response.status === 401) {
        return login(window.location.pathname);
      }
      return Promise.reject(error.response || error);
    },
  );

    
  const authInterceptor = addAuthInterceptor(axios);
  const errorInterceptor = addErrorInterceptor(axios);
  axios.interceptors.request.eject(authInterceptor);
  axios.interceptors.request.eject(errorInterceptor);

  return axios;
};

export default AxiosTokenInterceptor;
