import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import NotesManagement from './pages/notes-management';
import UserManagement from './pages/user-management';
import Dashboard from './pages/dashboard';
import SubscriptionManagement from './pages/subscription-management';

const getUserFromStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const ProtectedRoute = ({ children }) => {
  const user = getUserFromStorage();
  return user ? children : <Navigate to="/login" replace />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes-management" element={<ProtectedRoute><NotesManagement /></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/subscription-management" element={<ProtectedRoute><SubscriptionManagement /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
