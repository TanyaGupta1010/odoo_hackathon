import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { appConfig } from "./config";
import "./styles/globals.css";

const API = "http://localhost:5001/api";

async function bootstrap() {
  // Pull the Google client ID from the backend (single source of truth).
  try {
    const res = await fetch(`${API}/config`);
    const json = await res.json();
    appConfig.googleClientId = json?.data?.googleClientId ?? "";
  } catch {
    // Backend unreachable — Google sign-in stays disabled, app still runs.
  }

  // Only mount the Google provider when a client ID is configured — an empty
  // one crashes Google's script and takes the whole app down.
  const tree = appConfig.googleClientId ? (
    <GoogleOAuthProvider clientId={appConfig.googleClientId}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <App />
  );

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>{tree}</React.StrictMode>
  );
}

bootstrap();
