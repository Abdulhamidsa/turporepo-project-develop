// import { StrictMode } from "react";
import { ToastProvider } from '@repo/ui/components/ui/toaster';
import '@repo/ui/globals.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
    <ToastProvider />
  </BrowserRouter>,
  // </StrictMode>
);
