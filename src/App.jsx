// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Credentials from './pages/Credentials';

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
      </Routes>
    </Router>
  );
}

export default App;
