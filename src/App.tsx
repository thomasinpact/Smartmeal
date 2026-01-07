import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import {
  OnboardingPage,
  LoginPage,
  PaywallPage,
  HomePage,
  GeneratePage,
  RecipePage,
  AccountPage,
  ContactPage,
} from './pages';
import { ToastContainer } from './components/ui';
import { RequireAuth } from './components/RequireAuth';
import { useAppStore } from './stores/useAppStore';

function App() {
  const { toasts, removeToast, initSession } = useAppStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/paywall"
              element={
                <RequireAuth>
                  <PaywallPage />
                </RequireAuth>
              }
            />
          </Route>

          <Route element={<AppLayout />}>
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              }
            />
            <Route
              path="/generate"
              element={
                <RequireAuth>
                  <GeneratePage />
                </RequireAuth>
              }
            />
            <Route
              path="/recipe/:id"
              element={
                <RequireAuth>
                  <RecipePage />
                </RequireAuth>
              }
            />
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />
            <Route
              path="/contact"
              element={
                <RequireAuth>
                  <ContactPage />
                </RequireAuth>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
