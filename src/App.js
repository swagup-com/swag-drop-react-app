
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RedeemHome from './components/redeem/RedeemHome';
import Home from './Home';

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
