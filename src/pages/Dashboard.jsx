// src/pages/Dashboard.jsx
import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { Box, Toolbar, Typography, Grid, Paper, Divider } from '@mui/material'

// On importe nos deux composants réutilisables
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  
  // Largeur fixe du menu latéral
  const drawerWidth = 240

  // Au montage, on vérifie le cookie "loginSuccess" pour afficher un toast de succès
  useEffect(() => {
    const match = document.cookie.match(/(^| )loginSuccess=([^;]+)/)
    if (match) {
      enqueueSnackbar('Connexion réussie !', { variant: 'success' })
      // On supprime le cookie
      document.cookie = 'loginSuccess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }, [enqueueSnackbar, navigate])

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Composant barre latérale */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Composant topbar */}
      <Topbar drawerWidth={drawerWidth} />

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />

        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Bienvenue sur votre Password Manager
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#8b949e' }}>
          Gérez, générez et partagez vos mots de passe de manière sécurisée.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
              <Typography variant="h6">Mots de passe stockés</Typography>
              <Typography variant="h4">15</Typography>
              <Typography variant="body2">Total de mots de passe sécurisés</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
              <Typography variant="h6">Partages actifs</Typography>
              <Typography variant="h4">2</Typography>
              <Typography variant="body2">Mots de passe partagés</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
              <Typography variant="h6">Catégories</Typography>
              <Typography variant="h4">5</Typography>
              <Typography variant="body2">Organisation de vos accès</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
              <Typography variant="h6">Dernier audit</Typography>
              <Typography variant="h4">2023-09-25</Typography>
              <Typography variant="body2">Historique de sécurité</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Espace pour d'autres sections */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Liste des Mots de Passe (placeholder)
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
            <Typography>Prochainement : tableau listant les mots de passe stockés.</Typography>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Générateur de Mots de Passe (placeholder)
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: '#21262d', color: 'white' }}>
            <Typography>Prochainement : composant pour générer des mots de passe robustes.</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
