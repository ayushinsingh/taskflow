import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.tsx";
import { SignupPage } from "./pages/SignupPage.tsx";
import { ProtectedRoute } from "./pages/ProtectedRoute.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { InvitationPage } from "./pages/InvitationPage.tsx";
import { MembersPage } from "./pages/MembersPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/invitations" element={<InvitationPage />}></Route>
            <Route path="/workspaces/:workspaceId" element={<App />}></Route>
            <Route
              path="/workspaces/:workspaceId/members"
              element={<MembersPage />}
            ></Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
