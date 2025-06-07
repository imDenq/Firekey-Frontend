// src/components/Credentials/TagsManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  Divider,
  Paper,
  Avatar,
  Grid,
  Fade,
  Collapse
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: '10px 16px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: variant === 'contained' ? '0 4px 15px rgba(0, 0, 0, 0.3)' : 'none',
    transform: 'translateY(-2px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
}));

const TagsList = styled(List)(({ theme }) => ({
  maxHeight: 400,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.25)',
    }
  },
}));

const ColorPickerContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#252525',
  padding: 16,
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: 16,
  marginBottom: 16,
}));

const ColorSwatch = styled(Box)(({ color }) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  backgroundColor: color || '#90caf9',
  cursor: 'pointer',
  border: '2px solid transparent',
  transition: 'all 0.2s',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.15)',
    zIndex: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
}));

const TagItem = styled(ListItem)(({ theme, tagcolor }) => ({
  marginBottom: 8,
  backgroundColor: alpha(tagcolor || '#90caf9', 0.07),
  borderRadius: 8,
  border: `1px solid ${alpha(tagcolor || '#90caf9', 0.15)}`,
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha(tagcolor || '#90caf9', 0.12),
    transform: 'translateX(4px)',
  },
}));

const SelectedCheckIcon = styled(CheckIcon)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  fontSize: 20,
  filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
}));

// Palette de couleurs prédéfinies
const COLORS = [
  '#f44336', // Rouge
  '#e91e63', // Rose
  '#9c27b0', // Violet
  '#673ab7', // Violet foncé
  '#3f51b5', // Indigo
  '#2196f3', // Bleu
  '#03a9f4', // Bleu clair
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Vert
  '#8bc34a', // Vert clair
  '#cddc39', // Lime
  '#ffeb3b', // Jaune
  '#ffc107', // Ambre
  '#ff9800', // Orange
  '#ff5722', // Orange foncé
  '#795548', // Marron
  '#607d8b', // Bleu gris
  '#9e9e9e', // Gris
  '#000000', // Noir
];

