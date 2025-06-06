// src/components/E2EStatusCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import E2ESetupModal from './E2ESetupModal';
import HybridCredentialService from '../services/HybridCredentialService';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: '#1e1e1e',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: variant === 'contained' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 6px 20px rgba(0, 0, 0, 0.4)' : 'none',
  },
}));

const StatusChip = styled(Chip)(({ status }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: alpha('#4caf50', 0.2),
          color: '#4caf50',
          borderColor: '#4caf50',
        };
      case 'available':
        return {
          backgroundColor: alpha('#ff9800', 0.2),
          color: '#ff9800',
          borderColor: '#ff9800',
        };
      case 'unavailable':
        return {
          backgroundColor: alpha('#757575', 0.2),
          color: '#757575',
          borderColor: '#757575',
        };
      default:
        return {
          backgroundColor: alpha('#90caf9', 0.2),
          color: '#90caf9',
          borderColor: '#90caf9',
        };
    }
  };

  return {
    ...getStatusColors(),
    fontWeight: 600,
    fontSize: '0.85rem',
    height: 28,
    borderRadius: 14,
    border: '1px solid',
  };
});

const E2EStatusCard = ({ onStatusChange }) => {
  const [e2eStatus, setE2eStatus] = useState({
    available: false,
    enabled: false,
    isNewUser: false,
  });
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [hybridService] = useState(() => new HybridCredentialService());

  useEffect(() => {
    loadE2EStatus();
  }, []);

  const loadE2EStatus = async () => {
    setLoading(true);
    try {
      // Vérifier le statut E2E
      const status = await hybridService.initialize();
      setE2eStatus(status);

      // Charger les statistiques
      if (status.enabled || status.available) {
        const credentialStats = await hybridService.getCredentialStats();
        setStats(credentialStats);
      }

      if (onStatusChange) {
        onStatusChange(status);
      }
    } catch (error) {
      console.error('Erreur chargement statut E2E:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateE2E = () => {
    setSetupModalOpen(true);
  };

  const handleE2ESuccess = async (password) => {
    try {
      const status = await hybridService.initialize(password);
      setE2eStatus(status);
      
      if (status.e2eEnabled) {
        // Recharger les stats
        const credentialStats = await hybridService.getCredentialStats();
        setStats(credentialStats);
        
        setSetupModalOpen(false);
        
        if (onStatusChange) {
          onStatusChange(status);
        }
      }
    } catch (error) {
      console.error('Erreur activation E2E:', error);
    }
  };

  const getStatusInfo = () => {
    if (e2eStatus.enabled) {
      return {
        status: 'active',
        label: 'E2E Activé',
        description: 'Chiffrement de bout en bout actif',
        icon: <SecurityIcon />,
        color: '#4caf50',
      };
    } else if (e2eStatus.available) {
      return {
        status: 'available',
        label: 'E2E Disponible',
        description: 'Prêt à être activé',
        icon: <LockIcon />,
        color: '#ff9800',
      };
    } else {
      return {
        status: 'unavailable',
        label: 'E2E Non disponible',
        description: 'Configuration requise',
        icon: <InfoIcon />,
        color: '#757575',
      };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#90caf9', 0.2), mr: 2 }}>
              <SecurityIcon sx={{ color: '#90caf9' }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              Chiffrement E2E
            </Typography>
          </Box>
          <LinearProgress sx={{ borderRadius: 2 }} />
          <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
            Vérification du statut...
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <>
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          {/* En-tête */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: alpha(statusInfo.color, 0.2), mr: 2 }}>
                {React.cloneElement(statusInfo.icon, { 
                  sx: { color: statusInfo.color } 
                })}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Chiffrement E2E
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {statusInfo.description}
                </Typography>
              </Box>
            </Box>
            <StatusChip
              status={statusInfo.status}
              label={statusInfo.label}
              icon={statusInfo.icon}
            />
          </Box>

          {/* Statistiques si E2E est actif */}
          {e2eStatus.enabled && stats && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
                Statistiques de chiffrement
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: alpha('#4caf50', 0.1),
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {stats.e2eCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                    Credentials E2E
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: alpha('#ff9800', 0.1),
                  border: '1px solid rgba(255, 152, 0, 0.2)'
                }}>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                    {stats.legacyCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                    Credentials Legacy
                  </Typography>
                </Box>
              </Box>

              {stats.total > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Taux de chiffrement E2E
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
                      {stats.e2ePercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.e2ePercentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha('#4caf50', 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4caf50',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Informations sur E2E */}
          {e2eStatus.enabled ? (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                backgroundColor: alpha('#4caf50', 0.1),
                color: '#4caf50',
                '& .MuiAlert-icon': { color: '#4caf50' }
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Chiffrement actif 🔒
                </Typography>
                <Typography variant="body2">
                  Vos nouveaux credentials peuvent être chiffrés localement pour une sécurité maximale.
                </Typography>
              </Box>
            </Alert>
          ) : e2eStatus.available ? (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                backgroundColor: alpha('#90caf9', 0.1),
                color: '#90caf9',
                '& .MuiAlert-icon': { color: '#90caf9' }
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  E2E prêt à l'activation
                </Typography>
                <Typography variant="body2">
                  Activez le chiffrement de bout en bout pour une protection renforcée de vos données.
                </Typography>
              </Box>
            </Alert>
          ) : (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                backgroundColor: alpha('#ff9800', 0.1),
                color: '#ff9800',
                '& .MuiAlert-icon': { color: '#ff9800' }
              }}
            >
              <Typography variant="body2">
                Le chiffrement E2E n'est pas encore configuré sur ce compte.
              </Typography>
            </Alert>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!e2eStatus.enabled && e2eStatus.available && (
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<SecurityIcon />}
                onClick={handleActivateE2E}
                fullWidth
              >
                Activer E2E
              </StyledButton>
            )}
            
            {e2eStatus.enabled && (
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<TrendingUpIcon />}
                onClick={loadE2EStatus}
                fullWidth
              >
                Actualiser les statistiques
              </StyledButton>
            )}
          </Box>

          {/* Avantages E2E si pas encore activé */}
          {!e2eStatus.enabled && (
            <>
              <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
                Pourquoi activer E2E ?
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sécurité maximale"
                    secondary="Chiffrement local avant envoi au serveur"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: '#ffffff', 
                        fontSize: '0.9rem',
                        fontWeight: 500 
                      },
                      '& .MuiListItemText-secondary': { 
                        color: '#b0b0b0',
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Confidentialité totale"
                    secondary="Impossible à déchiffrer côté serveur"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: '#ffffff', 
                        fontSize: '0.9rem',
                        fontWeight: 500 
                      },
                      '& .MuiListItemText-secondary': { 
                        color: '#b0b0b0',
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Protection contre les fuites"
                    secondary="Vos données restent sécurisées même en cas de compromission"
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        color: '#ffffff', 
                        fontSize: '0.9rem',
                        fontWeight: 500 
                      },
                      '& .MuiListItemText-secondary': { 
                        color: '#b0b0b0',
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                </ListItem>
              </List>
            </>
          )}
        </CardContent>
      </StyledCard>

      {/* Modal d'activation */}
      <E2ESetupModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSuccess={handleE2ESuccess}
      />
    </>
  );
};

export default E2EStatusCard;