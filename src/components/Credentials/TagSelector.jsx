// src/components/Credentials/TagSelector.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/LocalOffer';
import LabelIcon from '@mui/icons-material/Label';
import CloseIcon from '@mui/icons-material/Close';

const TagChip = styled(Chip)(({ theme, tagcolor }) => ({
  margin: '0 4px 4px 0',
  backgroundColor: alpha(tagcolor || '#90caf9', 0.2),
  color: tagcolor || '#90caf9',
  borderRadius: 16,
  '& .MuiChip-deleteIcon': {
    color: alpha(tagcolor || '#90caf9', 0.7),
    '&:hover': {
      color: tagcolor || '#90caf9',
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: '#444' },
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

const TagSelector = ({ selectedTags = [], availableTags = [], onTagToggle, loading = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Réinitialiser la recherche quand on ouvre le sélecteur
    setSearchQuery('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTagToggle = (tag) => {
    if (onTagToggle) {
      onTagToggle(tag);
    }
    // Ne pas fermer le sélecteur après la sélection
  };

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isTagSelected = (tagId) => {
    return selectedTags.some(tag => tag.id === tagId);
  };

  return (
    <div>
      {/* Zone d'affichage des tags sélectionnés */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          minHeight: 36,
          mb: selectedTags.length > 0 ? 2 : 0 
        }}
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.name}
              tagcolor={tag.color}
              onDelete={() => handleTagToggle(tag)}
              size="small"
            />
          ))
        ) : null}
      </Box>

      {/* Bouton pour ouvrir le sélecteur de tags */}
      <Tooltip title="Ajouter des tags">
        <Chip
          icon={<TagIcon />}
          label="Ajouter des tags"
          onClick={handleClick}
          variant="outlined"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#b0b0b0',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        />
      </Tooltip>

      {/* Popover de sélection de tags */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            width: 300,
            maxHeight: 400,
            bgcolor: '#1e1e1e',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
          Sélectionner des tags
        </Typography>

        {/* Champ de recherche pour filtrer les tags */}
        <StyledTextField
          fullWidth
          size="small"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#b0b0b0' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{ color: '#b0b0b0' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <Divider sx={{ mb: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Liste des tags */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : availableTags.length === 0 ? (
          <Box sx={{ py: 2, textAlign: 'center', color: '#b0b0b0' }}>
            <Typography variant="body2">
              Aucun tag disponible.
            </Typography>
          </Box>
        ) : filteredTags.length === 0 ? (
          <Box sx={{ py: 2, textAlign: 'center', color: '#b0b0b0' }}>
            <Typography variant="body2">
              Aucun résultat pour "{searchQuery}".
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 250, overflow: 'auto', pb: 0 }}>
            {filteredTags.map((tag) => (
              <ListItem 
                key={tag.id} 
                dense 
                button 
                onClick={() => handleTagToggle(tag)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  backgroundColor: isTagSelected(tag.id) ? alpha(tag.color, 0.2) : 'transparent',
                  '&:hover': {
                    backgroundColor: isTagSelected(tag.id) 
                      ? alpha(tag.color, 0.3) 
                      : 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <LabelIcon sx={{ mr: 1, color: tag.color }} fontSize="small" />
                <ListItemText 
                  primary={tag.name} 
                  sx={{ 
                    color: isTagSelected(tag.id) ? tag.color : '#ffffff',
                    fontWeight: isTagSelected(tag.id) ? 500 : 400,
                  }} 
                />
                {isTagSelected(tag.id) && (
                  <Chip 
                    size="small" 
                    label="Sélectionné" 
                    sx={{ 
                      backgroundColor: alpha(tag.color, 0.3),
                      color: tag.color,
                      fontSize: '0.7rem',
                      height: 22,
                    }} 
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </div>
  );
};

export default TagSelector;