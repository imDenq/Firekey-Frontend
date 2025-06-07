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
  const [tabValue, setTabValue] = useState(0)

  // On initialise userInfo de façon neutre
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    profilePic: '/default_profile.png',
    fullName: '',
    joinDate: '', // Date vide initialement
    language: 'Français',
    twoFactorEnabled: false
  })

  // Stats
  const [stats, setStats] = useState({
    credentialsCount: 0,
    lastLogin: '',
    sessionsCount: 0,
    storageUsed: 'N/A'
  })

  const accessToken = localStorage.getItem('accessToken') || ''

  useEffect(() => {
    fetchUserInfo()
    fetchCredentialsCount()
  }, [])

  // Fonction auxiliaire pour formater la date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date inconnue";
    }
  }

  // 1) Récupérer infos de l'utilisateur
  const fetchUserInfo = async () => {
    try {
      const res = await fetch('https://firekey.theokaszak.fr/auth/users/me/', {
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
      // data = { username, email, profile: { fullName, language, profile_pic } } ou profile = null
  
      // Ajouter un paramètre anti-cache pour l'URL de la photo
      let profilePicUrl = data.profile?.profile_pic || '/default_profile.png';
      if (profilePicUrl && !profilePicUrl.startsWith('/default_profile.png')) {
        // Si c'est déjà une URL complète, on garde cette URL
        if (!profilePicUrl.startsWith('http')) {
          // Sinon on ajoute le préfixe de l'API et un paramètre anti-cache
          const timestamp = new Date().getTime();
          profilePicUrl = `https://firekey.theokaszak.fr${profilePicUrl}?t=${timestamp}`;
        }
      }
      
      console.log("URL de profile_pic récupérée:", profilePicUrl);
      
      // Formater la date de création si disponible
      let formattedJoinDate = 'Date inconnue';
      if (data.date_joined) {
        formattedJoinDate = formatDate(data.date_joined);
      }
      
      // Si date_joined n'est pas disponible, on essaie de récupérer la date de création
      // à partir de l'API d'audit pour obtenir le premier événement lié à l'utilisateur
      if (!data.date_joined) {
        fetchUserAuditLog();
      }
  
      setUserInfo((prev) => ({
        ...prev,
        username: data.username || '',
        email: data.email || '',
        profilePic: profilePicUrl,
        fullName: data.profile?.fullName || '',
        language: data.profile?.language || 'Français',
        joinDate: formattedJoinDate
      }))
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Erreur lors du chargement du profil', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      })
    }
  }
  
  // Récupérer les logs d'audit pour trouver la première activité de l'utilisateur
  const fetchUserAuditLog = async () => {
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/security/audit_log/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!res.ok) {
        throw new Error('Impossible de récupérer les logs d\'audit');
      }
      
      const logs = await res.json();
      
      // Chercher l'événement le plus ancien
      if (logs && logs.length > 0) {
        // Trier les logs par date (au cas où ils ne seraient pas déjà triés)
        logs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
        // Utiliser la date du premier log comme approximation de la date de création
        const oldestLog = logs[logs.length - 1]; // Le dernier est le plus ancien si trié par ordre décroissant
        
        if (oldestLog && oldestLog.created_at) {
          const formattedDate = formatDate(oldestLog.created_at);
          
          setUserInfo(prev => ({
            ...prev,
            joinDate: formattedDate
          }));
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des logs d'audit:", err);
      // Pas d'affichage d'erreur à l'utilisateur car c'est une tentative de fallback
    }
  }

  // 2) Récupérer le nombre de credentials
  const fetchCredentialsCount = async () => {
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/credentials/', {
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
      setStats((prev) => ({
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

  // Gestion onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />
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
              label={`Membre depuis ${userInfo.joinDate || 'date inconnue'}`}
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

          {/* Contenu des onglets */}
          {tabValue === 0 && (
            <ProfileSection
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              enqueueSnackbar={enqueueSnackbar}
              accessToken={accessToken}
            />
          )}
          {tabValue === 1 && (
            <SecuritySection
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              enqueueSnackbar={enqueueSnackbar}
              accessToken={accessToken}
            />
          )}
          {tabValue === 2 && <NotificationsSection enqueueSnackbar={enqueueSnackbar} />}
          {tabValue === 3 && <StatisticsSection stats={stats} />}
        </Container>
      </Box>
    </Box>
  )
}