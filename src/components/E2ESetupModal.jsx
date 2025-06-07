// src/components/E2ESetupModal.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import ShieldIcon from '@mui/icons-material/Shield';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
    maxWidth: 600,
  },
  '& .MuiDialogTitle-root': {
    fontSize: '1.5rem',
    fontWeight: 700,
    padding: '24px 32px 16px',
    color: '#ffffff',
    textAlign: 'center',
  },
  '& .MuiDialogContent-root': {
    padding: '0 32px 24px',
  },
  '& .MuiDialogActions-root': {
    padding: '16px 32px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  boxShadow: variant === 'contained' ? '0 4px 16px rgba(0, 0, 0, 0.3)' : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 6px 20px rgba(0, 0, 0, 0.4)' : 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    color: '#ffffff',
    '& fieldset': { borderColor: '#444' },
    '&:hover fieldset': { borderColor: '#666' },
    '&.Mui-focused fieldset': { borderColor: '#90caf9' },
  },
  '& .MuiInputLabel-root': {
    color: '#b0b0b0',
    '&.Mui-focused': { color: '#90caf9' },
  },
  '& .MuiOutlinedInput-input': {
    color: '#ffffff',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: 16,
  borderRadius: 12,
  backgroundColor: alpha('#90caf9', 0.1),
  border: '1px solid rgba(144, 202, 249, 0.2)',
  margin: '8px 0',
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    color: '#b0b0b0',
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: '#90caf9',
    fontWeight: 600,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: '#4caf50',
    fontWeight: 500,
  },
  '& .MuiStepIcon-root': {
    color: '#444',
    '&.Mui-active': {
      color: '#90caf9',
    },
    '&.Mui-completed': {
      color: '#4caf50',
    },
  },
}));

