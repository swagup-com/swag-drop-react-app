import React from 'react';
import { AuthOktaProvider } from './AuthProvider';

const withAuth = (Component) => {
  const WrappedComponent = (props) => (
    <AuthOktaProvider>
      <Component {...props} />
    </AuthOktaProvider>
  );
  return WrappedComponent;
};

export default withAuth;
