// src/pages/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    // Vérifier le token en appelant un endpoint protégé
    fetch('http://127.0.0.1:8001/auth/protected/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (res.ok) {
          setIsValid(true);
        } else {
          // Token invalide ou expiré
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      })
      .catch((err) => {
        console.error('Erreur de vérification token:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: 'white' }}>Vérification du token en cours...</div>;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}
