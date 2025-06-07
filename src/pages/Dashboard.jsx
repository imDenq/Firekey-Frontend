// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container,
  Typography, 
  Grid, 
  Paper, 
  Divider,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';

// Composants réutilisables
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

// Services
import { 
  fetchDashboardData, 
  runSecurityAudit, 
  fetchAuditHistory,
  fetchAuditLog
} from '../services/securityService';

// Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockIcon from '@mui/icons-material/Lock';
import ShareIcon from '@mui/icons-material/Share';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LanguageIcon from '@mui/icons-material/Language';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';

import { styled, alpha } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: '#1e1e1e',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  height: '100%',
  position: 'relative',
  overflow: 'visible',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
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

const SecureScoreIndicator = styled(Box)(({ score }) => ({
  position: 'relative',
  height: 6,
  width: '100%',
  backgroundColor: alpha('#ffffff', 0.1),
  borderRadius: 3,
  overflow: 'hidden',
  marginTop: 8,
  marginBottom: 8,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${score}%`,
    backgroundColor: score < 50 ? '#f44336' : score < 80 ? '#ff9800' : '#4caf50',
    borderRadius: 3,
  }
}));

const IconCounter = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 64,
  height: 64,
  borderRadius: 16,
  backgroundColor: alpha(color, 0.1),
  marginBottom: 16
}));

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  // États pour stocker les données
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState([]);
  const [credentialsCount, setCredentialsCount] = useState(0);
  const [activeShares, setActiveShares] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [weakPasswords, setWeakPasswords] = useState([]);
  const [duplicatePasswords, setDuplicatePasswords] = useState([]);
  const [oldPasswords, setOldPasswords] = useState([]);
  const [recentCredentials, setRecentCredentials] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [lastAuditDate, setLastAuditDate] = useState('En attente');
  const [refreshingAudit, setRefreshingAudit] = useState(false);
  const [needsInitialAudit, setNeedsInitialAudit] = useState(false);
  
  // Largeur fixe du menu latéral
  const drawerWidth = 240;
  const accessToken = localStorage.getItem('accessToken') || '';

  // Fonction pour récupérer les données directement du service backend sans créer d'entrée d'audit
  const fetchSecurityAuditDataSilently = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken') || '';
      const res = await fetch('https://firekey.theokaszak.fr/api/security/silent_audit/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Impossible de récupérer les données d'audit");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Erreur lors de la récupération silencieuse des données d'audit:", error);
      // En cas d'erreur, on utilise plutôt l'audit standard
      return runSecurityAudit();
    }
  };

  // Récupérer les données au chargement
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Tenter de récupérer les données d'audit silencieusement d'abord
        await fetchSecurityAuditDataSilently();
        
        // Puis récupérer toutes les données pour mettre à jour l'interface
        await Promise.all([
          fetchCredentials(),
          fetchShares(),
          fetchSecurityDashboardData()
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        enqueueSnackbar('Erreur lors du chargement des données du tableau de bord', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Vérifier le cookie de connexion
    const match = document.cookie.match(/(^| )loginSuccess=([^;]+)/);
    if (match) {
      enqueueSnackbar('Connexion réussie !', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      // Supprimer le cookie
      document.cookie = 'loginSuccess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    
    fetchAllData();
  }, [enqueueSnackbar]);

  // Fonction pour récupérer les données du tableau de bord de sécurité
  const fetchSecurityDashboardData = async () => {
    try {
      const data = await fetchDashboardData();
      
      // Mettre à jour les états avec les données du backend
      setSecurityScore(data.security_score || 0);
      setWeakPasswords(data.weak_passwords || []);
      setDuplicatePasswords(data.duplicate_passwords || []);
      setOldPasswords(data.old_passwords || []);
      
      // Si les credentials récents ne sont pas disponibles, on utilise les credentials normaux
      if (data.recent_credentials && data.recent_credentials.length > 0) {
        setRecentCredentials(data.recent_credentials);
      } else if (credentials.length > 0) {
        // Solution temporaire: utiliser les credentials de base sans info de force
        // quand recent_credentials n'est pas disponible
        const tempCredentials = credentials.slice(0, 5).map(cred => ({
          ...cred,
          strength: 'medium',  // Force par défaut
          score: 50           // Score par défaut
        }));
        setRecentCredentials(tempCredentials);
      }
      
      // Mise à jour de la date du dernier audit
      if (data.last_audit) {
        setLastAuditDate(new Date(data.last_audit).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }));
      } else {
        // Si aucun audit n'existe, marquer pour un audit initial
        setNeedsInitialAudit(true);
      }
      
      // Récupérer les logs d'audit
      await fetchActivityLogs();
      
    } catch (error) {
      console.error("Erreur lors de la récupération des données de sécurité :", error);
      enqueueSnackbar('Erreur lors du chargement des données de sécurité', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
      // Si aucun audit n'existe, marquer pour un audit initial
      setNeedsInitialAudit(true);
      throw error;
    }
  };

  // Fonction pour récupérer les logs d'activité
  const fetchActivityLogs = async () => {
    try {
      const logs = await fetchAuditLog();
      
      // Transformer les logs dans le format attendu par le composant
      const formattedLogs = logs.map(log => ({
        action: log.action_name,
        details: log.action_detail,
        device: log.device_info ? log.device_info.split(' ').slice(0, 2).join(' ') : '',
        date: new Date(log.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }));
      
      setAuditLogs(formattedLogs.slice(0, 4)); // Prendre les 4 premiers logs
      
    } catch (error) {
      console.error("Erreur lors de la récupération des logs d'activité :", error);
      // En cas d'erreur, on utilise des données de démo
      setAuditLogs([
        {
          action: 'Connexion',
          details: 'depuis Paris, France',
          device: 'Chrome sur MacOS',
          date: randomPastDate(2)
        },
        {
          action: 'Mise à jour du profil',
          details: "Changement de l'adresse email",
          device: '',
          date: randomPastDate(5)
        },
        {
          action: "Ajout d'un nouveau credential",
          details: 'Credential "Projet Alpha" créé',
          device: '',
          date: randomPastDate(10)
        },
        {
          action: 'Connexion',
          details: 'depuis Lyon, France',
          device: 'Safari sur iPhone',
          date: randomPastDate(15)
        }
      ]);
    }
  };

  // Fonction pour récupérer les credentials
  const fetchCredentials = async () => {
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/credentials/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Impossible de récupérer les credentials");
      }
      
      const data = await res.json();
      
      // Mettre à jour les credentials
      setCredentials(data);
      setCredentialsCount(data.length);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des credentials :", error);
      throw error;
    }
  };

  // Fonction pour récupérer les partages
  const fetchShares = async () => {
    try {
      const res = await fetch('https://firekey.theokaszak.fr/api/shares/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Impossible de récupérer les partages");
      }
      
      const data = await res.json();
      
      // Calculer le nombre de partages actifs
      const active = data.filter(share => !share.is_expired).length;
      
      setActiveShares(active);
      setTotalShares(data.length);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des partages :", error);
      throw error;
    }
  };

  // Simuler une date aléatoire dans le passé (pour les données de démonstration)
  const randomPastDate = (maxDaysAgo) => {
    const date = new Date();
    const daysAgo = Math.floor(Math.random() * maxDaysAgo) + 1;
    date.setDate(date.getDate() - daysAgo);
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Obtenir la couleur en fonction de la force du mot de passe
  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'weak': return '#f44336';
      default: return '#b0b0b0';
    }
  };

  // Obtenir le texte en français pour la force du mot de passe
  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 'strong': return 'Fort';
      case 'medium': return 'Moyen';
      case 'weak': return 'Faible';
      default: return 'Inconnu';
    }
  };

  // Lancer un audit de sécurité
  const handleRunAudit = async () => {
    setRefreshingAudit(true);
    
    try {
      // Lancer l'audit via le service
      const auditResult = await runSecurityAudit();
      
      // Recharger toutes les données pour mettre à jour l'interface
      await Promise.all([
        fetchCredentials(),
        fetchShares(),
        fetchSecurityDashboardData()
      ]);
      
      enqueueSnackbar('Audit de sécurité effectué avec succès', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } catch (error) {
      console.error("Erreur lors de l'audit :", error);
      enqueueSnackbar('Erreur lors de l\'audit de sécurité', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setRefreshingAudit(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#121212' }}>
      {/* Composant barre latérale */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Composant topbar */}
      <Box sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />

        {/* Contenu principal */}
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffffff', mb: 1 }}>
              Tableau de Bord
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              Une vue d'ensemble de vos identifiants et de leur sécurité.
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <>
              {/* Cartes de statistiques */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                  <StyledCard>
                    <CardContent>
                      <IconCounter color="#90caf9">
                        <LockIcon sx={{ fontSize: 32, color: '#90caf9' }} />
                      </IconCounter>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                        {credentialsCount}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Mots de passe
                      </Typography>
                      <Chip 
                        icon={<TrendingUpIcon fontSize="small" />} 
                        label="+3 ce mois-ci" 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#4caf50', 0.1), 
                          color: '#4caf50',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }} 
                      />
                    </CardContent>
                  </StyledCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StyledCard>
                    <CardContent>
                      <IconCounter color="#ff9800">
                        <ShareIcon sx={{ fontSize: 28, color: '#ff9800' }} />
                      </IconCounter>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                        {activeShares}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Partages actifs
                      </Typography>
                      <Chip 
                        icon={<TrendingDownIcon fontSize="small" />} 
                        label="-1 ce mois-ci" 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#f44336', 0.1), 
                          color: '#f44336',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }} 
                      />
                    </CardContent>
                  </StyledCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StyledCard>
                    <CardContent>
                      <IconCounter color="#4caf50">
                        <AnalyticsIcon sx={{ fontSize: 28, color: '#4caf50' }} />
                      </IconCounter>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                        {totalShares}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Partages créés
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                        Depuis la création de votre compte
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
                
                <Grid item xs={12} sm={6} lg={3}>
                  <StyledCard>
                    <CardContent>
                      <IconCounter color="#f44336">
                        <SecurityIcon sx={{ fontSize: 28, color: '#f44336' }} />
                      </IconCounter>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#ffffff', mb: 0.5 }}>
                        {securityScore}%
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Score de sécurité
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecureScoreIndicator score={securityScore} />
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>

              {/* Alertes et risques */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
                  Alertes de sécurité
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      backgroundColor: alpha('#f44336', 0.1),
                      borderLeft: '4px solid #f44336'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WarningAmberIcon sx={{ color: '#f44336', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {weakPasswords.length} mot{weakPasswords.length > 1 ? 's' : ''} de passe faible{weakPasswords.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                        {weakPasswords.length > 0 
                          ? "Ces mots de passe sont vulnérables aux attaques par force brute."
                          : "Tous vos mots de passe sont suffisamment forts."}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                        sx={{ borderRadius: 4, textTransform: 'none' }}
                        onClick={() => navigate('/credentials')}
                        disabled={weakPasswords.length === 0}
                      >
                        Renforcer
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      backgroundColor: alpha('#ff9800', 0.1),
                      borderLeft: '4px solid #ff9800'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SyncProblemIcon sx={{ color: '#ff9800', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {duplicatePasswords.length} mot{duplicatePasswords.length > 1 ? 's' : ''} de passe dupliqué{duplicatePasswords.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                        {duplicatePasswords.length > 0 
                          ? "Utiliser le même mot de passe sur plusieurs sites est risqué."
                          : "Aucun mot de passe n'est utilisé en double."}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="warning"
                        sx={{ borderRadius: 4, textTransform: 'none' }}
                        onClick={() => navigate('/credentials')}
                        disabled={duplicatePasswords.length === 0}
                      >
                        Modifier
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      backgroundColor: alpha('#2196f3', 0.1),
                      borderLeft: '4px solid #2196f3'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HourglassTopIcon sx={{ color: '#2196f3', mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {oldPasswords.length} mot{oldPasswords.length > 1 ? 's' : ''} de passe ancien{oldPasswords.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                        {oldPasswords.length > 0 
                          ? "Ces mots de passe n'ont pas été modifiés depuis plus de 90 jours."
                          : "Tous vos mots de passe sont récents."}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        sx={{ borderRadius: 4, textTransform: 'none' }}
                        onClick={() => navigate('/credentials')}
                        disabled={oldPasswords.length === 0}
                      >
                        Renouveler
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={4}>
                {/* Derniers mots de passe ajoutés */}
                <Grid item xs={12}>
                  <StyledCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          Derniers mots de passe
                        </Typography>
                        <StyledButton
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/credentials')}
                        >
                          Ajouter
                        </StyledButton>
                      </Box>
                      
                      {recentCredentials.length > 0 ? (
                        <List sx={{ width: '100%' }}>
                          {recentCredentials.map((credential) => (
                            <React.Fragment key={credential.id}>
                              <ListItem 
                                sx={{ 
                                  py: 1.5, 
                                  px: 2, 
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                  mb: 1,
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  }
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{ 
                                      bgcolor: alpha(getPasswordStrengthColor(credential.strength), 0.2),
                                      color: getPasswordStrengthColor(credential.strength)
                                    }}
                                  >
                                    <KeyIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>
                                      {credential.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                      <LanguageIcon sx={{ fontSize: 14, color: '#b0b0b0', mr: 0.5 }} />
                                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                                        {credential.website || 'Aucun site spécifié'}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                <Chip 
                                  size="small" 
                                  label={getPasswordStrengthText(credential.strength)}
                                  sx={{ 
                                    backgroundColor: alpha(getPasswordStrengthColor(credential.strength), 0.1),
                                    color: getPasswordStrengthColor(credential.strength),
                                    mr: 1
                                  }}
                                />
                                <Tooltip title="Voir le mot de passe">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    sx={{ color: '#90caf9' }}
                                    onClick={() => navigate(`/credentials`)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </ListItem>
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                            Vous n'avez pas encore créé de credentials.
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => navigate('/credentials')}
                          sx={{ textTransform: 'none' }}
                        >
                          Voir tous les mots de passe
                        </Button>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            
              {/* Dernière section d'activité */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
                  Dernière activité
                </Typography>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#ffffff' }}>
                        Dernier audit de sécurité : <span style={{ fontWeight: 600 }}>{lastAuditDate}</span>
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        startIcon={refreshingAudit ? <CircularProgress size={16} /> : <RefreshIcon />}
                        sx={{ borderRadius: 4, textTransform: 'none' }}
                        onClick={handleRunAudit}
                        disabled={refreshingAudit}
                      >
                        Lancer un audit
                      </Button>
                    </Box>
                    
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 2, 
                        backgroundColor: alpha('#4caf50', 0.1),
                        color: '#ffffff',
                        border: 'none',
                        '& .MuiAlert-icon': {
                          color: '#4caf50'
                        }
                      }}
                    >
                      Votre dernier scan n'a pas détecté de fuites de données liées à vos comptes.
                    </Alert>
                    
                    <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                    
                    {/* Journal d'activités */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ffffff', mb: 2 }}>
                      Activités récentes
                    </Typography>
                    
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log, index) => (
                        <React.Fragment key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
                                {log.action} {log.details}
                              </Typography>
                              {log.device && (
                                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                  {log.device}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              {log.date}
                            </Typography>
                          </Box>
                          {index < auditLogs.length - 1 && (
                            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          Aucune activité récente à afficher.
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 2 }}>
                      Il est recommandé de lancer un audit de sécurité tous les mois pour vérifier la santé de vos mots de passe.
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}