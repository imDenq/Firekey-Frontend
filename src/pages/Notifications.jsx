// src/pages/Notifications.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
  Paper,
  Menu,
  MenuItem,
  Fade,
  Alert
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Composants réutilisables
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

// Styled components
const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 6px 16px rgba(0, 0, 0, 0.25)' : 'none',
    transform: 'translateY(-2px)'
  }
}));

const EmptyNotificationBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 24px',
  backgroundColor: '#1e1e1e',
  borderRadius: 12,
  textAlign: 'center',
  height: '50vh',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
}));

// Fonction pour sélectionner l'icône en fonction du niveau de la notification
const getNotificationIcon = (level) => {
  switch (level) {
    case 'success':
      return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />;
    case 'warning':
      return <WarningIcon sx={{ color: '#ff9800', fontSize: '1.2rem' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: '#f44336', fontSize: '1.2rem' }} />;
    case 'info':
    default:
      return <InfoIcon sx={{ color: '#2196f3', fontSize: '1.2rem' }} />;
  }
};

// Couleur de l'avatar en fonction du niveau
const getAvatarColor = (level) => {
  switch (level) {
    case 'success':
      return alpha('#4caf50', 0.15);
    case 'warning':
      return alpha('#ff9800', 0.15);
    case 'error':
      return alpha('#f44336', 0.15);
    case 'info':
    default:
      return alpha('#2196f3', 0.15);
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Largeur fixe du menu latéral
  const drawerWidth = 240;
  const accessToken = localStorage.getItem('accessToken') || '';

  // Options de filtre
  const filterOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'unread', label: 'Non lues' },
    { value: 'read', label: 'Lues' },
    { value: 'success', label: 'Succès' },
    { value: 'info', label: 'Informations' },
    { value: 'warning', label: 'Avertissements' },
    { value: 'error', label: 'Erreurs' }
  ];

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    handleFilterClose();
    applyFilter(filter);
  };

  const applyFilter = (filter) => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.filter(notif => !notif.read));
    } else if (filter === 'read') {
      setFilteredNotifications(notifications.filter(notif => notif.read));
    } else {
      // Filtrer par niveau
      setFilteredNotifications(notifications.filter(notif => notif.level === filter));
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Appliquer le filtre quand les notifications changent
  useEffect(() => {
    applyFilter(activeFilter);
  }, [notifications]);

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/notifications/notifications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications');
      }

      const data = await response.json();
      
      let notificationsList = [];
      if (Array.isArray(data)) {
        notificationsList = data;
      } else if (data.results && Array.isArray(data.results)) {
        notificationsList = data.results;
        // Si l'API utilise la pagination
        if (data.count && data.page_size) {
          setTotalPages(Math.ceil(data.count / data.page_size));
        }
      }
      
      setNotifications(notificationsList);
      const unread = notificationsList.filter(notification => !notification.read).length;
      setUnreadCount(unread);
      
      // Initialiser les notifications filtrées
      applyFilter(activeFilter);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8001/notifications/notifications/${notificationId}/mark_as_read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage de la notification');
      }

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:8001/notifications/notifications/mark_all_as_read/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du marquage des notifications');
      }

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      // Mettre à jour le compteur
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Supprimer les notifications lues
  const clearReadNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8001/notifications/notifications/clear_all/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression des notifications');
      }

      // Mettre à jour l'état local (ne garder que les non lues)
      setNotifications(prev => prev.filter(notif => !notif.read));
      applyFilter(activeFilter);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8001/notifications/notifications/${notificationId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la notification');
      }

      // Mettre à jour l'état local
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Mettre à jour le compteur si la notification supprimée n'était pas lue
      const wasUnread = notifications.find(notif => notif.id === notificationId)?.read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
        <Sidebar drawerWidth={drawerWidth} />
        <Box sx={{ flexGrow: 1 }}>
          <Topbar drawerWidth={drawerWidth} />
          <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  // Gérer l'état vide
  const renderContent = () => {
    if (error) {
      return (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', backgroundColor: '#1e1e1e' }}>
          <Alert severity="error" sx={{ mb: 2, backgroundColor: alpha('#f44336', 0.1) }}>
            {error}
          </Alert>
          <StyledButton 
            variant="contained" 
            color="primary" 
            onClick={fetchNotifications}
            startIcon={<RefreshIcon />}
          >
            Réessayer
          </StyledButton>
        </Paper>
      );
    }
    
    if (!filteredNotifications || filteredNotifications.length === 0) {
      return (
        <EmptyNotificationBox>
          <NotificationsIcon sx={{ fontSize: 64, color: '#90caf9', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
            Aucune notification{activeFilter !== 'all' ? ` avec ce filtre` : ''}
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3, maxWidth: 500 }}>
            {activeFilter !== 'all' 
              ? `Vous n'avez pas de notifications correspondant au filtre "${filterOptions.find(opt => opt.value === activeFilter).label}".`
              : 'Vous n\'avez pas encore reçu de notifications. Les activités importantes seront affichées ici.'}
          </Typography>
          {activeFilter !== 'all' && (
            <StyledButton 
              variant="outlined" 
              color="primary" 
              onClick={() => handleFilterChange('all')}
              startIcon={<FilterListIcon />}
            >
              Afficher toutes les notifications
            </StyledButton>
          )}
        </EmptyNotificationBox>
      );
    }

    return (
      <List sx={{ 
        width: '100%',
        bgcolor: '#1e1e1e',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4,
        p: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        {filteredNotifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 30}ms` }}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  px: 3,
                  backgroundColor: notification.read ? 'transparent' : alpha('#90caf9', 0.08),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: notification.read 
                      ? alpha('#ffffff', 0.05) 
                      : alpha('#90caf9', 0.12),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                  },
                  borderRadius: 2,
                  mb: 1.5,
                  borderLeft: notification.read ? 'none' : `4px solid ${
                    notification.level === 'success' ? '#4caf50' :
                    notification.level === 'warning' ? '#ff9800' :
                    notification.level === 'error' ? '#f44336' : '#2196f3'
                  }`
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(notification.level), 
                      color: notification.read ? '#b0b0b0' : '#ffffff',
                      boxShadow: notification.read ? 'none' : '0 3px 8px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {getNotificationIcon(notification.level)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: notification.read ? '#e0e0e0' : '#ffffff',
                        fontWeight: notification.read ? 400 : 600
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ 
                          color: notification.read ? '#b0b0b0' : '#e0e0e0',
                          mb: 1,
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{ 
                            color: notification.read ? '#b0b0b0' : '#90caf9',
                            fontStyle: 'italic'
                          }}
                        >
                          {notification.relative_time || 'à l\'instant'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* Action requise séparée */}
                          {notification.requires_action && notification.action_url && (
                            <StyledButton
                              variant="text"
                              color="primary"
                              size="small"
                              sx={{ 
                                minWidth: 0,
                                px: 1,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                background: 'none',
                                boxShadow: 'none',
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: alpha('#90caf9', 0.08),
                                  boxShadow: 'none',
                                  transform: 'none',
                                }
                              }}
                              onClick={() => window.location.href = notification.action_url}
                            >
                              Action requise
                            </StyledButton>
                          )}
                          {/* Boutons de gestion notification */}
                          {!notification.read && (
                            <Tooltip title="Marquer comme lu">
                              <IconButton 
                                size="small" 
                                onClick={() => markAsRead(notification.id)}
                                sx={{ 
                                  color: '#90caf9', 
                                  bgcolor: alpha('#90caf9', 0.08),
                                  '&:hover': {
                                    bgcolor: alpha('#90caf9', 0.15),
                                    transform: 'scale(1.1)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Supprimer">
                            <IconButton 
                              size="small" 
                              onClick={() => deleteNotification(notification.id)}
                              sx={{ 
                                color: '#f44336',
                                bgcolor: alpha('#f44336', 0.08),
                                '&:hover': {
                                  bgcolor: alpha('#f44336', 0.15),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Fade>
            {index < filteredNotifications.length - 1 && (
              <Divider component="li" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            )}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          {/* En-tête */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 1 }}>
                Notifications
                {unreadCount > 0 && (
                  <Chip 
                    label={`${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`} 
                    size="small" 
                    color="primary" 
                    sx={{ 
                      ml: 2, 
                      mb: 1, 
                      borderRadius: 5,
                      background: 'linear-gradient(90deg, #3a7bd5 0%, #2980b9 100%)',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(42, 139, 242, 0.3)'
                    }}
                  />
                )}
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                Consultez et gérez vos notifications
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledButton
                variant="outlined"
                color="primary"
                onClick={handleFilterClick}
                startIcon={<FilterListIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: alpha('#90caf9', 0.5),
                  '&:hover': {
                    borderColor: '#90caf9',
                    backgroundColor: alpha('#90caf9', 0.05)
                  }
                }}
              >
                {filterOptions.find(opt => opt.value === activeFilter).label}
              </StyledButton>
              
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                TransitionComponent={Fade}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1e1e1e',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    minWidth: 180,
                  }
                }}
              >
                {filterOptions.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    onClick={() => handleFilterChange(option.value)}
                    selected={activeFilter === option.value}
                    sx={{ 
                      mx: 0.5,
                      my: 0.2,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: alpha('#90caf9', 0.15),
                      },
                      '&:hover': {
                        backgroundColor: alpha('#90caf9', 0.08),
                      }
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>

              <StyledButton
                variant="outlined"
                color="primary"
                onClick={markAllAsRead}
                startIcon={<DoneAllIcon />}
                disabled={unreadCount === 0}
                sx={{
                  borderRadius: 2,
                  borderColor: alpha('#90caf9', 0.5),
                  '&:hover': {
                    borderColor: '#90caf9',
                    backgroundColor: alpha('#90caf9', 0.05)
                  },
                  '&.Mui-disabled': {
                    borderColor: alpha('#90caf9', 0.1),
                    color: alpha('#90caf9', 0.3)
                  }
                }}
              >
                Tout marquer comme lu
              </StyledButton>
              
              <StyledButton
                variant="outlined"
                color="error"
                onClick={clearReadNotifications}
                startIcon={<DeleteSweepIcon />}
                disabled={!notifications.some(n => n.read)}
                sx={{
                  borderRadius: 2,
                  borderColor: alpha('#f44336', 0.5),
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#f44336',
                    backgroundColor: alpha('#f44336', 0.05)
                  },
                  '&.Mui-disabled': {
                    borderColor: alpha('#f44336', 0.1),
                    color: alpha('#f44336', 0.3)
                  }
                }}
              >
                Supprimer les notifications lues
              </StyledButton>
            </Box>
          </Box>

          {/* Contenu principal */}
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default NotificationsPage;