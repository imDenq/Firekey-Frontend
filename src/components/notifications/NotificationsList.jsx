// src/components/notifications/NotificationsList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Button,
  Badge,
  Fade
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: variant === 'contained' ? 'translateY(-2px)' : 'none',
  },
}));

const EmptyNotificationBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '24px 16px',
}));

// Fonction pour sélectionner l'icône en fonction du niveau de la notification
const getNotificationIcon = (level) => {
  switch (level) {
    case 'success':
      return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
    case 'warning':
      return <WarningIcon sx={{ color: '#ff9800' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: '#f44336' }} />;
    case 'info':
    default:
      return <InfoIcon sx={{ color: '#2196f3' }} />;
  }
};

// Couleur de l'avatar en fonction du niveau
const getAvatarColor = (level) => {
  switch (level) {
    case 'success':
      return alpha('#4caf50', 0.2);
    case 'warning':
      return alpha('#ff9800', 0.2);
    case 'error':
      return alpha('#f44336', 0.2);
    case 'info':
    default:
      return alpha('#2196f3', 0.2);
  }
};

const NotificationsList = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const accessToken = localStorage.getItem('accessToken') || '';

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
    console.log("Chargement des notifications...");
  }, []);

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      console.log("Appel API pour récupérer les notifications");
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

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e);
        throw new Error("Format de réponse invalide");
      }
      
      console.log("Données de réponse:", data);
      
      // Vérifier la structure des données
      if (data && Array.isArray(data)) {
        // Si data est directement un tableau
        setNotifications(data);
        const unread = data.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } else if (data && data.results && Array.isArray(data.results)) {
        // Si data contient un champ results qui est un tableau (pagination)
        setNotifications(data.results);
        const unread = data.results.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } else if (data && data.count !== undefined && data.count === 0) {
        // Si aucun résultat n'est retourné mais format valide
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error("Format de données inattendu:", data);
        throw new Error("Format de données inattendu");
      }
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
      setNotifications(prev => 
        prev.filter(notif => !notif.read)
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress size={40} sx={{ color: '#90caf9' }} />
      </Box>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#f44336', mb: 2 }}>
          {error}
        </Typography>
        <StyledButton 
          variant="outlined" 
          color="primary" 
          onClick={fetchNotifications}
        >
          Réessayer
        </StyledButton>
      </Box>
    );
  }

  // Afficher un message si aucune notification
  if (!notifications || notifications.length === 0) {
    return (
      <EmptyNotificationBox>
        <NotificationsIcon sx={{ fontSize: 48, color: '#90caf9', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
          Aucune notification
        </Typography>
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Vous n'avez pas de notifications pour le moment.
        </Typography>
      </EmptyNotificationBox>
    );
  }

  return (
    <Box sx={{ width: '100%', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête avec actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
          Notifications
          {unreadCount > 0 && (
            <Badge 
              badgeContent={unreadCount} 
              color="primary" 
              sx={{ ml: 2, mb: 0.5 }}
            />
          )}
        </Typography>
        <Box>
          <Tooltip title="Tout marquer comme lu">
            <IconButton size="small" onClick={markAllAsRead} sx={{ color: '#90caf9' }}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer les notifications lues">
            <IconButton size="small" onClick={clearReadNotifications} sx={{ color: '#b0b0b0' }}>
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Liste de notifications */}
      <List 
        sx={{ 
          width: '100%', 
          overflow: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 1.5,
                  backgroundColor: notification.read ? 'transparent' : alpha('#90caf9', 0.08),
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: notification.read 
                      ? alpha('#ffffff', 0.05) 
                      : alpha('#90caf9', 0.12),
                  },
                  cursor: notification.read ? 'default' : 'pointer'
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(notification.level), 
                      color: notification.read ? '#b0b0b0' : '#ffffff',
                    }}
                  >
                    {getNotificationIcon(notification.level)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
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
                        component="span"
                        sx={{ 
                          display: 'block', 
                          color: notification.read ? '#b0b0b0' : '#e0e0e0',
                          mb: 0.5
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ 
                          display: 'block', 
                          color: notification.read ? '#b0b0b0' : '#90caf9',
                          fontStyle: 'italic'
                        }}
                      >
                        {notification.relative_time || 'à l\'instant'}
                      </Typography>
                    </React.Fragment>
                  }
                />
                {notification.requires_action && notification.action_url && (
                  <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Tooltip title="Action requise">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = notification.action_url;
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </ListItem>
            </Fade>
            {index < notifications.length - 1 && (
              <Divider variant="inset" component="li" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Pied de page */}
      <Box 
        sx={{ 
          p: 2, 
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <StyledButton
          variant="text"
          color="primary"
          onClick={onClose}
          fullWidth
        >
          Voir toutes les notifications
        </StyledButton>
      </Box>
    </Box>
  );
};

export default NotificationsList;