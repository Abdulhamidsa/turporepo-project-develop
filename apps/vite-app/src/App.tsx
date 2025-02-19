// src/App.tsx
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
        revalidateOnFocus: false, // Stops refetching when switching tabs (MONEY SAVER 💰)
        revalidateOnReconnect: false, // Stops refetching when internet reconnects
        refreshInterval: 0, // No auto-refreshing (manual fetch only)
        dedupingInterval: 60000, // Cache data for 1 min (adjust if needed)
        revalidateIfStale: false, // Prevents unnecessary re-fetching
        shouldRetryOnError: false, // Optional: No retries if API fails
      }}
    >
      <AuthProvider>{routing}</AuthProvider>
    </SWRConfig>
  );
}

export default App;
