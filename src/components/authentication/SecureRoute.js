/*
 * 2020/03/27
 * This one is a fix, as the original SecureRoute don't spread/pass Route props to wrapped component
 */

/*
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useNavigate, Route } from 'react-router-dom';
import TokenInterceptor from '../tokenInterceptor/TokenInterceptor';

const RequireAuth = ({ children }) => {
  const [ signedIn, setSignedIn] = useState(false);
  const { oktaAuth } = useOktaAuth();
  // const navigate = useNavigate();
  useEffect(() => {
   const getAuthStatus = async () => {
      const isAuthenticated = await oktaAuth.isAuthenticated();
      if (!isAuthenticated) {
       
          const originalUri = window.location.pathname; // history.createHref(history.location);
          oktaAuth.signInWithRedirect({ originalUri });
        return null;
      }
      setSignedIn(true);
   };
   getAuthStatus();
  }, []);
  

  return <>{signedIn ? children : null}</>;
};

const SecureRoute = ({ component, ...props }) => {
  const WrappedComponent = (routeProps) => {
    const { render } = props;
    const C = component || (() => null);
    return <RequireAuth>{render ? render(routeProps) : <C {...routeProps} />}</RequireAuth>;
  };
  return <WrappedComponent />;
};

export default SecureRoute;
