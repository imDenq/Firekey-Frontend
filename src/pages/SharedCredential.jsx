// src/pages/SharedCredential.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Divider,
  Chip,
  Alert,
  Fade,
  Grid
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Security as SecurityIcon,
  Timer as TimerIcon,
  ErrorOutline as ErrorOutlineIcon,
  OpenInNew as OpenInNewIcon,
  LockPerson as LockPersonIcon,
  AccessTime as AccessTimeIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Lock as LockIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#121212',
  position: 'relative',
  overflow: 'hidden',
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'radial-gradient(circle at top right, rgba(144, 202, 249, 0.1) 0%, rgba(25, 118, 210, 0.05) 35%, rgba(13, 17, 23, 0) 70%)',
  zIndex: 0,
}));

const WaveBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '25vh',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%231e1e1e\' fill-opacity=\'0.5\' d=\'M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,106.7C672,139,768,181,864,165.3C960,149,1056,75,1152,74.7C1248,75,1344,149,1392,186.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  zIndex: 0,
  opacity: 0.8,
}));

const CredentialCard = styled(Paper)(({ theme }) => ({
  padding: 40,
  width: '100%',
  maxWidth: 600,
  backgroundColor: '#1e1e1e',
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  color: 'white',
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    padding: 2,
    background: 'linear-gradient(225deg, rgba(144, 202, 249, 0.3) 0%, rgba(30, 30, 30, 0) 50%, rgba(30, 30, 30, 0) 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 32,
}));

const CredentialField = styled(Box)(({ theme, highlight }) => ({
  backgroundColor: highlight ? alpha('#90caf9', 0.1) : alpha('#ffffff', 0.05),
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  border: highlight ? `1px solid ${alpha('#90caf9', 0.3)}` : 'none',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: highlight ? alpha('#90caf9', 0.15) : alpha('#ffffff', 0.08),
  }
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
    transform: 'translateY(-2px)'
  }
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: 24,
}));

