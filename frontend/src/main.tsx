import { StrictMode, Suspense } from "react";
import LoadingPage from "./pages/LoadingPage";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";

  if (message.includes("Transition was skipped")) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<LoadingPage />}>
      <App />
    </Suspense>
  </StrictMode>,
);
