import { Analytics } from '@vercel/analytics/react';
import { useRoutes } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { swrFetcher } from '../api/swrFetcher';
import { AuthProvider } from '../context/AuthContext';
import { appRoutes } from '../routes/appRoutes';
import BackToPortfolioButton from './components/BackToPortfolioButton';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const routing = useRoutes(appRoutes);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 30000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      <AuthProvider>
        <ScrollToTop />
        {routing}
        <Analytics />
        <BackToPortfolioButton />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
