// src/components/Sidebar.jsx
import React from 'react'
import {
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Password,
  History,
  Category,
  Share,
  Lock,
  ExitToApp
} from '@mui/icons-material'

export default function Sidebar({ drawerWidth = 240 }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#161b22',
          color: 'white'
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
          Menu
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: '#30363d' }} />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Lock sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Credentials" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Password sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Générateur" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Share sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Partage Sécurisé" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Category sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Catégories" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <History sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Audit & Historique" />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <ExitToApp sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Import/Export" />
        </ListItem>
      </List>
    </Drawer>
  )
}
