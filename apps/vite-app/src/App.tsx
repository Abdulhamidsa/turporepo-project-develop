import { useRoutes } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { swrFetcher } from '../api/swrFetcher';
import { AuthProvider } from '../context/AuthContext';
import { appRoutes } from '../routes/appRoutes';

function App() {
  const routing = useRoutes(appRoutes);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true, // Stops refetching when switching tabs
        revalidateOnReconnect: true, // Stops refetching when internet reconnects
        refreshInterval: 0, // No auto-refreshing
        dedupingInterval: 0, // Cache data for 1 min
        revalidateIfStale: false, // Prevents unnecessary re-fetching
        shouldRetryOnError: false, // No retries if API fails
      }}
    >
      <AuthProvider>{routing}</AuthProvider>
    </SWRConfig>
  );
}

export default App;
