// src/components/Credentials/PasswordGenerator.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  Paper,
  Chip,
  Grid,
  Button,
  InputAdornment,
  Divider,
  Tooltip,
  LinearProgress,
  Fade
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled, alpha } from '@mui/material/styles';

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#90caf9',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px rgba(144, 202, 249, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#90caf9',
    color: '#0d1117',
  },
}));

const PasswordDisplayBox = styled(Paper)(({ theme }) => ({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 8,
  backgroundColor: alpha('#121212', 0.8),
  border: '1px solid rgba(144, 202, 249, 0.2)',
  backdropFilter: 'blur(4px)',
  marginBottom: 16,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha('#121212', 0.9),
    boxShadow: '0 0 10px rgba(144, 202, 249, 0.3)',
  },
}));

const StrengthMeter = styled(Box)(({ strength }) => {
  // Définir la couleur en fonction de la force du mot de passe
  let color;
  if (strength < 30) color = '#f44336'; // Faible - Rouge
  else if (strength < 60) color = '#ff9800'; // Moyen - Orange
  else if (strength < 80) color = '#ffeb3b'; // Bon - Jaune
  else color = '#4caf50'; // Excellent - Vert

  return {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
    '& .MuiLinearProgress-root': {
      height: 10,
      borderRadius: 5,
      backgroundColor: alpha(color, 0.2),
    },
    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
      backgroundColor: color,
    },
  };
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
}));

// Style commun pour les TextField
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#2a2a2a',
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
};

