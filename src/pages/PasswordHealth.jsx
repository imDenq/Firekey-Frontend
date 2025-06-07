// src/pages/PasswordHealth.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Badge,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { styled, alpha } from '@mui/material/styles';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BugReportIcon from '@mui/icons-material/BugReport';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

// Components
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: '#1e1e1e',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
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

const SecurityScoreCard = styled(Paper)(({ score }) => ({
  padding: 24,
  borderRadius: 16,
  background: score >= 80 
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
    : score >= 60 
    ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
  border: `2px solid ${score >= 80 ? 'rgba(76, 175, 80, 0.3)' : score >= 60 ? 'rgba(255, 152, 0, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336',
  }
}));

const BreachCard = styled(Card)(({ severity }) => ({
  borderRadius: 12,
  backgroundColor: '#1e1e1e',
  border: `1px solid ${severity === 'critical' ? '#f44336' : severity === 'high' ? '#ff9800' : '#2196f3'}`,
  marginBottom: 16,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: `0 4px 12px ${alpha(severity === 'critical' ? '#f44336' : severity === 'high' ? '#ff9800' : '#2196f3', 0.3)}`,
  }
}));

const ScoreCircle = styled(Box)(({ score }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `conic-gradient(${score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336'} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: '50%',
    backgroundColor: '#1e1e1e',
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: 24,
  '& .MuiTabs-indicator': {
    backgroundColor: '#90caf9',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 0,
    padding: '12px 20px',
    color: '#b0b0b0',
    '&.Mui-selected': {
      color: '#90caf9',
      fontWeight: 600,
    },
  },
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

const IconCounter = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: 12,
  backgroundColor: alpha(color, 0.1),
  marginBottom: 16
}));

export default function PasswordHealth() {
  const drawerWidth = 240;
  const { enqueueSnackbar } = useSnackbar();
  const accessToken = localStorage.getItem('accessToken') || '';

  // États principaux
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // États pour les données
  const [securityScore, setSecurityScore] = useState(0);
  const [credentials, setCredentials] = useState([]);
  const [breaches, setBreaches] = useState([]);
  const [weakPasswords, setWeakPasswords] = useState([]);
  const [duplicatePasswords, setDuplicatePasswords] = useState([]);
  const [oldPasswords, setOldPasswords] = useState([]);
  const [lastScanDate, setLastScanDate] = useState(null);
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalCredentials: 0,
    breachedCredentials: 0,
    weakCredentials: 0,
    duplicateCredentials: 0,
    oldCredentials: 0,
    strongCredentials: 0
  });

  // États pour les modales et menus
  const [breachDetailsOpen, setBreachDetailsOpen] = useState(false);
  const [selectedBreach, setSelectedBreach] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [expandedBreaches, setExpandedBreaches] = useState({});

  // Données simulées pour les fuites
  const generateFakeBreaches = (credentials) => {
    const breachSources = [
      { name: 'LinkedIn Data Breach', type: 'business', icon: BusinessIcon },
      { name: 'Adobe Security Incident', type: 'cloud', icon: CloudIcon },
      { name: 'Dropbox Credential Leak', type: 'cloud', icon: StorageIcon },
      { name: 'Yahoo Mail Breach', type: 'email', icon: EmailIcon },
      { name: 'Facebook Data Leak', type: 'social', icon: PersonIcon },
      { name: 'Twitter Security Breach', type: 'social', icon: PersonIcon },
      { name: 'Netflix Account Leak', type: 'entertainment', icon: CloudIcon },
      { name: 'Banking Trojan Campaign', type: 'finance', icon: AccountBalanceIcon },
      { name: 'E-commerce Platform Hack', type: 'business', icon: BusinessIcon },
      { name: 'Gaming Platform Breach', type: 'entertainment', icon: CloudIcon }
    ];

    const severityLevels = ['critical', 'high', 'medium', 'low'];
    const fakeBreaches = [];
    
    // Prendre un échantillon aléatoire de credentials (20-60% d'entre eux)
    const sampleSize = Math.max(1, Math.floor(credentials.length * (0.2 + Math.random() * 0.4)));
    const sampledCredentials = credentials
      .sort(() => 0.5 - Math.random())
      .slice(0, sampleSize);

    sampledCredentials.forEach((cred, index) => {
      if (Math.random() < 0.7) { // 70% de chance d'avoir une fuite
        const breach = breachSources[Math.floor(Math.random() * breachSources.length)];
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        const daysAgo = Math.floor(Math.random() * 180) + 1; // 1 à 180 jours
        const breachDate = new Date();
        breachDate.setDate(breachDate.getDate() - daysAgo);

        fakeBreaches.push({
          id: `breach_${index}`,
          credentialId: cred.id,
          credentialName: cred.name,
          credentialEmail: cred.email || 'email@exemple.com',
          sourceName: breach.name,
          sourceType: breach.type,
          sourceIcon: breach.icon,
          severity: severity,
          date: breachDate.toISOString(),
          description: `Votre adresse email a été trouvée dans une fuite de données de ${breach.name}.`,
          affectedData: ['Email', 'Mot de passe', Math.random() > 0.5 ? 'Informations personnelles' : 'Données de connexion'].filter(Boolean),
          recordsAffected: Math.floor(Math.random() * 50000000) + 100000,
          isNew: daysAgo <= 7,
          isResolved: Math.random() < 0.3 // 30% déjà résolues
        });
      }
    });

    return fakeBreaches.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Fonction pour analyser les mots de passe
  const analyzePasswords = (credentials) => {
    const weak = [];
    const duplicates = [];
    const old = [];
    
    credentials.forEach(cred => {
      // Simuler la force du mot de passe
      const strength = cred.strength || ['weak', 'medium', 'strong'][Math.floor(Math.random() * 3)];
      
      if (strength === 'weak') {
        weak.push(cred);
      }
      
      // Simuler les doublons (20% de chance)
      if (Math.random() < 0.2) {
        duplicates.push(cred);
      }
      
      // Simuler les anciens mots de passe (30% de chance)
      if (Math.random() < 0.3) {
        old.push(cred);
      }
    });

    return { weak, duplicates, old };
  };

  // Calcul du score de sécurité
  const calculateSecurityScore = (credentials, breaches, weak, duplicates, old) => {
    if (credentials.length === 0) return 100;
    
    let score = 100;
    
    // Pénalités
    score -= (breaches.length / credentials.length) * 40; // Fuites: -40% max
    score -= (weak.length / credentials.length) * 30; // Mots de passe faibles: -30% max
    score -= (duplicates.length / credentials.length) * 20; // Doublons: -20% max  
    score -= (old.length / credentials.length) * 10; // Anciens: -10% max
    
    return Math.max(0, Math.round(score));
  };

  // Chargement des données
  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les credentials
      const credRes = await fetch('https://firekey.theokaszak.fr/api/credentials/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!credRes.ok) throw new Error('Erreur lors de la récupération des credentials');
      
      const credentialsData = await credRes.json();
      setCredentials(credentialsData);

      // Générer les analyses simulées
      const fakeBreaches = generateFakeBreaches(credentialsData);
      const { weak, duplicates, old } = analyzePasswords(credentialsData);
      
      // Calculer le score de sécurité
      const score = calculateSecurityScore(credentialsData, fakeBreaches, weak, duplicates, old);
      
      // Mettre à jour les états
      setBreaches(fakeBreaches);
      setWeakPasswords(weak);
      setDuplicatePasswords(duplicates);
      setOldPasswords(old);
      setSecurityScore(score);
      setLastScanDate(new Date());

      // Statistiques
      setStats({
        totalCredentials: credentialsData.length,
        breachedCredentials: fakeBreaches.length,
        weakCredentials: weak.length,
        duplicateCredentials: duplicates.length,
        oldCredentials: old.length,
        strongCredentials: credentialsData.length - weak.length
      });

      enqueueSnackbar('Analyse de sécurité mise à jour', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });

    } catch (error) {
      console.error('Erreur:', error);
      enqueueSnackbar('Erreur lors de l\'analyse de sécurité', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Lancer un nouveau scan
  const handleNewScan = async () => {
    setIsScanning(true);
    // Simuler un délai de scan
    setTimeout(() => {
      fetchHealthData();
      setIsScanning(false);
    }, 3000);
  };

  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filtrage des fuites
  const getFilteredBreaches = () => {
    let filtered = [...breaches];
    
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(breach => breach.severity === filterSeverity);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(breach => 
        breach.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breach.credentialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        breach.credentialEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Obtenir la couleur selon la sévérité
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#b0b0b0';
    }
  };

  // Obtenir le texte de la sévérité
  const getSeverityText = (severity) => {
    switch (severity) {
      case 'critical': return 'Critique';
      case 'high': return 'Élevé';
      case 'medium': return 'Moyen';
      case 'low': return 'Faible';
      default: return 'Inconnu';
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Toggle expansion des détails de fuite
  const toggleBreachExpansion = (breachId) => {
    setExpandedBreaches(prev => ({
      ...prev,
      [breachId]: !prev[breachId]
    }));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      <Sidebar drawerWidth={drawerWidth} />
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />
        
        <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
          {/* En-tête */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 1 }}>
              Santé des Mots de Passe
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              Surveillez la sécurité de vos credentials et détectez les fuites de données.
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <>
              {/* Score de sécurité global */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <SecurityScoreCard score={securityScore}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                          Score de Sécurité Global
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ScoreCircle score={securityScore}>
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                color: '#ffffff', 
                                fontWeight: 700, 
                                position: 'relative', 
                                zIndex: 1 
                              }}
                            >
                              {securityScore}%
                            </Typography>
                          </ScoreCircle>
                          <Box sx={{ ml: 3 }}>
                            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
                              {securityScore >= 80 ? 'Excellent' : securityScore >= 60 ? 'Correct' : 'À améliorer'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              {lastScanDate && `Dernière analyse: ${formatDate(lastScanDate.toISOString())}`}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <StyledButton
                          variant="contained"
                          color="primary"
                          startIcon={isScanning ? <CircularProgress size={20} /> : <RefreshIcon />}
                          onClick={handleNewScan}
                          disabled={isScanning}
                        >
                          {isScanning ? 'Analyse...' : 'Nouvelle Analyse'}
                        </StyledButton>
                      </Box>
                    </Box>
                  </SecurityScoreCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledCard sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 3 }}>
                        Résumé des Risques
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700 }}>
                              {stats.breachedCredentials}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              Fuites détectées
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                              {stats.weakCredentials}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              Mots de passe faibles
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>
                              {stats.duplicateCredentials}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              Mots de passe dupliqués
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                              {stats.strongCredentials}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              Mots de passe sécurisés
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>

              {/* Onglets */}
              <StyledCard sx={{ mb: 4 }}>
                <StyledTabs value={activeTab} onChange={handleTabChange}>
                  <Tab 
                    icon={<Badge badgeContent={stats.breachedCredentials} color="error" max={99}><BugReportIcon /></Badge>} 
                    iconPosition="start" 
                    label="Fuites de Données" 
                  />
                  <Tab 
                    icon={<Badge badgeContent={stats.weakCredentials} color="warning" max={99}><WarningAmberIcon /></Badge>} 
                    iconPosition="start" 
                    label="Mots de Passe Faibles" 
                  />
                  <Tab 
                    icon={<Badge badgeContent={stats.duplicateCredentials} color="info" max={99}><LockIcon /></Badge>} 
                    iconPosition="start" 
                    label="Doublons" 
                  />
                  <Tab 
                    icon={<Badge badgeContent={stats.oldCredentials} color="primary" max={99}><KeyIcon /></Badge>} 
                    iconPosition="start" 
                    label="Anciens Mots de Passe" 
                  />
                </StyledTabs>

                {/* Onglet Fuites de Données */}
                {activeTab === 0 && (
                  <Box sx={{ p: 3 }}>
                    {/* Barre d'outils */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <SearchBar
                          placeholder="Rechercher une fuite..."
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
                          sx={{ width: 300 }}
                        />
                        
                        <StyledButton
                          variant="outlined"
                          startIcon={<FilterListIcon />}
                          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                        >
                          Filtrer
                        </StyledButton>
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {getFilteredBreaches().length} fuite{getFilteredBreaches().length > 1 ? 's' : ''} trouvée{getFilteredBreaches().length > 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    {/* Menu de filtrage */}
                    <Menu
                      anchorEl={filterMenuAnchor}
                      open={Boolean(filterMenuAnchor)}
                      onClose={() => setFilterMenuAnchor(null)}
                      PaperProps={{
                        sx: {
                          backgroundColor: '#1e1e1e',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem onClick={() => { setFilterSeverity('all'); setFilterMenuAnchor(null); }}>
                        Toutes les sévérités
                      </MenuItem>
                      <MenuItem onClick={() => { setFilterSeverity('critical'); setFilterMenuAnchor(null); }}>
                        <Chip label="Critique" size="small" sx={{ backgroundColor: '#f44336', color: '#fff', mr: 1 }} />
                        Critique
                      </MenuItem>
                      <MenuItem onClick={() => { setFilterSeverity('high'); setFilterMenuAnchor(null); }}>
                        <Chip label="Élevé" size="small" sx={{ backgroundColor: '#ff9800', color: '#fff', mr: 1 }} />
                        Élevé
                      </MenuItem>
                      <MenuItem onClick={() => { setFilterSeverity('medium'); setFilterMenuAnchor(null); }}>
                        <Chip label="Moyen" size="small" sx={{ backgroundColor: '#2196f3', color: '#fff', mr: 1 }} />
                        Moyen
                      </MenuItem>
                      <MenuItem onClick={() => { setFilterSeverity('low'); setFilterMenuAnchor(null); }}>
                        <Chip label="Faible" size="small" sx={{ backgroundColor: '#4caf50', color: '#fff', mr: 1 }} />
                        Faible
                      </MenuItem>
                    </Menu>

                    {/* Liste des fuites */}
                    {getFilteredBreaches().length === 0 ? (
                      <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Aucune fuite de données détectée !
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Vos credentials semblent être en sécurité. Continuez à utiliser des mots de passe forts et uniques.
                        </Typography>
                      </Alert>
                    ) : (
                      getFilteredBreaches().map((breach) => (
                        <BreachCard key={breach.id} severity={breach.severity}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
                                <Avatar
                                  sx={{ 
                                    bgcolor: alpha(getSeverityColor(breach.severity), 0.2),
                                    mr: 2,
                                    width: 50,
                                    height: 50
                                  }}
                                >
                                  <breach.sourceIcon sx={{ color: getSeverityColor(breach.severity) }} />
                                </Avatar>
                                
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" sx={{ color: '#ffffff', mr: 2 }}>
                                      {breach.sourceName}
                                    </Typography>
                                    <Chip 
                                      label={getSeverityText(breach.severity)}
                                      size="small"
                                      sx={{ 
                                        backgroundColor: alpha(getSeverityColor(breach.severity), 0.2),
                                        color: getSeverityColor(breach.severity),
                                        fontWeight: 500
                                      }}
                                    />
                                    {breach.isNew && (
                                      <Chip 
                                        label="Nouveau"
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Box>
                                  
                                  <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                    <strong>Credential affecté:</strong> {breach.credentialName}
                                  </Typography>
                                  
                                  <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                    <strong>Email:</strong> {breach.credentialEmail}
                                  </Typography>
                                  
                                  <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                                    <strong>Date de la fuite:</strong> {formatDate(breach.date)}
                                  </Typography>
                                  
                                  <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                                    {breach.description}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <IconButton
                                onClick={() => toggleBreachExpansion(breach.id)}
                                sx={{ color: '#b0b0b0' }}
                              >
                                {expandedBreaches[breach.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Box>
                            
                            <Collapse in={expandedBreaches[breach.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                                      Données compromises:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {breach.affectedData.map((data, index) => (
                                        <Chip
                                          key={index}
                                          label={data}
                                          size="small"
                                          variant="outlined"
                                          sx={{ color: '#e0e0e0', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                                        />
                                      ))}
                                    </Box>
                                  </Grid>
                                  
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                                      Ampleur de la fuite:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                      {breach.recordsAffected.toLocaleString('fr-FR')} comptes affectés
                                    </Typography>
                                  </Grid>
                                </Grid>
                                
                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                  <StyledButton
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<LockIcon />}
                                  >
                                    Changer le mot de passe
                                  </StyledButton>
                                  
                                  <StyledButton
                                    variant="outlined"
                                    color="inherit"
                                    size="small"
                                    startIcon={<CheckCircleIcon />}
                                  >
                                    Marquer comme résolu
                                  </StyledButton>
                                </Box>
                              </Box>
                            </Collapse>
                          </CardContent>
                        </BreachCard>
                      ))
                    )}
                  </Box>
                )}

                {/* Onglet Mots de Passe Faibles */}
                {activeTab === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="warning" sx={{ mb: 3, backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {weakPasswords.length} mot{weakPasswords.length > 1 ? 's' : ''} de passe faible{weakPasswords.length > 1 ? 's' : ''} détecté{weakPasswords.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Ces mots de passe sont vulnérables aux attaques par force brute. Il est recommandé de les renforcer.
                      </Typography>
                    </Alert>
                    
                    {weakPasswords.length === 0 ? (
                      <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        Tous vos mots de passe sont suffisamment forts !
                      </Alert>
                    ) : (
                      <List>
                        {weakPasswords.map((cred) => (
                          <ListItem key={cred.id} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, mb: 1 }}>
                            <ListItemIcon>
                              <WarningAmberIcon sx={{ color: '#ff9800' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={cred.name}
                              secondary={cred.email || 'Aucun email'}
                              primaryTypographyProps={{ color: '#ffffff' }}
                              secondaryTypographyProps={{ color: '#b0b0b0' }}
                            />
                            <ListItemSecondaryAction>
                              <StyledButton
                                variant="outlined"
                                color="warning"
                                size="small"
                                startIcon={<LockIcon />}
                              >
                                Renforcer
                              </StyledButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                )}

                {/* Onglet Doublons */}
                {activeTab === 2 && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 3, backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {duplicatePasswords.length} mot{duplicatePasswords.length > 1 ? 's' : ''} de passe dupliqué{duplicatePasswords.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Utiliser le même mot de passe sur plusieurs sites augmente les risques en cas de fuite.
                      </Typography>
                    </Alert>
                    
                    {duplicatePasswords.length === 0 ? (
                      <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        Aucun mot de passe n'est utilisé en double !
                      </Alert>
                    ) : (
                      <List>
                        {duplicatePasswords.map((cred) => (
                          <ListItem key={cred.id} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, mb: 1 }}>
                            <ListItemIcon>
                              <LockIcon sx={{ color: '#2196f3' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={cred.name}
                              secondary={cred.email || 'Aucun email'}
                              primaryTypographyProps={{ color: '#ffffff' }}
                              secondaryTypographyProps={{ color: '#b0b0b0' }}
                            />
                            <ListItemSecondaryAction>
                              <StyledButton
                                variant="outlined"
                                color="info"
                                size="small"
                                startIcon={<KeyIcon />}
                              >
                                Modifier
                              </StyledButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                )}

                {/* Onglet Anciens Mots de Passe */}
                {activeTab === 3 && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="info" sx={{ mb: 3, backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {oldPasswords.length} mot{oldPasswords.length > 1 ? 's' : ''} de passe ancien{oldPasswords.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Ces mots de passe n'ont pas été modifiés depuis plus de 90 jours. Il est recommandé de les renouveler régulièrement.
                      </Typography>
                    </Alert>
                    
                    {oldPasswords.length === 0 ? (
                      <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        Tous vos mots de passe sont récents !
                      </Alert>
                    ) : (
                      <List>
                        {oldPasswords.map((cred) => (
                          <ListItem key={cred.id} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2, mb: 1 }}>
                            <ListItemIcon>
                              <KeyIcon sx={{ color: '#2196f3' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={cred.name}
                              secondary={`Dernière modification: ${formatDate(cred.updated_at || cred.created_at)}`}
                              primaryTypographyProps={{ color: '#ffffff' }}
                              secondaryTypographyProps={{ color: '#b0b0b0' }}
                            />
                            <ListItemSecondaryAction>
                              <StyledButton
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<RefreshIcon />}
                              >
                                Renouveler
                              </StyledButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>
                )}
              </StyledCard>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}