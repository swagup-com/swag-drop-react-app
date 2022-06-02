
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@swagup-com/react-ds-components';
import RedeemHome from './components/redeem/RedeemHome';
import Home from './Home';
import { CssBaseline } from '@mui/material';
import RedeemPagesCreate from './components/redeem/RedeemPagesCreate';
import RedeemPagesHome from './components/redeem/RedeemPagesHome';
import HeaderWrapper from './components/shared/HeaderWrapper';
import RedeemPageHistory from './components/redeem/RedeemPageHistory';
import AuthProvider, { SecureRoute } from './components/authentication/AuthProvider';
import { LoginCallback, Security } from '@okta/okta-react';
import TokenInterceptor from './components/tokenInterceptor/TokenInterceptor';

const theme = createTheme();


const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false
  }
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <BrowserRouter>
        <AuthProvider>
        <TokenInterceptor>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/implicit/callback" element={<LoginCallback />}/>
                <Route path="/swag-drop/landings/:page" element={<RedeemHome />} exact/>
                <Route path="/swag-drop/redeems" element={<SecureRoute component={() => <HeaderWrapper component={RedeemPagesHome} />} />} />
                <Route path="/swag-drop/redeems-empty" element={<HeaderWrapper component={RedeemPagesHome} emptyState />} />
                <Route path="/swag-drop/redeems-create" element={<HeaderWrapper component={RedeemPagesCreate} />} exact/>
                <Route path="/swag-drop/redeems/:id" element={<HeaderWrapper component={RedeemPagesCreate} />} exact/>
                <Route path="/swag-drop/redeem-history/:id" element={<HeaderWrapper component={RedeemPageHistory} />} exact/>
              </Routes>
            </QueryClientProvider>
          </TokenInterceptor>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
