// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Credentials from './pages/Credentials';
import SharedCredential from './pages/SharedCredential';
import ShareManager from './pages/ShareManager';
import NotificationsPage from './pages/Notifications';
import ImportExport from './pages/ImportExport';

// IMPORTER Profile
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page de login/register (flip) */}
        <Route path="/" element={<Login />} />

        {/* Page Dashboard protégée */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Page Credentials protégée */}
        <Route
          path="/credentials"
          element={
            <ProtectedRoute>
              <Credentials />
            </ProtectedRoute>
          }
        />

        {/* Page Profile protégée */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Page Shares protégée */}
        <Route
          path="/shares"
          element={
            <ProtectedRoute>
              <ShareManager />
            </ProtectedRoute>
          }
        />

        {/* Page de Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Page d'Import/Export */}
        <Route
          path="/import-export"
          element={
            <ProtectedRoute>
              <ImportExport />
            </ProtectedRoute>
          }
        />

        {/* Page pour accéder à un credential partagé - accessible sans authentification */}
        <Route path="/share/:shareId/:accessKey" element={<SharedCredential />} />


      </Routes>
    </Router>
  );
}

export default App;
