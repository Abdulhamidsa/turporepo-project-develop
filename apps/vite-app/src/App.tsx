// src/App.tsx
import { useRoutes } from "react-router-dom";
import { appRoutes } from "../routes/appRoutes";
import { AuthProvider } from "../context/AuthContext";
import { SWRConfig } from "swr";
import { swrFetcher } from "../api/swrFetcher";

function App() {
  const routing = useRoutes(appRoutes);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true,
        // dedupingInterval: Infinity, // Cache data for 1 minute
        // revalidateIfStale: false, // Do not re-fetch stale data
        // shouldRetryOnError: false, // Optional: Disable retries on error
      }}
    >
      <AuthProvider>{routing}</AuthProvider>
    </SWRConfig>
  );
}

export default App;
