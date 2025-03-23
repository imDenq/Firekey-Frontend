// src/components/accsettings/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120, 
  height: 120,
  border: '4px solid #333',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileSectionPaper = styled(Paper)(({ theme }) => ({
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
};

const ProfileSection = ({ userInfo, setUserInfo, enqueueSnackbar, accessToken }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);

  // Gestion de l'upload photo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Veuillez sélectionner un fichier', { 
        variant: 'warning',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('profile_pic', selectedFile);

      // Exemple d'endpoint PATCH /api/user/me/photo/
      const res = await fetch('http://localhost:8001/api/user/me/photo/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error('Échec de l upload de la photo');
      }
      
      const data = await res.json();
      enqueueSnackbar('Photo de profil mise à jour', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });

      // Mettre à jour l'UI
      setUserInfo((prev) => ({
        ...prev,
        profilePic: data.profile_pic
      }));
      
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  // Modification de l'e-mail ou du nom d'utilisateur
  const handleSaveProfile = async () => {
    try {
      const body = {
        username: userInfo.username,
        email: userInfo.email,
        fullName: userInfo.fullName
      };
      
      // Exemple d'endpoint PATCH /api/user/me/
      const res = await fetch('http://localhost:8001/api/user/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        throw new Error('Impossible de mettre à jour le profil');
      }
      
      enqueueSnackbar('Profil mis à jour', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Erreur lors de la mise à jour du profil', { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    }
  };

  return (
    <>
      <ProfileSectionPaper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <StyledAvatar 
                src={previewUrl || userInfo.profilePic} 
                alt="Photo de profil"
              />
              <IconButton 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: 0, 
                  backgroundColor: '#444', 
                  color: '#fff',
                  '&:hover': { backgroundColor: '#666' } 
                }}
                component="label"
              >
                <EditIcon fontSize="small" />
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2, textAlign: 'center' }}>
              JPG ou PNG de 1 Mo maximum.<br />Une image carrée est recommandée.
            </Typography>
            {selectedFile && (
              <StyledButton 
                variant="contained" 
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadPhoto}
                color="primary"
                sx={{ mb: 2 }}
              >
                Enregistrer la photo
              </StyledButton>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
              Informations personnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nom complet"
                  variant="outlined"
                  fullWidth
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom d'utilisateur"
                  variant="outlined"
                  fullWidth
                  value={userInfo.username}
                  onChange={(e) => setUserInfo((prev) => ({ ...prev, username: e.target.value }))}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={userInfo.email}
                  onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Langue préférée"
                  variant="outlined"
                  fullWidth
                  value={userInfo.language}
                  onChange={(e) => setUserInfo((prev) => ({ ...prev, language: e.target.value }))}
                  SelectProps={{
                    native: true,
                  }}
                  sx={textFieldStyle}
                >
                  <option value="Français">Français</option>
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                  <option value="Deutsch">Deutsch</option>
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
              >
                Enregistrer les modifications
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </ProfileSectionPaper>

      <ProfileSectionPaper>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
          Préférences de compte
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={true} 
                name="darkMode"
                color="primary"
              />
            }
            label="Mode sombre"
            sx={{ color: '#ffffff' }}
          />
          <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4 }}>
            Activer le thème sombre de l'interface
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={true} 
                name="autoSave"
                color="primary"
              />
            }
            label="Sauvegarde automatique"
            sx={{ color: '#ffffff' }}
          />
          <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4 }}>
            Sauvegarder automatiquement vos modifications
          </Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch 
                checked={false} 
                name="betaFeatures"
                color="primary"
              />
            }
            label="Fonctionnalités bêta"
            sx={{ color: '#ffffff' }}
          />
          <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 4 }}>
            Accéder aux fonctionnalités expérimentales
          </Typography>
        </Box>
      </ProfileSectionPaper>
    </>
  );
};

export default ProfileSection;