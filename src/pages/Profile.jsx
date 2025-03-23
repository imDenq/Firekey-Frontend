// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Chip,
  Tabs,
  Tab
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import ProfileSection from '../components/accsettings/ProfileSection'
import SecuritySection from '../components/accsettings/SecuritySection'
import NotificationsSection from '../components/accsettings/NotificationsSection'
import StatisticsSection from '../components/accsettings/StatisticsSection'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SecurityIcon from '@mui/icons-material/Security'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AnalyticsIcon from '@mui/icons-material/Analytics'

export default function Profile() {
  const drawerWidth = 240
  const { enqueueSnackbar } = useSnackbar()
  const [tabValue, setTabValue] = useState(0);

  const [userInfo, setUserInfo] = useState({
    username: 'thomas_dupont',
    email: 'thomas.dupont@example.com',
    profilePic: '/default_profile.png',
    fullName: 'Thomas Dupont',
    joinDate: '12 Janvier 2023',
    language: 'Français',
    twoFactorEnabled: true
  })

  const [stats, setStats] = useState({
    credentialsCount: 14,
    lastLogin: '21 Mars 2025, 15:32',
    sessionsCount: 3,
    storageUsed: '256 Mo / 2 Go'
  })

  const accessToken = localStorage.getItem('accessToken') || ''

  useEffect(() => {
    fetchUserInfo()
    fetchCredentialsCount()
  }, [])

  // Récupérer infos de l'utilisateur
  const fetchUserInfo = async () => {
    try {
      // Exemple d'endpoint GET /api/user/me/
      const res = await fetch('http://localhost:8001/api/user/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!res.ok) {
        throw new Error('Impossible de récupérer les informations utilisateur')
      }
      const data = await res.json()
      setUserInfo(prev => ({
        ...prev,
        username: data.username,
        email: data.email,
        profilePic: data.profile_pic || '/default_profile.png'
      }))
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Erreur lors du chargement du profil', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
    }
  }

  // Récupérer le nombre de credentials
  const fetchCredentialsCount = async () => {
    try {
      // Soit on récupère la liste et on compte, soit un endpoint direct /count
      const res = await fetch('http://localhost:8001/api/credentials/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!res.ok) {
        throw new Error('Impossible de récupérer la liste des credentials')
      }
      const data = await res.json()
      setStats(prev => ({
        ...prev,
        credentialsCount: data.length
      }))
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Erreur lors du chargement des statistiques', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      {/* Barre latérale */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />

        {/* Zone de contenu - avec padding top pour éviter le chevauchement avec Topbar */}
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 1 }}>
                Paramètres du compte
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                Gérez vos informations personnelles et vos préférences
              </Typography>
            </Box>
            <Chip 
              label={`Membre depuis ${userInfo.joinDate}`} 
              color="primary" 
              variant="outlined" 
              sx={{ borderRadius: 3, py: 1, px: 1 }}
            />
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.12)', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  color: '#b0b0b0',
                  '&.Mui-selected': {
                    color: '#90caf9'
                  }
                }
              }}
            >
              <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Profil" />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Sécurité" />
              <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
              <Tab icon={<AnalyticsIcon />} iconPosition="start" label="Statistiques" />
            </Tabs>
          </Box>

          {/* Onglets de contenu */}
          {tabValue === 0 && <ProfileSection userInfo={userInfo} setUserInfo={setUserInfo} enqueueSnackbar={enqueueSnackbar} accessToken={accessToken} />}
          {tabValue === 1 && <SecuritySection userInfo={userInfo} setUserInfo={setUserInfo} enqueueSnackbar={enqueueSnackbar} accessToken={accessToken} />}
          {tabValue === 2 && <NotificationsSection enqueueSnackbar={enqueueSnackbar} />}
          {tabValue === 3 && <StatisticsSection stats={stats} />}
        </Container>
      </Box>
    </Box>
  )
}