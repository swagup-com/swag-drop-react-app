
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@swagup-com/react-ds-components';
import RedeemHome from './components/redeem/RedeemHome';
import Home from './Home';
import { CssBaseline } from '@mui/material';

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
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
