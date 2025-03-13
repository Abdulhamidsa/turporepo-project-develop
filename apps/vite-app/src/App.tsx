import { useRoutes } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { swrFetcher } from '../api/swrFetcher';
import { AuthProvider } from '../context/AuthContext';
import { appRoutes } from '../routes/appRoutes';
import BackToPortfolioButton from './components/BackToPortfolioButton';

function App() {
  const routing = useRoutes(appRoutes);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 30000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      <AuthProvider>
        {routing}
        <BackToPortfolioButton />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
