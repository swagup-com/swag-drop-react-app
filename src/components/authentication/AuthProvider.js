import React, {
  createContext, useEffect, useMemo, useCallback,
} from 'react';
import { useOktaAuth, Security } from '@okta/okta-react';
import SecureRoute from './SecureRoute';
import { OktaAuth } from '@okta/okta-auth-js';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthOktaProvider = ({ children }) => {
  const { authState, oktaAuth } = useOktaAuth();
  const { isAuthenticated, isPending } = authState || {};

  const login = useCallback(
    async (url) => {
      console.log('login url:', url);
      // authService.login(`${url || ''}`);
      oktaAuth.signInWithRedirect({
        prompt: 'consent',
        responseType: 'id_token',
        scopes: ['openid',  'offline_access']
      });
    },
    [oktaAuth],
  );

  const logout = useCallback(async () => oktaAuth.signOut('/'), [oktaAuth]);

  const registerUser = (user) => {
    console.log(user);
  };

  const getAndRegisterUser = async () => {
    try {
      const user = await oktaAuth.getUser();
      registerUser(user);
    } catch (ex) {
      console.log(`Expection: ${ex.name}`, ex);
      logout();
    }
  };

  useEffect(() => {
    if (oktaAuth.isAuthenticated()) {
      console.log('Calling registerUser');
      getAndRegisterUser();
    }
  }, [oktaAuth]);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      oktaAuth,
      isPending,
    }),
    [login, logout, isAuthenticated, oktaAuth, authState],
  );

  return <Provider value={value}>{children}</Provider>;
};

const restoreOriginalUri = async (oktaAuth, originalUri) => {
  window.location =  originalUri;
};
const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_ISSUER,
  clientId: process.env.REACT_APP_OKTA_CLIENTID,
  redirectUri: process.env.REACT_APP_OKTA_REDIRECTURI
});

const AuthProvider = ({ children }) => (
  <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
    {children}
  </Security>
);

export { AuthContext, AuthOktaProvider, SecureRoute };
export default AuthProvider;
