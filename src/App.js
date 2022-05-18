
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@swagup-com/react-ds-components';
import RedeemHome from './components/redeem/RedeemHome';
import Home from './Home';
import { CssBaseline } from '@mui/material';
import RedeemPagesCreate from './components/redeem/RedeemPagesCreate';
import RedeemPagesHome from './components/redeem/RedeemPagesHome';
import HeaderWrapper from './components/shared/HeaderWrapper';
import RedeemPageHistory from './components/redeem/RedeemPageHistory';

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
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/swag-drop/:company/:page" element={<RedeemHome />} exact/>
          <Route path="/swag-drop/redeems" element={<HeaderWrapper component={RedeemPagesHome} />} />
          <Route path="/swag-drop/redeems/:page" element={<HeaderWrapper component={RedeemPagesCreate} />} exact/>
          <Route path="/swag-drop/redeem-history/:page" element={<HeaderWrapper component={RedeemPageHistory} />} exact/>
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
