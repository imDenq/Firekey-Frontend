// src/components/Topbar.jsx
import React, { useState } from 'react'
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
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import SecurityIcon from '@mui/icons-material/Security'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import DarkModeIcon from '@mui/icons-material/DarkMode'
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

export default function Topbar({ drawerWidth = 240 }) {
  const navigate = useNavigate()
  const theme = useTheme()

  // État pour ouvrir/fermer le menu
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchor, setNotificationAnchor] = useState(null)
  const open = Boolean(anchorEl)
  const notificationsOpen = Boolean(notificationAnchor)

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
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              background: 'linear-gradient(90deg, #90caf9 0%, #64b5f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.5rem',
              mr: 2
            }}
          >
            FireKey™
          </Typography>
          
          <Chip 
            label="BETA" 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ 
              height: 22, 
              fontSize: '0.7rem', 
              fontWeight: 'bold',
              color: '#90caf9',
              borderColor: 'rgba(144, 202, 249, 0.5)'
            }} 
          />
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
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } 
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon sx={{ fontSize: 22, color: '#b0b0b0' }} />
              </Badge>
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
                    src="/default_profile.png"
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
                src="/default_profile.png"
                alt="Photo de profil"
                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Thomas Dupont
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                thomas.dupont@example.com
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

          {/* Menu des notifications */}
          <StyledMenu
            anchorEl={notificationAnchor}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            TransitionComponent={Grow}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 1.5 }}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                Notifications
              </Typography>
              <Chip 
                label="3 nouvelles" 
                size="small" 
                color="primary" 
                sx={{ height: 24, fontSize: '0.75rem' }} 
              />
            </Box>

            <Divider />

            <MenuItem>
              <Box sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Mot de passe faible détecté
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
                  Mettez à jour le credential "Gmail" avec un mot de passe plus fort
                </Typography>
                <Typography variant="caption" sx={{ color: '#90caf9', fontSize: '0.7rem' }}>
                  il y a 5 minutes
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem>
              <Box sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Nouvelle connexion détectée
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
                  Connexion depuis Paris, France sur Chrome
                </Typography>
                <Typography variant="caption" sx={{ color: '#90caf9', fontSize: '0.7rem' }}>
                  aujourd'hui à 15:45
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem>
              <Box sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff' }}>
                  Mise à jour du système
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
                  FireKey a été mis à jour vers la version 2.1.0
                </Typography>
                <Typography variant="caption" sx={{ color: '#90caf9', fontSize: '0.7rem' }}>
                  il y a 2 jours
                </Typography>
              </Box>
            </MenuItem>

            <Divider />

            <Box sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#90caf9',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleNotificationsClose}
              >
                Voir toutes les notifications
              </Typography>
            </Box>
          </StyledMenu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}