export default function SharedCredential() {
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedFields, setCopiedFields] = useState({});
  
  // Récupérer les paramètres de l'URL
  const { shareId, accessKey } = useParams();
  
  // Charger les données du credential partagé
  useEffect(() => {
    // Variable pour suivre si le composant est monté
    let isMounted = true;
    
    const fetchSharedCredential = async () => {
      try {
        if (!isMounted) return; // Ne pas continuer si le composant est démonté
        
        setLoading(true);
        // Ajout d'un paramètre de cache-busting pour éviter les requêtes en double du navigateur
        const cacheBuster = Date.now();
        const response = await fetch(`http://localhost:8001/api/share/${shareId}/${accessKey}/?_=${cacheBuster}`);
        
        if (!isMounted) return; // Vérifier à nouveau après la requête
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Une erreur est survenue');
        }
        
        const data = await response.json();
        setCredential(data);
      } catch (err) {
        if (isMounted) {
          console.error('Erreur:', err);
          setError(err.message || 'Une erreur est survenue lors du chargement');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (shareId && accessKey) {
      // Utiliser un délai minime pour éviter les doubles appels pendant le rendu initial
      const timeoutId = setTimeout(() => {
        fetchSharedCredential();
      }, 10);
      
      // Nettoyage lors du démontage du composant
      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, [shareId, accessKey]);  // Garder les mêmes dépendances
  
  // Formater la date d'expiration
  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Copier un texte dans le presse-papiers
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Mettre à jour l'état pour afficher la confirmation
        setCopiedFields({...copiedFields, [field]: true});
        
        // Réinitialiser après 2 secondes
        setTimeout(() => {
          setCopiedFields({...copiedFields, [field]: false});
        }, 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };
  
  // Ouvrir le site web
  const openWebsite = (url) => {
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <PageContainer>
        <GradientBackground />
        <WaveBox />
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#90caf9' }} />
          <Typography variant="h6" sx={{ mt: 3, color: '#ffffff', fontWeight: 500 }}>
            Chargement du credential partagé...
          </Typography>
        </Box>
      </PageContainer>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <PageContainer>
        <GradientBackground />
        <WaveBox />
        <CredentialCard>
          <LogoBox>
            <LockPersonIcon sx={{ fontSize: 40, color: '#90caf9', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
              FireKey
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
              Gestionnaire de mots de passe sécurisé
            </Typography>
          </LogoBox>
          
          <ErrorContainer>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
              Impossible d'accéder au credential partagé. Le lien est peut-être invalide ou a expiré.
            </Typography>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </StyledButton>
          </ErrorContainer>
        </CredentialCard>
      </PageContainer>
    );
  }
  
  // Vérifier si on a bien des données
  if (!credential) {
    return null;
  }
  
  // Si le lien est expiré, afficher un message
  if (credential.is_expired) {
    return (
      <PageContainer>
        <GradientBackground />
        <WaveBox />
        <CredentialCard>
          <LogoBox>
            <LockPersonIcon sx={{ fontSize: 40, color: '#90caf9', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
              FireKey
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
              Gestionnaire de mots de passe sécurisé
            </Typography>
          </LogoBox>
          
          <ErrorContainer>
            <AccessTimeIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
              Ce lien a expiré
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
              Le lien de partage a atteint sa date d'expiration ou son nombre maximal d'utilisations.
            </Typography>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </StyledButton>
          </ErrorContainer>
        </CredentialCard>
      </PageContainer>
    );
  }
  
  // Afficher le credential
  return (
    <PageContainer>
      <GradientBackground />
      <WaveBox />
      <CredentialCard>
        <LogoBox>
          <LockPersonIcon sx={{ fontSize: 40, color: '#90caf9', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
            FireKey
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
            Gestionnaire de mots de passe sécurisé
          </Typography>
        </LogoBox>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff', mb: 1, textAlign: 'center' }}>
            {credential.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
            Informations d'identification partagées par <span style={{ color: '#90caf9' }}>{credential.shared_by}</span>
          </Typography>
        </Box>
        
        <Alert 
          severity="info" 
          variant="outlined" 
          sx={{ 
            mb: 3, 
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            color: '#90caf9',
            '& .MuiAlert-icon': {
              color: '#90caf9'
            }
          }}
        >
          Ces informations sont à usage unique et ne seront plus accessibles après avoir quitté cette page.
        </Alert>
        
        {/* Champ site web */}
        {credential.website && (
          <CredentialField>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <LanguageIcon sx={{ color: '#90caf9' }} />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                  Site web
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {credential.website}
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Fade in={copiedFields['website']}>
                    <Chip
                      label="Copié !"
                      size="small"
                      color="success"
                      sx={{ height: 24 }}
                    />
                  </Fade>
                  <IconButton 
                    size="small" 
                    onClick={() => openWebsite(credential.website)}
                    sx={{ color: '#4caf50' }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(credential.website, 'website')}
                    sx={{ color: '#90caf9' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CredentialField>
        )}
        
        {/* Champ email */}
        {credential.email && (
          <CredentialField>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <EmailIcon sx={{ color: '#90caf9' }} />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  {credential.email}
                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Fade in={copiedFields['email']}>
                    <Chip
                      label="Copié !"
                      size="small"
                      color="success"
                      sx={{ height: 24 }}
                    />
                  </Fade>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(credential.email, 'email')}
                    sx={{ color: '#90caf9' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CredentialField>
        )}
        
        {/* Champ mot de passe */}
        <CredentialField highlight>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}>
              <LockIcon sx={{ color: '#90caf9' }} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                Mot de passe
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#ffffff',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  fontFamily: 'monospace',
                  padding: '6px 12px',
                  borderRadius: 1,
                  display: 'inline-block',
                  wordBreak: 'break-all'
                }}
              >
                {credential.password}
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Fade in={copiedFields['password']}>
                  <Chip
                    label="Copié !"
                    size="small"
                    color="success"
                    sx={{ height: 24 }}
                  />
                </Fade>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(credential.password, 'password')}
                  sx={{ color: '#90caf9' }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CredentialField>
        
        {/* Champ note */}
        {credential.note && (
          <CredentialField>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <NotesIcon sx={{ color: '#90caf9' }} />
              </Grid>
              <Grid item xs={11}>
                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem', mb: 0.5 }}>
                  Notes
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#ffffff',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {credential.note}
                </Typography>
              </Grid>
            </Grid>
          </CredentialField>
        )}
        
        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ color: '#ff9800', mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Expire le {formatExpiryDate(credential.expires_at)}
            </Typography>
          </Box>
          
          {credential.remaining_accesses !== null && (
            <Chip
              label={`${credential.remaining_accesses} accès restant${credential.remaining_accesses > 1 ? 's' : ''}`}
              size="small"
              sx={{ 
                bgcolor: alpha('#ff9800', 0.1), 
                color: '#ff9800',
                borderColor: alpha('#ff9800', 0.3),
                borderRadius: 4
              }}
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <StyledButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => copyToClipboard(credential.password, 'password')}
            startIcon={<ContentCopyIcon />}
          >
            Copier le mot de passe
          </StyledButton>
        </Box>
      </CredentialCard>
    </PageContainer>
  );
}