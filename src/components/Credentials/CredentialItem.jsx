// src/components/Credentials/CredentialItem.jsx
import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Divider,
  Tooltip,
  FormControlLabel,
  Switch,
  Button,
  Collapse,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SecurityIcon from '@mui/icons-material/Security';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  height: 28,
  fontWeight: 500,
  fontSize: '0.75rem'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 8,
  padding: 8,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

const InfoField = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
  padding: '8px 12px',
  borderRadius: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
}));

const CredentialItem = ({ cred, onTogglePassword, onEdit, onDelete, onSensitiveChange }) => {
  // Fonction pour copier le mot de passe
  const handleCopyPassword = () => {
    if (cred.password && cred.unlocked) {
      navigator.clipboard.writeText(cred.password)
        .then(() => {
          // On pourrait utiliser snackbar ici
          console.log('Mot de passe copié !');
        })
        .catch(err => {
          console.error('Erreur lors de la copie', err);
        });
    }
  };

  // Fonction pour copier l'email
  const handleCopyEmail = () => {
    if (cred.email) {
      navigator.clipboard.writeText(cred.email)
        .then(() => {
          console.log('Email copié !');
        })
        .catch(err => {
          console.error('Erreur lors de la copie', err);
        });
    }
  };

  // Fonction pour ouvrir le site web
  const handleOpenWebsite = () => {
    if (cred.website) {
      let url = cred.website;
      // Ajouter http:// si nécessaire
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box>
      {/* Ligne principale avec le nom et les actions */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ 
              color: '#ffffff',
              fontWeight: 600, 
              mr: 2,
              display: 'flex',
              alignItems: 'center'
            }}>
              {cred.name}
              {cred.is_sensitive && (
                <Tooltip title="Credential sensible - Protégé par mot de passe">
                  <SecurityIcon sx={{ color: '#f44336', ml: 1, fontSize: 20 }} />
                </Tooltip>
              )}
            </Typography>
            
            {cred.website && (
              <Chip 
                label={cred.website} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: '#e0e0e0',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                }}
                icon={<LanguageIcon sx={{ fontSize: '16px !important', color: '#e0e0e0 !important' }} />}
                onClick={handleOpenWebsite}
              />
            )}
          </Box>
        </Grid>
        
        <Grid item>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Modifier">
              <ActionButton onClick={() => onEdit(cred)}>
                <EditIcon fontSize="small" sx={{ color: '#90caf9' }} />
              </ActionButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <ActionButton onClick={() => onDelete(cred)}>
                <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
              </ActionButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

      <Grid container spacing={3}>
        {/* Informations du credential */}
        <Grid item xs={12} md={8}>
          {cred.email && (
            <InfoField>
              <EmailIcon sx={{ color: '#b0b0b0', mr: 2, fontSize: 20 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="#e0e0e0">
                  {cred.email}
                </Typography>
              </Box>
              <Tooltip title="Copier l'email">
                <IconButton 
                  size="small" 
                  onClick={handleCopyEmail}
                  sx={{ color: '#b0b0b0' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InfoField>
          )}
          
          {/* Affichage du mot de passe */}
          <InfoField sx={{ 
            backgroundColor: cred.unlocked ? 'rgba(144, 202, 249, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: cred.unlocked ? '1px solid rgba(144, 202, 249, 0.2)' : 'none',
          }}>
            <LockIcon sx={{ color: cred.unlocked ? '#90caf9' : '#b0b0b0', mr: 2, fontSize: 20 }} />
            <Box sx={{ flexGrow: 1 }}>
              {cred.unlocked ? (
                <Typography variant="body2" sx={{ 
                  color: '#ffffff', 
                  fontFamily: 'monospace', 
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  py: '4px',
                  px: 2,
                  borderRadius: 1,
                  display: 'inline-block'
                }}>
                  {cred.password}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  •••••••••••••••
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={cred.unlocked ? "Masquer" : "Afficher"}>
                <IconButton 
                  size="small" 
                  onClick={() => onTogglePassword(cred)}
                  sx={{ color: cred.unlocked ? '#90caf9' : '#b0b0b0' }}
                >
                  {cred.unlocked ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              {cred.unlocked && (
                <Tooltip title="Copier le mot de passe">
                  <IconButton 
                    size="small" 
                    onClick={handleCopyPassword}
                    sx={{ color: '#b0b0b0' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </InfoField>
          
          {/* Notes */}
          {cred.note && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 1 }}>
                Notes:
              </Typography>
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
                p: 2,
                color: '#e0e0e0',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {cred.note}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Contrôles et options */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 2,
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={cred.is_sensitive}
                  onChange={(e) => onSensitiveChange(cred, e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                    Protection renforcée
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
                    {cred.is_sensitive 
                      ? "Vérification supplémentaire activée" 
                      : "Accessible sans confirmation"}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', ml: 0 }}
            />
            
            {cred.website && (
              <StyledButton
                variant="outlined"
                color="primary"
                startIcon={<OpenInNewIcon />}
                onClick={handleOpenWebsite}
                size="small"
                sx={{ mb: 2 }}
              >
                Visiter le site
              </StyledButton>
            )}
            
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={cred.unlocked ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={() => onTogglePassword(cred)}
            >
              {cred.unlocked ? "Masquer" : "Afficher"}
            </StyledButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CredentialItem;