// src/components/Shares/ShareItem.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Divider,
  Button,
  Tooltip,
  Collapse,
  Alert
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LockIcon from '@mui/icons-material/Lock';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LanguageIcon from '@mui/icons-material/Language';

// Styled components
const StyledChip = styled(Chip)(({ theme, status }) => {
  let color;
  let bgcolor;
  
  switch (status) {
    case 'active':
      color = '#4caf50';
      bgcolor = alpha('#4caf50', 0.1);
      break;
    case 'expired':
      color = '#f44336';
      bgcolor = alpha('#f44336', 0.1);
      break;
    case 'almost':
      color = '#ff9800';
      bgcolor = alpha('#ff9800', 0.1);
      break;
    default:
      color = '#90caf9';
      bgcolor = alpha('#90caf9', 0.1);
  }
  
  return {
    backgroundColor: bgcolor,
    color: color,
    borderRadius: 8,
    '& .MuiChip-label': {
      fontWeight: 500,
    },
  };
});

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

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
    transform: 'translateY(-2px)'
  }
}));

const ShareItem = ({ share, onEditClick, onDeleteClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Extraire les informations importantes
  const shareId = share.share_id;
  const credentialName = share.credential?.name || 'Credential inconnu';
  const createdAt = new Date(share.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const expiresAt = new Date(share.expires_at).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calculs pour l'affichage
  const isExpired = share.is_expired;
  const daysLeft = Math.ceil((new Date(share.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
  const accessCount = share.access_count || 0;
  const remainingAccesses = share.remaining_accesses;
  const maxAccesses = share.max_access_count;
  const hasAccessLimit = maxAccesses !== null;
  
  // Construction de l'URL complète
  const shareUrl = `https://firekey.theokaszak.fr/share/${shareId}`;
  
  // Déterminer le statut d'expiration
  let expirationStatus = 'active';
  if (isExpired) {
    expirationStatus = 'expired';
  } else if (daysLeft <= 3) {
    expirationStatus = 'almost';
  }

  // Copier l'URL dans le presse-papiers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };

  // Ouvrir le lien dans un nouvel onglet
  const handleOpenLink = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box>
      {/* En-tête avec le nom et les actions */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" sx={{ 
              color: '#ffffff',
              fontWeight: 600, 
              mr: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              {credentialName}
            </Typography>
            
            <StyledChip 
              label={isExpired ? 'Expiré' : daysLeft <= 3 ? `Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : 'Actif'} 
              size="small"
              status={expirationStatus}
              icon={<AccessTimeIcon style={{ fontSize: 16 }} />}
            />
            
            {hasAccessLimit && (
              <StyledChip 
                label={remainingAccesses === 0 ? 'Aucun accès restant' : `${remainingAccesses} accès restant${remainingAccesses > 1 ? 's' : ''}`}
                size="small"
                status={remainingAccesses === 0 ? 'expired' : (remainingAccesses <= 2 ? 'almost' : 'active')}
                icon={<VisibilityIcon style={{ fontSize: 16 }} />}
              />
            )}
          </Box>
        </Grid>
        
        <Grid item>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Modifier">
              <ActionButton onClick={() => onEditClick(share)}>
                <EditIcon fontSize="small" sx={{ color: '#90caf9' }} />
              </ActionButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <ActionButton onClick={() => onDeleteClick(share)}>
                <DeleteIcon fontSize="small" sx={{ color: '#f44336' }} />
              </ActionButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

      {/* Lien de partage avec bouton de copie */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: alpha('#90caf9', 0.05),
        borderRadius: 2,
        p: 2,
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <LinkIcon sx={{ color: '#90caf9', mr: 1, fontSize: 20, flexShrink: 0 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#e0e0e0', 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {shareUrl}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, ml: 2, flexShrink: 0 }}>
          {copySuccess && (
            <Chip
              label="Copié !"
              size="small"
              color="success"
              sx={{ height: 24 }}
            />
          )}
          <Tooltip title="Ouvrir le lien">
            <IconButton 
              size="small" 
              onClick={handleOpenLink}
              sx={{ color: '#4caf50' }}
              disabled={isExpired}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copier le lien">
            <IconButton 
              size="small" 
              onClick={handleCopyLink}
              sx={{ color: '#90caf9' }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Informations de base */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon sx={{ color: '#b0b0b0', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Créé le: {createdAt}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon sx={{ color: '#b0b0b0', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Expire le: {expiresAt}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Affichage de message si le lien est expiré */}
      {isExpired && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            backgroundColor: 'rgba(211, 47, 47, 0.1)', 
            color: '#ff5252',
            '& .MuiAlert-icon': {
              color: '#ff5252'
            }
          }}
          icon={<LinkOffIcon />}
        >
          Ce lien est expiré et n'est plus accessible. Vous pouvez le supprimer ou créer un nouveau partage.
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="#b0b0b0">
          Utilisé {accessCount} fois
          {hasAccessLimit ? ` sur ${maxAccesses}` : ''}
        </Typography>
        
        <StyledButton
          variant="text"
          color="primary"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {expanded ? 'Moins de détails' : 'Plus de détails'}
        </StyledButton>
      </Box>

      {/* Détails supplémentaires (section extensible) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#ffffff' }}>
            Informations du credential partagé
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                  Nom du credential
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                  <LockIcon sx={{ fontSize: 16, mr: 0.5, color: '#90caf9' }} />
                  {credentialName}
                </Typography>
              </Box>
            </Grid>
            
            {share.credential?.website && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                    Site web
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon sx={{ fontSize: 16, mr: 0.5, color: '#90caf9' }} />
                    {share.credential.website}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
            Identifiant unique: <code style={{ color: '#e0e0e0' }}>{share.id.substring(0, 8)}</code>
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ShareItem;