const TagsManager = ({ open, onClose, onTagsChange }) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#90caf9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [deleteConfirmTag, setDeleteConfirmTag] = useState(null);
  const [success, setSuccess] = useState('');
  const accessToken = localStorage.getItem('accessToken') || '';

  // Charger les tags au premier affichage de la modale
  useEffect(() => {
    if (open) {
      fetchTags();
    }
  }, [open]);

  // Réinitialiser les états quand la modale se ferme
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess('');
      setDeleteConfirmTag(null);
      setShowColorPicker(false);
    }
  }, [open]);

  // Fonction pour récupérer les tags
  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/tags/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des tags');
      }
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de récupérer les tags. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un nouveau tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setError('Le nom du tag ne peut pas être vide');
      return;
    }

    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      setError('Un tag avec ce nom existe déjà');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/tags/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
        }),
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la création du tag');
      }
      const newTag = await res.json();
      setTags([...tags, newTag]);
      setNewTagName('');
      setSuccess(`Tag "${newTag.name}" créé avec succès`);
      setTimeout(() => setSuccess(''), 3000);
      
      if (onTagsChange) onTagsChange();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de créer le tag. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour confirmer la suppression d'un tag
  const confirmDeleteTag = (tag) => {
    setDeleteConfirmTag(tag);
  };

  // Fonction pour annuler la suppression
  const cancelDeleteTag = () => {
    setDeleteConfirmTag(null);
  };

  // Fonction pour supprimer un tag
  const handleDeleteTag = async (tagId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://firekey.theokaszak.fr/api/tags/${tagId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du tag');
      }
      const deletedTag = tags.find(tag => tag.id === tagId);
      setTags(tags.filter(tag => tag.id !== tagId));
      setDeleteConfirmTag(null);
      setSuccess(`Tag "${deletedTag?.name}" supprimé avec succès`);
      setTimeout(() => setSuccess(''), 3000);
      
      if (onTagsChange) onTagsChange();
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de supprimer le tag. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
          position: 'relative',
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <LocalOfferIcon sx={{ mr: 1.5, color: '#90caf9' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Gestion des Tags
        </Typography>
        <IconButton
          aria-label="fermer"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#b0b0b0',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Formulaire d'ajout de tag */}
          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              p: 3, 
              borderRadius: 2,
              mb: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Créer un nouveau tag
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <StyledTextField
                label="Nom du tag"
                variant="outlined"
                fullWidth
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Ex: Important, Travail, Personnel..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !showColorPicker) {
                    handleAddTag();
                  }
                }}
              />
              
              <Button
                variant="outlined"
                onClick={toggleColorPicker}
                sx={{
                  height: 56,
                  minWidth: 56,
                  backgroundColor: alpha(newTagColor, 0.2),
                  color: newTagColor,
                  borderRadius: 2,
                  borderColor: alpha(newTagColor, 0.4),
                  '&:hover': {
                    borderColor: alpha(newTagColor, 0.6),
                    backgroundColor: alpha(newTagColor, 0.3),
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
                endIcon={showColorPicker ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                <ColorLensIcon />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Couleur
                </Box>
              </Button>
              
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleAddTag}
                disabled={loading || !newTagName.trim()}
                startIcon={<AddIcon />}
                sx={{
                  height: 56,
                  minWidth: 120
                }}
              >
                Ajouter
              </StyledButton>
            </Box>
            
            {/* Sélecteur de couleur intégré */}
            <Collapse in={showColorPicker}>
              <ColorPickerContainer elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Sélectionnez une couleur:
                  </Typography>
                  <Typography variant="body2" sx={{ color: newTagColor, fontWeight: 500 }}>
                    {newTagColor}
                  </Typography>
                </Box>
                
                <Grid container spacing={1}>
                  {COLORS.map(color => (
                    <Grid item key={color} xs={2} sm={1.5}>
                      <Tooltip title={color} arrow>
                        <Box sx={{ position: 'relative' }}>
                          <ColorSwatch 
                            color={color}
                            onClick={() => {
                              setNewTagColor(color);
                            }}
                            sx={{
                              boxShadow: newTagColor === color ? `0 0 0 2px ${color}, 0 0 0 4px white` : 'none',
                            }}
                          />
                          {newTagColor === color && (
                            <SelectedCheckIcon />
                          )}
                        </Box>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </ColorPickerContainer>
            </Collapse>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlinedIcon sx={{ color: '#b0b0b0', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Les tags vous permettent d'organiser vos credentials et de les retrouver facilement.
              </Typography>
            </Box>
          </Paper>

          {/* Messages d'erreur et de succès */}
          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                  color: '#f44336',
                  '& .MuiAlert-icon': {
                    color: '#f44336'
                  }
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </Fade>
          )}
          
          {success && (
            <Fade in={!!success}>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2, 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  color: '#4caf50',
                  '& .MuiAlert-icon': {
                    color: '#4caf50'
                  }
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Titre de la liste */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Vos tags ({tags.length})
            </Typography>
            {tags.length > 0 && (
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Cliquez sur <DeleteIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /> pour supprimer un tag
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Liste des tags */}
        <Box sx={{ position: 'relative', minHeight: 200, maxHeight: 400 }}>
          {loading && tags.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress size={40} thickness={4} sx={{ color: '#90caf9' }} />
            </Box>
          ) : tags.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6, 
              px: 3,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#b0b0b0',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mb: 2 }}>
                <LocalOfferIcon sx={{ color: '#b0b0b0' }} />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Aucun tag créé
              </Typography>
              <Typography variant="body2">
                Créez votre premier tag pour mieux organiser vos credentials.
              </Typography>
            </Box>
          ) : (
            <TagsList sx={{ px: 3, py: 2 }}>
              {tags.map((tag) => (
                <Fade key={tag.id} in={true} timeout={300}>
                  {deleteConfirmTag && deleteConfirmTag.id === tag.id ? (
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 2,
                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                        borderRadius: 2,
                        p: 2,
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#f44336' }}>
                            Confirmer la suppression
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            Le tag "{tag.name}" sera définitivement supprimé
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={cancelDeleteTag}
                            sx={{ 
                              color: '#b0b0b0',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }}
                          >
                            <ArrowBackIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTag(tag.id)}
                            sx={{ 
                              color: '#ffffff',
                              backgroundColor: 'rgba(244, 67, 54, 0.5)',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.7)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ) : (
                    <TagItem
                      tagcolor={tag.color}
                      sx={{ pl: 2 }}
                    >
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: 8, 
                        backgroundColor: tag.color,
                        mr: 2,
                        boxShadow: `0 0 0 2px ${alpha(tag.color, 0.3)}`
                      }} />
                      
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {tag.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            {tag.credential_count} credential{tag.credential_count !== 1 ? 's' : ''}
                          </Typography>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label="supprimer"
                          onClick={() => confirmDeleteTag(tag)}
                          sx={{ 
                            color: '#b0b0b0',
                            '&:hover': {
                              color: '#f44336',
                              backgroundColor: 'rgba(244, 67, 54, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </TagItem>
                  )}
                </Fade>
              ))}
            </TagsList>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', px: 3, py: 2 }}>
        <StyledButton onClick={onClose} color="inherit">
          Fermer
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default TagsManager;