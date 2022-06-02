import { useEffect, useContext } from 'react';
// import { useRouter } from 'next/router';
import { AuthContext } from '../authentication/AuthProvider';
import withAuth from '../authentication/withAuth';
import axios from '../../api/SwagDropServiceAPI';
import swagDropServicesApiPaths from '../../utils/swagDropServicesApiPaths';

const TokenInterceptor = ({ children }) => {
  const { login, oktaAuth } = useContext(AuthContext);
  // const router = useRouter();

  const addAuthInterceptor = (axiosInstance) => axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await oktaAuth.getAccessToken();
      const rToken = await oktaAuth.getRefreshToken();
      console.log('request interceptor, config:', rToken);
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

  useEffect(() => {
    
    const authInterceptor = addAuthInterceptor(axios);
    const errorInterceptor = addErrorInterceptor(axios);
    return () => {
      axios.interceptors.request.eject(authInterceptor);
      axios.interceptors.request.eject(errorInterceptor);
    };
  }, []);

  // const isAuthenticated = oktaAuth.isAuthenticated();
  // useEffect(() => {
  //   axios.get(`${swagDropServicesApiPaths.redeemPages}-xxx`).then(rslt => rslt).catch(() => [])
    
  // }, [isAuthenticated]);

  return children;
};

export default withAuth(TokenInterceptor);
