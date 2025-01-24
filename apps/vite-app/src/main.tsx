// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@repo/ui/globals.css";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@repo/ui/components/ui/toaster";
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
    <ToastProvider />
  </BrowserRouter>
  // </StrictMode>
);
