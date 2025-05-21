// src/pages/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log("Token à vérifier:", token ? `${token.substring(0, 15)}...` : "Aucun token");
        
        if (!token) {
          console.log("Aucun token trouvé");
          setLoading(false);
          return;
        }

        // Vérifier le token en appelant un endpoint protégé
        const response = await fetch('http://localhost:8001/auth/protected/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Réponse de vérification:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Données de la réponse:", data);
          setIsValid(true);
        } else {
          console.log("Token invalide, tentative de refresh");
          
          // Si le token est expiré, essayer de le rafraîchir
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const refreshResponse = await fetch('http://localhost:8001/auth/token/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                refresh: refreshToken
              })
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              
              if (refreshData.access) {
                console.log("Token rafraîchi avec succès");
                localStorage.setItem('accessToken', refreshData.access);
                setIsValid(true);
              } else {
                console.log("Refresh token valide mais pas de nouveau token d'accès");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
              }
            } else {
              console.log("Échec du rafraîchissement du token");
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } else {
            console.log("Pas de refresh token disponible");
            localStorage.removeItem('accessToken');
          }
        }
      } catch (err) {
        console.error('Erreur de vérification token:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          backgroundColor: '#121212',
          color: 'white'
        }}
      >
        <CircularProgress color="primary" size={50} thickness={4} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Vérification de votre session...
        </Typography>
      </Box>
    );
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}