const PasswordGenerator = ({ onSelectPassword, initialPassword = '' }) => {
  // États du générateur
  const [password, setPassword] = useState(initialPassword || '');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecialChars, setUseSpecialChars] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState('');

  // Caractères pour le générateur
  const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  const DIGIT_CHARS = '0123456789';
  const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const SIMILAR_CHARS = 'iIl1oO0';

  // Générer un mot de passe au chargement si aucun n'est fourni
  useEffect(() => {
    if (!initialPassword) {
      generatePassword();
    } else {
      calculatePasswordStrength(initialPassword);
    }
  }, [initialPassword]);

  // Générer un nouveau mot de passe
  const generatePassword = () => {
    // S'assurer qu'au moins une option est sélectionnée
    if (!useUppercase && !useLowercase && !useDigits && !useSpecialChars) {
      setPassword('');
      setPasswordStrength(0);
      setStrengthLabel('');
      return;
    }

    // Construire le pool de caractères
    let charPool = '';
    if (useUppercase) charPool += UPPERCASE_CHARS;
    if (useLowercase) charPool += LOWERCASE_CHARS;
    if (useDigits) charPool += DIGIT_CHARS;
    if (useSpecialChars) charPool += SPECIAL_CHARS;

    // Retirer les caractères similaires si l'option est activée
    if (excludeSimilar) {
      for (const char of SIMILAR_CHARS) {
        charPool = charPool.replace(new RegExp(char, 'g'), '');
      }
    }

    // Vérifier si le pool n'est pas vide
    if (charPool.length === 0) {
      setPassword('');
      return;
    }

    // Générer le mot de passe
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }

    // Mise à jour avec le nouveau mot de passe
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
    
    // Appel au callback parent si fourni
    if (onSelectPassword) {
      onSelectPassword(newPassword);
    }
  };

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength(0);
      setStrengthLabel('');
      return;
    }

    let score = 0;
    
    // Longueur (40 points max)
    score += Math.min(pass.length * 2.5, 40);
    
    // Variété des caractères (60 points max)
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasDigits = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    
    if (hasUppercase) score += 15;
    if (hasLowercase) score += 15;
    if (hasDigits) score += 15;
    if (hasSpecial) score += 15;
    
    // Pénalité pour les répétitions
    // Rechercher des modèles répétitifs
    const repetitions = (pass.match(/(.)\1+/g) || []).length;
    score -= repetitions * 2;
    
    // Clamp score between 0-100
    score = Math.max(0, Math.min(score, 100));
    
    // Mis à jour de la force
    setPasswordStrength(score);
    
    // Définir le label de force
    if (score < 30) setStrengthLabel('Faible');
    else if (score < 60) setStrengthLabel('Moyen');
    else if (score < 80) setStrengthLabel('Bon');
    else setStrengthLabel('Excellent');
  };

  // Copier le mot de passe dans le presse-papiers
  const copyPassword = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password)
      .then(() => {
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 2000);
      })
      .catch(err => {
        console.error('Impossible de copier le mot de passe:', err);
      });
  };

  // Estimer le temps pour cracker le mot de passe
  const getPasswordCrackTime = () => {
    if (!password || password.length === 0) return 'N/A';
    
    // Estimer le nombre de tentatives requises (très simpliste)
    let characterSpace = 0;
    if (useUppercase || /[A-Z]/.test(password)) characterSpace += 26;
    if (useLowercase || /[a-z]/.test(password)) characterSpace += 26;
    if (useDigits || /[0-9]/.test(password)) characterSpace += 10;
    if (useSpecialChars || /[^A-Za-z0-9]/.test(password)) characterSpace += 33;
    
    if (characterSpace === 0) return 'N/A';
    
    // Formule approximative: nombre de caractères possibles ^ longueur du mot de passe
    const possibleCombinations = Math.pow(characterSpace, password.length);
    
    // Supposer 10 milliards de tentatives par seconde (force brute)
    const secondsToCrack = possibleCombinations / 10000000000;
    
    // Convertir en unité compréhensible
    if (secondsToCrack < 60) {
      return `${Math.round(secondsToCrack)} secondes`;
    } else if (secondsToCrack < 3600) {
      return `${Math.round(secondsToCrack / 60)} minutes`;
    } else if (secondsToCrack < 86400) {
      return `${Math.round(secondsToCrack / 3600)} heures`;
    } else if (secondsToCrack < 31536000) {
      return `${Math.round(secondsToCrack / 86400)} jours`;
    } else if (secondsToCrack < 31536000 * 100) {
      return `${Math.round(secondsToCrack / 31536000)} ans`;
    } else if (secondsToCrack < 31536000 * 1000) {
      return `${Math.round(secondsToCrack / (31536000 * 100))} siècles`;
    } else {
      return `${Math.round(secondsToCrack / (31536000 * 1000))} millénaires`;
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return '#f44336'; // Faible
    if (passwordStrength < 60) return '#ff9800'; // Moyen
    if (passwordStrength < 80) return '#ffeb3b'; // Bon
    return '#4caf50'; // Excellent
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Affichage du mot de passe généré */}
      <PasswordDisplayBox>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            fontWeight: 500,
            letterSpacing: 1,
            color: '#fff',
            wordBreak: 'break-all',
            flexGrow: 1,
            mr: 1
          }}
        >
          {showPassword ? password : password.replace(/./g, '•')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {passwordCopied && (
            <Fade in={passwordCopied}>
              <Chip
                label="Copié !"
                size="small"
                color="success"
                sx={{ mr: 1, height: 24 }}
              />
            </Fade>
          )}
          <Tooltip title={showPassword ? "Masquer" : "Afficher"}>
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              sx={{ color: '#b0b0b0' }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Copier">
            <IconButton
              onClick={copyPassword}
              sx={{ color: '#90caf9' }}
              disabled={!password}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Générer un nouveau mot de passe">
            <IconButton
              onClick={generatePassword}
              sx={{ color: '#4caf50' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </PasswordDisplayBox>

      {/* Indicateur de force */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            Force du mot de passe
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500, 
              color: getStrengthColor()
            }}
          >
            {strengthLabel}
          </Typography>
        </Box>
        <StrengthMeter strength={passwordStrength}>
          <LinearProgress 
            variant="determinate" 
            value={passwordStrength} 
          />
        </StrengthMeter>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {passwordStrength >= 80 ? (
            <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: 16, color: passwordStrength < 30 ? '#f44336' : '#ff9800' }} />
          )}
          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
            Temps estimé pour cracker : <span style={{ color: '#fff', fontWeight: 500 }}>{getPasswordCrackTime()}</span>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Options du générateur */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#fff', mb: 1, fontWeight: 500 }}>
          Longueur : {length} caractères
        </Typography>
        <StyledSlider
          value={length}
          onChange={(e, newValue) => {
            setLength(newValue);
            // Regénérer le mot de passe quand la longueur change
            setTimeout(() => generatePassword(), 100);
          }}
          min={8}
          max={32}
          step={1}
          valueLabelDisplay="auto"
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useUppercase}
                onChange={(e) => {
                  setUseUppercase(e.target.checked);
                  // Ne pas désactiver si c'est la dernière option active
                  if (!e.target.checked && !useLowercase && !useDigits && !useSpecialChars) {
                    return;
                  }
                  setTimeout(() => generatePassword(), 100);
                }}
                sx={{
                  color: '#b0b0b0',
                  '&.Mui-checked': { color: '#90caf9' },
                }}
              />
            }
            label="Majuscules (A-Z)"
            sx={{ color: '#e0e0e0' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useLowercase}
                onChange={(e) => {
                  setUseLowercase(e.target.checked);
                  // Ne pas désactiver si c'est la dernière option active
                  if (!e.target.checked && !useUppercase && !useDigits && !useSpecialChars) {
                    return;
                  }
                  setTimeout(() => generatePassword(), 100);
                }}
                sx={{
                  color: '#b0b0b0',
                  '&.Mui-checked': { color: '#90caf9' },
                }}
              />
            }
            label="Minuscules (a-z)"
            sx={{ color: '#e0e0e0' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useDigits}
                onChange={(e) => {
                  setUseDigits(e.target.checked);
                  // Ne pas désactiver si c'est la dernière option active
                  if (!e.target.checked && !useUppercase && !useLowercase && !useSpecialChars) {
                    return;
                  }
                  setTimeout(() => generatePassword(), 100);
                }}
                sx={{
                  color: '#b0b0b0',
                  '&.Mui-checked': { color: '#90caf9' },
                }}
              />
            }
            label="Chiffres (0-9)"
            sx={{ color: '#e0e0e0' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useSpecialChars}
                onChange={(e) => {
                  setUseSpecialChars(e.target.checked);
                  // Ne pas désactiver si c'est la dernière option active
                  if (!e.target.checked && !useUppercase && !useLowercase && !useDigits) {
                    return;
                  }
                  setTimeout(() => generatePassword(), 100);
                }}
                sx={{
                  color: '#b0b0b0',
                  '&.Mui-checked': { color: '#90caf9' },
                }}
              />
            }
            label="Caractères spéciaux (!@#$%&*)"
            sx={{ color: '#e0e0e0' }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={excludeSimilar}
                onChange={(e) => {
                  setExcludeSimilar(e.target.checked);
                  setTimeout(() => generatePassword(), 100);
                }}
                sx={{
                  color: '#b0b0b0',
                  '&.Mui-checked': { color: '#90caf9' },
                }}
              />
            }
            label="Exclure les caractères similaires (i, l, 1, I, o, 0, O)"
            sx={{ color: '#e0e0e0' }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <StyledButton
          variant="outlined"
          color="primary"
          onClick={() => generatePassword()}
          startIcon={<RefreshIcon />}
        >
          Régénérer
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => {
            copyPassword();
            if (onSelectPassword) onSelectPassword(password);
          }}
          startIcon={<ContentCopyIcon />}
          disabled={!password}
        >
          Utiliser ce mot de passe
        </StyledButton>
      </Box>
    </Box>
  );
};

export default PasswordGenerator;