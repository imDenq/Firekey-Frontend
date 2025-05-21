// src/components/Topbar.jsx
import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grow,
  Box,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  useTheme,
  Popover,
  CircularProgress
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import SecurityIcon from '@mui/icons-material/Security'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import NotificationsList from './notifications/NotificationsList'
import { styled, alpha } from '@mui/material/styles'

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 0,
    padding: '0 4px',
    backgroundColor: '#f44336',
    color: '#ffffff',
    minWidth: 16,
    height: 16,
    fontSize: '0.6rem',
    borderRadius: 8,
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    minWidth: 220,
    color: '#ffffff',
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      '&:hover': {
        backgroundColor: alpha('#90caf9', 0.1),
      },
      '&.Mui-selected': {
        backgroundColor: alpha('#90caf9', 0.15),
      },
    },
    '& .MuiDivider-root': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      margin: '8px 0',
    },
  },
}));

const StyledNotificationsPanel = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    minWidth: 320,
    maxWidth: 400,
    width: '90vw',
    maxHeight: '80vh',
    overflowY: 'hidden',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

export default function Topbar({ drawerWidth = 240 }) {
  const navigate = useNavigate()
  const theme = useTheme()

  // État pour ouvrir/fermer le menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchor, setNotificationAnchor] = useState(null)
  const open = Boolean(anchorEl)
  const notificationsOpen = Boolean(notificationAnchor)
  
  // Nouveaux états pour les informations utilisateur
  const [userName, setUserName] = useState('Utilisateur')
  const [userEmail, setUserEmail] = useState('exemple@domaine.com')
  const [profilePic, setProfilePic] = useState('/default_profile.png')
  
  // État pour le nombre de notifications non lues
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // Récupérer les informations utilisateur au chargement du composant
  useEffect(() => {
    fetchUserInfo()
    fetchUnreadNotificationsCount()
    
    // Mettre à jour le compteur de notifications toutes les 60 secondes
    const intervalId = setInterval(fetchUnreadNotificationsCount, 60000);
    
    // Nettoyer l'intervalle à la destruction du composant
    return () => clearInterval(intervalId);
  }, [])

  // Fonction pour récupérer les informations utilisateur
  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return
      
      const res = await fetch('http://localhost:8001/auth/users/me/', {
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
      
      // Mettre à jour le nom et l'email
      setUserName(data.profile?.fullName || data.username || 'Utilisateur')
      setUserEmail(data.email || 'exemple@domaine.com')
      
      // Mettre à jour la photo de profil avec anti-cache
      if (data.profile?.profile_pic) {
        let profilePicUrl = data.profile.profile_pic
        if (!profilePicUrl.startsWith('http')) {
          const timestamp = new Date().getTime()
          profilePicUrl = `http://localhost:8001${profilePicUrl}?t=${timestamp}`
        }
        console.log('URL photo de profil dans Topbar:', profilePicUrl)
        setProfilePic(profilePicUrl)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
    }
  }
  
  // Fonction pour récupérer le nombre de notifications non lues
  const fetchUnreadNotificationsCount = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return
      
      setLoadingNotifications(true)
      
      const res = await fetch('http://localhost:8001/notifications/notifications/unread_count/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!res.ok) {
        throw new Error('Impossible de récupérer le compteur de notifications')
      }
      
      const data = await res.json()
      setUnreadNotificationsCount(data.count || 0)
    } catch (error) {
      console.error('Erreur lors de la récupération du compteur de notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsOpen = (event) => {
    setNotificationAnchor(event.currentTarget)
  }
  
  const handleNotificationsClose = () => {
    setNotificationAnchor(null)
    // Mettre à jour le compteur après fermeture, en cas de modification
    fetchUnreadNotificationsCount()
  }

  // Gérer le clic sur "Profile"
  const handleProfile = () => {
    handleMenuClose()
    // Naviguer vers la page profile
    navigate('/profile')
  }

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    handleMenuClose()
    navigate('/')
  }
  
  // Gérer la navigation vers la page de notifications
  const handleViewAllNotifications = () => {
    handleNotificationsClose()
    navigate('/notifications')
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        ml: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        backgroundColor: '#121212',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: 70 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              background: "linear-gradient(45deg,rgb(57, 139, 206) 20%,rgb(187, 19, 238) 90%)",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem',
              mr: 2
            }}
          >
            FireKey™
          </Typography>
           */}
          {/* <Chip 
            label="BETA" 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{
              mb: -0.7,
              ml: -1, 
              height: 22, 
              fontSize: '0.7rem', 
              fontWeight: 'bold',
              color: '#90caf9',
              borderColor: 'rgba(144, 202, 249, 0.5)'
            }} 
          /> */}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Aide & Support">
            <IconButton 
              size="large" 
              color="inherit"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } 
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 22, color: '#b0b0b0' }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              size="large" 
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ 
                backgroundColor: notificationsOpen ? 'rgba(144, 202, 249, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                '&:hover': { backgroundColor: notificationsOpen ? 'rgba(144, 202, 249, 0.25)' : 'rgba(255, 255, 255, 0.08)' } 
              }}
            >
              {loadingNotifications ? (
                <CircularProgress size={20} sx={{ color: '#b0b0b0' }} />
              ) : (
                <NotificationBadge 
                  badgeContent={unreadNotificationsCount} 
                  color="error"
                  invisible={unreadNotificationsCount === 0}
                >
                  <NotificationsIcon sx={{ fontSize: 22, color: notificationsOpen ? '#90caf9' : '#b0b0b0' }} />
                </NotificationBadge>
              )}
            </IconButton>
          </Tooltip>

          <Box sx={{ ml: 1, mr: 0.5 }}>
            <Tooltip title="Paramètres du profil">
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  p: 0.5,
                  border: open ? '2px solid #90caf9' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar
                    src={profilePic}
                    alt="Photo de profil"
                    sx={{ 
                      width: 36, 
                      height: 36,
                      transition: 'all 0.2s',
                      transform: open ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                </StyledBadge>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Menu déroulant utilisateur */}
          <StyledMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            TransitionComponent={Grow}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 1.5 }}
          >
            <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
              <Avatar
                src={profilePic}
                alt="Photo de profil"
                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                {userName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                {userEmail}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: '#90caf9' }} />
              </ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: '#90caf9' }} />
              </ListItemIcon>
              <ListItemText>Paramètres</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => navigate('/credentials')}>
              <ListItemIcon>
                <SecurityIcon fontSize="small" sx={{ color: '#90caf9' }} />
              </ListItemIcon>
              <ListItemText>Mes Credentials</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
              </ListItemIcon>
              <ListItemText sx={{ color: '#f44336' }}>Déconnexion</ListItemText>
            </MenuItem>
          </StyledMenu>

          {/* Panneau des notifications */}
          <StyledNotificationsPanel
            open={notificationsOpen}
            anchorEl={notificationAnchor}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationsList onClose={handleViewAllNotifications} />
          </StyledNotificationsPanel>
        </Box>
      </Toolbar>
    </AppBar>
  )
}