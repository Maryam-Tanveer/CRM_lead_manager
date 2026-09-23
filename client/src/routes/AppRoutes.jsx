import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute restricted={true}>
            <AuthPage initialMode="login" />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute restricted={true}>
            <AuthPage initialMode="register" />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