const E2ESetupModal = ({ open, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedWarnings, setAcceptedWarnings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const steps = ['Information', 'Configuration', 'Activation'];

  const handleNext = () => {
    if (activeStep === 0) {
      if (!acceptedWarnings) {
        setError('Vous devez accepter les conditions pour continuer.');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!password || password.length < 12) {
        setError('Le mot de passe doit contenir au moins 12 caractères.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleActivateE2E = async () => {
    setLoading(true);
    setError('');
    setProgress(0);

    try {
      console.log('🔐 Début de l\'activation E2E...');

      // Étapes de progression
      const progressSteps = [
        { message: 'Vérification du mot de passe...', progress: 20 },
        { message: 'Activation E2E côté serveur...', progress: 60 },
        { message: 'Finalisation...', progress: 100 },
      ];

      // Progression 1: Vérification
      setProgress(progressSteps[0].progress);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Progression 2: Activation E2E
      setProgress(progressSteps[1].progress);
      
      const accessToken = localStorage.getItem('accessToken');
      console.log('🔑 Token d\'accès récupéré');

      const response = await fetch('https://firekey.theokaszak.fr/api/credentials-e2e/activate_e2e/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_password: password
        })
      });

      console.log('📡 Réponse de l\'API reçue:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.error || errorData.detail || 'Erreur lors de l\'activation E2E');
      }

      const data = await response.json();
      console.log('✅ Données de réponse:', data);
      
      // Progression 3: Finalisation
      setProgress(progressSteps[2].progress);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Appeler le callback de succès avec le mot de passe
      if (onSuccess) {
        console.log('🎉 Appel du callback de succès');
        onSuccess(password);
      }

    } catch (error) {
      console.error('❌ Erreur activation E2E:', error);
      setError(error.message || 'Erreur lors de l\'activation du chiffrement E2E');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setActiveStep(0);
      setPassword('');
      setConfirmPassword('');
      setAcceptedWarnings(false);
      setError('');
      setProgress(0);
      onClose();
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <ShieldIcon sx={{ fontSize: 80, color: '#90caf9', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                Chiffrement de bout en bout (E2E)
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                Protégez vos données avec un chiffrement local ultra-sécurisé
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Avantages du chiffrement E2E :
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sécurité maximale"
                    secondary="Vos données sont chiffrées dans votre navigateur avant d'être envoyées"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: '#ffffff' },
                      '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Confidentialité totale"
                    secondary="Même les administrateurs ne peuvent pas voir vos mots de passe"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: '#ffffff' },
                      '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Protection contre les fuites"
                    secondary="En cas de compromission serveur, vos données restent inaccessibles"
                    sx={{ 
                      '& .MuiListItemText-primary': { color: '#ffffff' },
                      '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                    }}
                  />
                </ListItem>
              </List>
            </Box>

            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                color: '#ff9800',
                '& .MuiAlert-icon': { color: '#ff9800' }
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Important à retenir :
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Vous devrez saisir votre mot de passe à chaque connexion pour déchiffrer vos données
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Si vous oubliez votre mot de passe, vos données E2E seront perdues
                </Typography>
                <Typography variant="body2">
                  • Les credentials E2E ne peuvent pas être partagés temporairement
                </Typography>
              </Box>
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedWarnings}
                  onChange={(e) => setAcceptedWarnings(e.target.checked)}
                  sx={{
                    color: '#b0b0b0',
                    '&.Mui-checked': { color: '#90caf9' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  J'ai lu et j'accepte ces conditions. Je comprends les risques et les avantages du chiffrement E2E.
                </Typography>
              }
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <KeyIcon sx={{ fontSize: 64, color: '#90caf9', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                Configuration du mot de passe
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                Utilisez votre mot de passe de compte actuel pour activer E2E.
              </Typography>
            </Box>

            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: '#2196f3',
                '& .MuiAlert-icon': { color: '#2196f3' }
              }}
            >
              <Typography variant="body2">
                Pour des raisons de sécurité, vous devez confirmer votre mot de passe de compte actuel pour activer le chiffrement E2E.
              </Typography>
            </Alert>

            <StyledTextField
              fullWidth
              label="Mot de passe de votre compte"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ color: '#b0b0b0' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Saisissez le mot de passe que vous utilisez pour vous connecter"
            />

            <StyledTextField
              fullWidth
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      sx={{ color: '#b0b0b0' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {password && confirmPassword && password !== confirmPassword && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Les mots de passe ne correspondent pas
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SecurityIcon sx={{ fontSize: 64, color: loading ? '#90caf9' : '#4caf50', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 2 }}>
                {loading ? 'Activation en cours...' : 'Prêt à activer'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                {loading 
                  ? 'Configuration du chiffrement de bout en bout...'
                  : 'Cliquez sur "Activer E2E" pour finaliser la configuration.'
                }
              </Typography>
            </Box>

            {loading && (
              <Box sx={{ mb: 4 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(144, 202, 249, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#90caf9',
                    }
                  }} 
                />
                <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1, textAlign: 'center' }}>
                  {progress}% terminé
                </Typography>
              </Box>
            )}

            {!loading && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                  Récapitulatif :
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mot de passe configuré"
                      secondary="Utilisation du mot de passe de votre compte"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#ffffff' },
                        '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Chiffrement AES-256-GCM"
                      secondary="Standard militaire"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#ffffff' },
                        '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dérivation PBKDF2"
                      secondary="100 000 itérations"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: '#ffffff' },
                        '& .MuiListItemText-secondary': { color: '#b0b0b0' }
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </Box>
        );

      default:
        return 'Étape inconnue';
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Configuration du chiffrement E2E
      </DialogTitle>
      
      <DialogContent>
        <StyledStepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              color: '#f44336',
              '& .MuiAlert-icon': { color: '#f44336' }
            }}
          >
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <StyledButton onClick={handleClose} disabled={loading}>
          Annuler
        </StyledButton>
        
        {activeStep > 0 && (
          <StyledButton onClick={handleBack} disabled={loading}>
            Retour
          </StyledButton>
        )}

        {activeStep < steps.length - 1 ? (
          <StyledButton
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            Suivant
          </StyledButton>
        ) : (
          <StyledButton
            variant="contained"
            onClick={handleActivateE2E}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
          >
            {loading ? 'Activation...' : 'Activer E2E'}
          </StyledButton>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default E2ESetupModal;