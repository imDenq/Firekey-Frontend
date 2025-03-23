// src/components/accsettings/NotificationsSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  TextField,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const NotificationSectionPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  marginBottom: 24,
  background: '#1e1e1e',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-2px)'
  }
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
    transform: 'translateY(-2px)'
  }
}));

// Style commun pour les TextField
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#2a2a2a',
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
  '& .MuiSelect-icon': {
    color: '#b0b0b0',
  },
};

const NotificationsSection = ({ enqueueSnackbar }) => {
  // États pour les notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    productUpdates: true
  });

  const handleNotificationChange = (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked
    });
    
    enqueueSnackbar('Préférences de notification mises à jour', { 
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };

  return (
    <NotificationSectionPaper>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
        Préférences de notification
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch 
              checked={notificationSettings.emailAlerts} 
              onChange={handleNotificationChange}
              name="emailAlerts"
              color="primary"
            />
          }
          label="Alertes par email"
          sx={{ color: '#ffffff' }}
        />
        <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4, mb: 2 }}>
          Recevoir des emails pour les activités importantes de votre compte
        </Typography>

        <FormControlLabel
          control={
            <Switch 
              checked={notificationSettings.securityAlerts} 
              onChange={handleNotificationChange}
              name="securityAlerts"
              color="primary"
            />
          }
          label="Alertes de sécurité"
          sx={{ color: '#ffffff' }}
        />
        <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4, mb: 2 }}>
          Être alerté des activités suspectes ou des connexions depuis de nouveaux appareils
        </Typography>

        <FormControlLabel
          control={
            <Switch 
              checked={notificationSettings.productUpdates} 
              onChange={handleNotificationChange}
              name="productUpdates"
              color="primary"
            />
          }
          label="Mises à jour du produit"
          sx={{ color: '#ffffff' }}
        />
        <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4, mb: 2 }}>
          Recevoir des notifications sur les nouvelles fonctionnalités et améliorations
        </Typography>

        <FormControlLabel
          control={
            <Switch 
              checked={notificationSettings.marketingEmails} 
              onChange={handleNotificationChange}
              name="marketingEmails"
              color="primary"
            />
          }
          label="Emails marketing"
          sx={{ color: '#ffffff' }}
        />
        <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4 }}>
          Recevoir des offres promotionnelles et des contenus exclusifs
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
        Fréquence des notifications
      </Typography>
      <TextField
        select
        label="Fréquence des résumés par email"
        variant="outlined"
        fullWidth
        defaultValue="hebdomadaire"
        SelectProps={{
          native: true,
        }}
        sx={{ ...textFieldStyle, maxWidth: 400, mb: 3 }}
      >
        <option value="quotidien">Quotidien</option>
        <option value="hebdomadaire">Hebdomadaire</option>
        <option value="mensuel">Mensuel</option>
        <option value="jamais">Jamais</option>
      </TextField>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <StyledButton
          variant="contained"
          color="primary"
        >
          Enregistrer les préférences
        </StyledButton>
      </Box>
    </NotificationSectionPaper>
  );
};

export default NotificationsSection;