// src/pages/ShareManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Alert,
  CircularProgress,
  Fade,
  Collapse,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { styled, alpha } from '@mui/material/styles';

// Composants réutilisables
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ShareItem from '../components/Shares/ShareItem';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TimerIcon from '@mui/icons-material/Timer';

// Styled components
const StyledToolbar = styled(Paper)(({ theme }) => ({
  padding: '16px 20px',
  borderRadius: 12,
  marginBottom: 24,
  backgroundColor: '#1e1e1e',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    height: 44,
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

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 16,
  backgroundColor: '#1e1e1e',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 300,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  '& .MuiDialogTitle-root': {
    fontSize: '1.2rem',
    fontWeight: 600,
    padding: '20px 24px',
    color: '#ffffff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
  },
  '& .MuiDialogActions-root': {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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

export default function ShareManager() {
  const drawerWidth = 240;
  const { enqueueSnackbar } = useSnackbar();
  const [shares, setShares] = useState([]);
  const [filteredShares, setFilteredShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'active', 'expired'
  const accessToken = localStorage.getItem('accessToken') || '';

  // États pour le tri et filtrage
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const openSortMenu = Boolean(sortAnchorEl);
  const openFilterMenu = Boolean(filterAnchorEl);

  // États pour la suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteShare, setDeleteShare] = useState(null);

  // États pour édition
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editShare, setEditShare] = useState(null);
  const [editExpiryDays, setEditExpiryDays] = useState(1);
  const [editAccessLimit, setEditAccessLimit] = useState(1);
  const [editAccessLimitEnabled, setEditAccessLimitEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    fetchShares();
  }, []);

  // Effet pour filtrer les partages 
  useEffect(() => {
    if (!shares.length) {
      setFilteredShares([]);
      return;
    }

    let filtered = [...shares];

    // Appliquer le filtre
    if (selectedFilter === 'active') {
      filtered = filtered.filter(share => !share.is_expired);
    } else if (selectedFilter === 'expired') {
      filtered = filtered.filter(share => share.is_expired);
    }

    // Appliquer la recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(share => 
        share.credential.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShares(filtered);
  }, [shares, searchQuery, selectedFilter]);

  // Récupérer la liste des partages
  const fetchShares = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:8001/api/shares/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la récupération des partages');
      }

      const data = await res.json();
      setShares(data);
      setFilteredShares(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
      enqueueSnackbar(err.message || 'Impossible de récupérer la liste des partages', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Gérer la suppression d'un partage
  const handleDeleteClick = (share) => {
    setDeleteShare(share);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteShare) return;

    try {
      const res = await fetch(`http://localhost:8001/api/shares/${deleteShare.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du partage');
      }

      // Mettre à jour l'état local
      setShares(prevShares => prevShares.filter(share => share.id !== deleteShare.id));
      enqueueSnackbar('Lien de partage supprimé avec succès', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (err) {
      console.error('Erreur:', err);
      enqueueSnackbar(err.message || 'Impossible de supprimer le partage', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setDeleteModalOpen(false);
      setDeleteShare(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteShare(null);
  };

  // Gérer l'édition d'un partage
  const handleEditClick = (share) => {
    setEditShare(share);
    
    // Initialiser les valeurs du formulaire d'édition
    const daysRemaining = calculateDaysRemaining(share.expires_at);
    setEditExpiryDays(Math.max(1, Math.round(daysRemaining)));
    
    setEditAccessLimitEnabled(share.max_access_count !== null);
    setEditAccessLimit(share.max_access_count || 1);
    
    setEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!editShare) return;
    setIsSubmitting(true);

    try {
      // Convertir le nombre de jours en une nouvelle date d'expiration 
      // Calculer la nouvelle date d'expiration en ajoutant les jours à partir de maintenant
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + editExpiryDays);
      
      const payload = {
        expires_at: newExpiryDate.toISOString(),
        max_access_count: editAccessLimitEnabled ? editAccessLimit : null
      };

      const res = await fetch(`http://localhost:8001/api/shares/${editShare.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du partage');
      }

      const updatedShare = await res.json();

      // Mettre à jour l'état local
      setShares(prevShares => 
        prevShares.map(share => share.id === editShare.id ? updatedShare : share)
      );

      enqueueSnackbar('Lien de partage mis à jour avec succès', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (err) {
      console.error('Erreur:', err);
      enqueueSnackbar(err.message || 'Impossible de mettre à jour le partage', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsSubmitting(false);
      setEditModalOpen(false);
      setEditShare(null);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditShare(null);
  };

  // Fonctions utilitaires
  const calculateDaysRemaining = (expiryDateString) => {
    const expiryDate = new Date(expiryDateString);
    const currentDate = new Date();
    const differenceInTime = expiryDate.getTime() - currentDate.getTime();
    return Math.max(0, Math.ceil(differenceInTime / (1000 * 3600 * 24)));
  };

  // Gestion des menus
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    handleFilterMenuClose();
  };

  const handleSort = (sortType) => {
    let sortedShares = [...shares];

    if (sortType === 'newest') {
      sortedShares.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortType === 'oldest') {
      sortedShares.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortType === 'expire-soon') {
      sortedShares.sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at));
    } else if (sortType === 'expire-later') {
      sortedShares.sort((a, b) => new Date(b.expires_at) - new Date(a.expires_at));
    } else if (sortType === 'most-used') {
      sortedShares.sort((a, b) => b.access_count - a.access_count);
    } else if (sortType === 'least-used') {
      sortedShares.sort((a, b) => a.access_count - b.access_count);
    }

    setShares(sortedShares);
    handleSortMenuClose();
  };

  // Rendu du composant
  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />

        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 1 }}>
              Gestion des Partages
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              Gérez vos liens de partage de credentials et contrôlez leur accès.
            </Typography>
          </Box>

          <StyledToolbar>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={fetchShares}
              >
                Actualiser
              </StyledButton>

              <Box sx={{ position: 'relative' }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterMenuOpen}
                  endIcon={openFilterMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Filtrer
                </StyledButton>
                <Box
                  component="div"
                  role="menu"
                  open={openFilterMenu}
                  onClose={handleFilterMenuClose}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    zIndex: 1000,
                    mt: 1,
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    width: 180,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    display: openFilterMenu ? 'block' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      backgroundColor: selectedFilter === 'all' ? alpha('#90caf9', 0.15) : 'transparent',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleFilterChange('all')}
                  >
                    <Typography variant="body2">Tous les partages</Typography>
                  </Box>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      backgroundColor: selectedFilter === 'active' ? alpha('#90caf9', 0.15) : 'transparent',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleFilterChange('active')}
                  >
                    <Typography variant="body2">Actifs uniquement</Typography>
                  </Box>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      backgroundColor: selectedFilter === 'expired' ? alpha('#90caf9', 0.15) : 'transparent',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleFilterChange('expired')}
                  >
                    <Typography variant="body2">Expirés uniquement</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ position: 'relative' }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  startIcon={<SortIcon />}
                  onClick={handleSortMenuOpen}
                  endIcon={openSortMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Trier
                </StyledButton>
                <Box
                  component="div"
                  role="menu"
                  open={openSortMenu}
                  onClose={handleSortMenuClose}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '100%',
                    zIndex: 1000,
                    mt: 1,
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    width: 200,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    display: openSortMenu ? 'block' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('newest')}
                  >
                    <Typography variant="body2">Plus récents en premier</Typography>
                  </Box>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('oldest')}
                  >
                    <Typography variant="body2">Plus anciens en premier</Typography>
                  </Box>
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('expire-soon')}
                  >
                    <Typography variant="body2">Expire bientôt</Typography>
                  </Box>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('expire-later')}
                  >
                    <Typography variant="body2">Expire plus tard</Typography>
                  </Box>
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('most-used')}
                  >
                    <Typography variant="body2">Plus utilisés</Typography>
                  </Box>
                  <Box
                    sx={{
                      py: 1,
                      px: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha('#90caf9', 0.08) },
                    }}
                    onClick={() => handleSort('least-used')}
                  >
                    <Typography variant="body2">Moins utilisés</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <SearchBar
              placeholder="Rechercher..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#b0b0b0' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: '300px' } }}
            />
          </StyledToolbar>

          {/* Affichage du filtre actif s'il y en a un */}
          {selectedFilter !== 'all' && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mr: 1 }}>
                Filtre actif:
              </Typography>
              <Chip
                label={selectedFilter === 'active' ? 'Partages actifs' : 'Partages expirés'}
                color="primary"
                onDelete={() => setSelectedFilter('all')}
                size="small"
                sx={{ borderRadius: '4px' }}
              />
            </Box>
          )}

          {/* Affichage pendant le chargement */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {/* Affichage des erreurs */}
          {error && !loading && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                color: '#ff5252',
                '& .MuiAlert-icon': {
                  color: '#ff5252'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* État vide - aucun partage */}
          {!loading && !error && shares.length === 0 && (
            <Fade in={true}>
              <EmptyStateContainer>
                <LinkOffIcon sx={{ fontSize: 64, color: '#90caf9', mb: 3 }} />
                <Typography variant="h5" sx={{ color: '#ffffff', mb: 2, fontWeight: 500 }}>
                  Aucun lien de partage créé
                </Typography>
                <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 4, maxWidth: 500 }}>
                  Vous n'avez pas encore partagé de credentials. Créez un nouveau lien de partage depuis la page Credentials.
                </Typography>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/credentials')}
                >
                  Aller à Credentials
                </StyledButton>
              </EmptyStateContainer>
            </Fade>
          )}

          {/* Résultats de recherche vides */}
          {!loading && !error && shares.length > 0 && filteredShares.length === 0 && (
            <Fade in={true}>
              <EmptyStateContainer>
                <SearchIcon sx={{ fontSize: 40, color: '#90caf9', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  Aucun résultat trouvé
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                  Essayez d'autres termes de recherche ou modifiez vos filtres.
                </Typography>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                >
                  Réinitialiser les filtres
                </StyledButton>
              </EmptyStateContainer>
            </Fade>
          )}

          {/* Liste des partages */}
          {!loading && !error && filteredShares.length > 0 && (
            <Grid container spacing={3}>
              {filteredShares.map((share) => (
                <Grid item xs={12} key={share.id}>
                  <Fade in={true} timeout={300}>
                    <StyledCard>
                      <ShareItem 
                        share={share}
                        onEditClick={() => handleEditClick(share)}
                        onDeleteClick={() => handleDeleteClick(share)}
                      />
                    </StyledCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Statistiques */}
          {!loading && !error && shares.length > 0 && (
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                {filteredShares.length} partage
                {filteredShares.length > 1 ? 's' : ''} affiché
                {filteredShares.length > 1 ? 's' : ''}
                {selectedFilter !== 'all' || searchQuery ? ` sur ${shares.length} total` : ''}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Modale de confirmation de suppression */}
      <StyledDialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Supprimer le lien de partage
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#e0e0e0', mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer ce lien de partage pour <span style={{ fontWeight: 600 }}>{deleteShare?.credential?.name}</span> ?
          </Typography>
          <Alert 
            severity="warning" 
            sx={{ 
              backgroundColor: 'rgba(255, 152, 0, 0.1)', 
              color: '#ffb74d',
              '& .MuiAlert-icon': {
                color: '#ffb74d'
              }
            }}
          >
            Cette action est irréversible. Le lien ne sera plus accessible.
          </Alert>
        </DialogContent>
        <DialogActions>
          <StyledButton 
            onClick={handleDeleteCancel} 
            color="inherit"
          >
            Annuler
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteConfirm}
          >
            Supprimer
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Modale d'édition de partage */}
      <StyledDialog
        open={editModalOpen}
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Modifier le lien de partage
        </DialogTitle>
        <DialogContent>
          {editShare && (
            <>
              <Typography variant="subtitle1" sx={{ color: '#ffffff', mb: 3, mt: 1 }}>
                Modifier les paramètres du lien de partage pour <span style={{ fontWeight: 600 }}>{editShare.credential?.name}</span>
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#90caf9' }} />
                  Nouvelle date d'expiration
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={editExpiryDays}
                    onChange={(e, newValue) => setEditExpiryDays(newValue)}
                    step={1}
                    min={1}
                    max={30}
                    valueLabelDisplay="auto"
                    aria-labelledby="expiry-slider"
                    sx={{ 
                      color: '#90caf9',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                  <TextField
                    variant="outlined"
                    value={editExpiryDays}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 30) {
                        setEditExpiryDays(value);
                      }
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">jours</InputAdornment>,
                    }}
                    sx={{ ...textFieldStyle, width: '120px' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#b0b0b0', mt: 1, display: 'block' }}>
                  Le lien expirera après {editExpiryDays} jour{editExpiryDays > 1 ? 's' : ''} à partir d'aujourd'hui.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editAccessLimitEnabled}
                      onChange={(e) => setEditAccessLimitEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
                      <TimerIcon fontSize="small" sx={{ mr: 1, color: '#90caf9' }} />
                      Limiter le nombre d'accès
                    </Typography>
                  }
                />
                
                {editAccessLimitEnabled && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, ml: 4 }}>
                    <Slider
                      value={editAccessLimit}
                      onChange={(e, newValue) => setEditAccessLimit(newValue)}
                      step={1}
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      aria-labelledby="access-slider"
                      sx={{ 
                        color: '#90caf9',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#ffffff',
                        },
                      }}
                    />
                    <TextField
                      variant="outlined"
                      value={editAccessLimit}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          setEditAccessLimit(value);
                        }
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">accès</InputAdornment>,
                      }}
                      sx={{ ...textFieldStyle, width: '120px' }}
                    />
                  </Box>
                )}
                
                <Typography variant="caption" sx={{ color: '#b0b0b0', mt: 1, display: 'block', ml: editAccessLimitEnabled ? 4 : 0 }}>
                  {editAccessLimitEnabled 
                    ? `Le lien sera désactivé après ${editAccessLimit} utilisation${editAccessLimit > 1 ? 's' : ''}.`
                    : 'Le lien pourra être utilisé un nombre illimité de fois avant expiration.'}
                </Typography>
              </Box>

              <Alert 
                severity="info" 
                sx={{ 
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: '#90caf9',
                  '& .MuiAlert-icon': {
                    color: '#90caf9'
                  }
                }}
              >
                Note: Les modifications n'affecteront pas les accès déjà comptabilisés.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <StyledButton 
            onClick={handleEditCancel} 
            color="inherit"
          >
            Annuler
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="primary"
            onClick={handleEditConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}