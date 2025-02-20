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
        revalidateOnMount: true, // Refetches data on mount
      }}
    >
      <AuthProvider>{routing}</AuthProvider>
    </SWRConfig>
  );
}

export default App;
