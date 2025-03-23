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
  Grow
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ drawerWidth = 240 }) {
  const navigate = useNavigate()

  // État pour ouvrir/fermer le menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
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
      sx={{
        ml: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        backgroundColor: '#161b22',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          FireKey™
        </Typography>

        {/* Icône (Avatar) qui ouvre le menu */}
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          {/* Remplacez src="/default_profile.png" par le chemin réel de votre image */}
          <Avatar
            src="/default_profile.png"
            alt="Photo de profil"
            sx={{ width: 36, height: 36 }}
          />
        </IconButton>

        {/* Menu déroulant */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          // Transition
          TransitionComponent={Grow}
          // Position
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          // Style
          PaperProps={{
            sx: {
              backgroundColor: '#21262d',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          }}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
