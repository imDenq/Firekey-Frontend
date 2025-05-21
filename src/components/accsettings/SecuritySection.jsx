// src/components/accsettings/SecuritySection.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  InputAdornment,
  Chip,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LaptopIcon from "@mui/icons-material/Laptop";
import TabletIcon from "@mui/icons-material/Tablet";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { styled } from "@mui/material/styles";

const SecuritySectionPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  marginBottom: 24,
  background: "#1e1e1e",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
    transform: "translateY(-2px)",
  },
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: "10px 20px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: variant === "contained" ? "0 2px 10px rgba(0, 0, 0, 0.2)" : "none",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow:
      variant === "contained" ? "0 4px 15px rgba(0, 0, 0, 0.3)" : "none",
    transform: "translateY(-2px)",
  },
}));

// Style commun pour les TextField
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2a2a",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#666" },
    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
  },
  "& .MuiInputLabel-root": {
    color: "#b0b0b0",
    "&.Mui-focused": { color: "#90caf9" },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
  },
};

const SecuritySection = ({
  userInfo,
  setUserInfo,
  enqueueSnackbar,
  accessToken,
}) => {
  // État pour la modale de changement de mot de passe
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // États pour les sessions
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [deleteSessionsModalOpen, setDeleteSessionsModalOpen] = useState(false);

  // États pour la 2FA
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twofactorStatus, setTwofactorStatus] = useState({
    isEnabled: false,
    secret: '',
    qrCode: null,
    isLoading: false
  });
  const [verificationCode, setVerificationCode] = useState('');

  // États pour la suppression de compte
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [deleteAccountText, setDeleteAccountText] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Charger les sessions de l'utilisateur au chargement du composant
  useEffect(() => {
    fetchUserSessions();
    check2FAStatus();
  }, []);

  // Fonction pour récupérer les sessions utilisateur
  const fetchUserSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await fetch('http://localhost:8001/auth/users/sessions/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        enqueueSnackbar("Impossible de récupérer les sessions", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions:", error);
      enqueueSnackbar("Erreur de connexion au serveur", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fonction pour vérifier le statut de la 2FA
  const check2FAStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/auth/users/two-factor/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTwofactorStatus({
          isEnabled: data.is_enabled,
          secret: data.secret,
          qrCode: data.qr_code,
          isLoading: false
        });
        
        // Mettre à jour userInfo aussi
        setUserInfo(prev => ({
          ...prev,
          twoFactorEnabled: data.is_enabled
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut 2FA:", error);
    }
  };

  // Gestion du changement de mot de passe
  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleSaveNewPassword = async () => {
    // Vérifications basiques
    if (!currentPassword || !newPassword || !confirmPassword) {
      enqueueSnackbar("Veuillez remplir tous les champs", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Les mots de passe ne correspondent pas", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    if (newPassword.length < 8) {
      enqueueSnackbar("Le mot de passe doit contenir au moins 8 caractères", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("http://localhost:8001/auth/users/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossible de changer le mot de passe");
      }

      const data = await response.json();
      
      // Mettre à jour les tokens
      if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
      }

      enqueueSnackbar("Mot de passe modifié avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      handleClosePasswordModal();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Erreur lors du changement de mot de passe", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Gestion de la déconnexion des sessions
  const handleOpenDeleteSessionsModal = () => {
    setDeleteSessionsModalOpen(true);
  };

  const handleCloseDeleteSessionsModal = () => {
    setDeleteSessionsModalOpen(false);
  };

  const handleDeleteAllSessions = async () => {
    try {
      const response = await fetch('http://localhost:8001/auth/users/sessions/?id=all-except-current', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        enqueueSnackbar("Toutes les autres sessions ont été déconnectées", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
        fetchUserSessions();
        handleCloseDeleteSessionsModal();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la déconnexion des sessions");
      }
    } catch (error) {
      console.error("Erreur:", error);
      enqueueSnackbar(error.message || "Erreur lors de la déconnexion des sessions", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:8001/auth/users/sessions/?id=${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        enqueueSnackbar("Session déconnectée avec succès", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
        // Mettre à jour la liste des sessions
        setSessions(prev => prev.filter(session => session.id !== sessionId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la déconnexion de la session");
      }
    } catch (error) {
      console.error("Erreur:", error);
      enqueueSnackbar(error.message || "Erreur lors de la déconnexion de la session", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
    }
  };

  // Gestion de l'authentification à deux facteurs
  const handleTwoFactorChange = async (event) => {
    if (event.target.checked) {
      // Activer la 2FA - Ouvrir la modale de configuration
      setIs2FAModalOpen(true);
      setTwofactorStatus(prev => ({
        ...prev,
        isLoading: true
      }));
      
      try {
        const response = await fetch('http://localhost:8001/auth/users/two-factor/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du QR code");
        }
        
        const data = await response.json();
        setTwofactorStatus({
          isEnabled: data.is_enabled,
          secret: data.secret,
          qrCode: data.qr_code,
          isLoading: false
        });
      } catch (error) {
        console.error("Erreur:", error);
        enqueueSnackbar(error.message || "Erreur lors de la génération du QR code", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
        setTwofactorStatus(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    } else {
      // Désactiver la 2FA directement
      try {
        const response = await fetch('http://localhost:8001/auth/users/two-factor/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            enable: false
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la désactivation de l'authentification à deux facteurs");
        }
        
        const data = await response.json();
        setTwofactorStatus(prev => ({
          ...prev,
          isEnabled: false
        }));
        
        setUserInfo(prev => ({
          ...prev,
          twoFactorEnabled: false
        }));
        
        enqueueSnackbar("Authentification à deux facteurs désactivée", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
      } catch (error) {
        console.error("Erreur:", error);
        enqueueSnackbar(error.message || "Erreur lors de la désactivation de l'authentification à deux facteurs", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
      }
    }
  };

  const handleClose2FAModal = () => {
    setIs2FAModalOpen(false);
    setVerificationCode('');
  };

  const handleEnable2FA = async () => {
    if (!verificationCode) {
      enqueueSnackbar("Veuillez saisir le code de vérification", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
      return;
    }
    
    try {
      setTwofactorStatus(prev => ({
        ...prev,
        isLoading: true
      }));
      
      const response = await fetch('http://localhost:8001/auth/users/two-factor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          enable: true,
          code: verificationCode
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'activation de l'authentification à deux facteurs");
      }
      
      const data = await response.json();
      setTwofactorStatus(prev => ({
        ...prev,
        isEnabled: true,
        isLoading: false
      }));
      
      setUserInfo(prev => ({
        ...prev,
        twoFactorEnabled: true
      }));
      
      enqueueSnackbar("Authentification à deux facteurs activée avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
      
      handleClose2FAModal();
    } catch (error) {
      console.error("Erreur:", error);
      enqueueSnackbar(error.message || "Erreur lors de l'activation de l'authentification à deux facteurs", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
      setTwofactorStatus(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  // Gestion de la suppression de compte
  const handleOpenDeleteAccountModal = () => {
    setDeleteAccountModalOpen(true);
    setDeleteAccountPassword("");
    setDeleteAccountText("");
    setShowDeletePassword(false);
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword || deleteAccountText !== "SUPPRIMER") {
      enqueueSnackbar("Veuillez remplir tous les champs correctement", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsDeletingAccount(true);

    try {
      const response = await fetch("http://localhost:8001/auth/users/delete-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password: deleteAccountPassword,
          confirm_text: deleteAccountText
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossible de supprimer le compte");
      }

      const data = await response.json();
      
      enqueueSnackbar("Demande de suppression initiée. Un e-mail de confirmation a été envoyé.", {
        variant: "info",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // En production, l'utilisateur recevrait un mail avec un lien.
      // Pour les besoins de la démo, on simule la confirmation immédiate avec le token reçu
      if (data.token) {
        await confirmAccountDeletion(data.token);
      }

      handleCloseDeleteAccountModal();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Erreur lors de la suppression du compte", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const confirmAccountDeletion = async (token) => {
    try {
      const response = await fetch(`http://localhost:8001/auth/users/delete-account/?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Impossible de confirmer la suppression du compte");
      }

      // Déconnexion après suppression
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      enqueueSnackbar("Votre compte a été supprimé avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      
      // Redirection vers la page de connexion
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || "Erreur lors de la confirmation de suppression du compte", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // Fonction pour choisir l'icône appropriée en fonction du type d'appareil
  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <SmartphoneIcon />;
    } else if (device.toLowerCase().includes('tablet') || device.toLowerCase().includes('ipad')) {
      return <TabletIcon />;
    } else if (device.toLowerCase().includes('mac') || device.toLowerCase().includes('windows') || device.toLowerCase().includes('linux')) {
      return <LaptopIcon />;
    } else {
      return <ComputerIcon />;
    }
  };

  // Formater date pour affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <SecuritySectionPaper>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}
        >
          Mot de passe
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
          Votre mot de passe doit comporter au moins 12 caractères, incluant une
          majuscule, un chiffre et un caractère spécial.
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "#ffffff" }}
            >
              Changer votre mot de passe
            </Typography>
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              Dernière modification : il y a 2 mois
            </Typography>
          </Box>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={handleOpenPasswordModal}
            startIcon={<EditIcon />}
          >
            Modifier
          </StyledButton>
        </Box>
      </SecuritySectionPaper>

      <SecuritySectionPaper>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
          }}
        >
          Authentification à deux facteurs
          <Tooltip title="Ajoute une couche de sécurité supplémentaire à votre compte">
            <HelpOutlineIcon sx={{ ml: 1, fontSize: 18, color: "#b0b0b0" }} />
          </Tooltip>
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={twofactorStatus.isEnabled}
                onChange={handleTwoFactorChange}
                name="twoFactor"
                color="primary"
              />
            }
            label={twofactorStatus.isEnabled ? "Activée" : "Désactivée"}
            sx={{ color: "#ffffff" }}
          />
          <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 1 }}>
            {twofactorStatus.isEnabled
              ? "Un code de vérification sera demandé à chaque connexion."
              : "Activez cette option pour une sécurité renforcée de votre compte."}
          </Typography>
        </Box>
        {twofactorStatus.isEnabled && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              backgroundColor: "rgba(46, 125, 50, 0.1)",
              color: "#81c784",
              "& .MuiAlert-icon": {
                color: "#81c784",
              },
            }}
          >
            Votre compte est bien protégé avec l'authentification à deux
            facteurs.
          </Alert>
        )}
      </SecuritySectionPaper>

      <SecuritySectionPaper>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}
        >
          Sessions actives
        </Typography>
        {isLoadingSessions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={40} sx={{ color: '#90caf9' }} />
          </Box>
        ) : (
          <>
            {sessions.length > 0 ? (
              <>
                <List sx={{ mb: 3 }}>
                  {sessions.map((session) => (
                    <ListItem
                      key={session.id}
                      sx={{
                        mb: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        borderRadius: 2,
                        py: 1,
                        border: session.is_current ? '1px solid rgba(144, 202, 249, 0.5)' : 'none',
                      }}
                      secondaryAction={
                        !session.is_current && (
                          <IconButton
                            edge="end"
                            aria-label="déconnecter"
                            onClick={() => handleDeleteSession(session.id)}
                            sx={{ color: "#f44336" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: session.is_current
                              ? "rgba(144, 202, 249, 0.2)"
                              : "rgba(255, 255, 255, 0.1)",
                            color: session.is_current ? "#90caf9" : "#e0e0e0",
                          }}
                        >
                          {getDeviceIcon(session.device || "")}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ color: "#ffffff", fontWeight: session.is_current ? 500 : 400 }}>
                              {session.browser || "Navigateur inconnu"}
                              {session.is_current && (
                                <Chip
                                  label="Session actuelle"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: "#b0b0b0", display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>
                              {session.location || "Localisation inconnue"} • {session.device || "Appareil inconnu"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#b0b0b0", display: 'flex', alignItems: 'center', fontSize: '0.8rem', mt: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} />
                              {session.is_current
                                ? "Maintenant"
                                : `Dernière activité : ${formatDate(session.last_activity)}`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                  <StyledButton
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDeleteSessionsModal}
                    disabled={sessions.filter(s => !s.is_current).length === 0}
                  >
                    Déconnecter toutes les autres sessions
                  </StyledButton>
                </Box>
              </>
            ) : (
              <Alert
                severity="info"
                sx={{
                  backgroundColor: "rgba(3, 169, 244, 0.1)",
                  color: "#29b6f6",
                  "& .MuiAlert-icon": {
                    color: "#29b6f6",
                  },
                }}
              >
                Aucune session active trouvée.
              </Alert>
            )}
          </>
        )}
      </SecuritySectionPaper>

      <SecuritySectionPaper>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 3, color: "#ff5252" }}
        >
          Zone dangereuse
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "#ffffff" }}
            >
              Supprimer votre compte
            </Typography>
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              Cette action est irréversible et supprimera définitivement toutes
              vos données.
            </Typography>
          </Box>
          <StyledButton 
            variant="outlined" 
            color="error"
            onClick={handleOpenDeleteAccountModal}
          >
            Supprimer mon compte
          </StyledButton>
        </Box>
      </SecuritySectionPaper>

      {/* DIALOG POUR CHANGER DE MOT DE PASSE */}
      <Dialog
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600, py: 2 }}>
          Changer de mot de passe
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
            Pour des raisons de sécurité, veuillez entrer votre mot de passe
            actuel.
          </Typography>
          <TextField
            label="Mot de passe actuel"
            variant="outlined"
            type={showCurrentPassword ? "text" : "password"}
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ ...textFieldStyle, mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                    sx={{ color: '#b0b0b0' }}
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nouveau mot de passe"
            variant="outlined"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ ...textFieldStyle, mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    sx={{ color: '#b0b0b0' }}
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#b0b0b0' }}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton
            onClick={handleClosePasswordModal}
            color="inherit"
            sx={{ mr: 1 }}
            disabled={isChangingPassword}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSaveNewPassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              "Confirmer"
            )}
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* DIALOG POUR DÉCONNECTER TOUTES LES SESSIONS */}
      <Dialog
        open={deleteSessionsModalOpen}
        onClose={handleCloseDeleteSessionsModal}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600, py: 2 }}>
          Déconnecter toutes les autres sessions
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
            Êtes-vous sûr de vouloir déconnecter toutes vos autres sessions actives ? 
            Vous resterez connecté uniquement sur l'appareil actuel.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton
            onClick={handleCloseDeleteSessionsModal}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleDeleteAllSessions}
          >
            Déconnecter
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* DIALOG POUR CONFIGURER LA 2FA */}
      <Dialog
        open={is2FAModalOpen}
        onClose={handleClose2FAModal}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600, py: 2 }}>
          Configuration de l'authentification à deux facteurs
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          {twofactorStatus.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={50} sx={{ color: '#90caf9' }} />
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
                Scannez ce QR code avec votre application d'authentification 
                (Google Authenticator, Authy, etc.) puis entrez le code à 6 chiffres pour activer la 2FA.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {twofactorStatus.qrCode ? (
                  <Box 
                    component="img" 
                    src={`data:image/png;base64,${twofactorStatus.qrCode}`} 
                    alt="QR Code pour 2FA" 
                    sx={{ 
                      width: 200, 
                      height: 200,
                      p: 2,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      mb: 2
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    width: 200, 
                    height: 200, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <QrCodeIcon sx={{ fontSize: 80, color: '#90caf9' }} />
                  </Box>
                )}
                
                <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 500 }}>
                  Clé secrète (en cas de problème avec le QR code):
                </Typography>
                <Box sx={{ 
                  p: 1, 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  color: '#90caf9',
                  my: 1
                }}>
                  {twofactorStatus.secret}
                </Box>
              </Box>

              <TextField
                label="Code de vérification (6 chiffres)"
                variant="outlined"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                sx={{
                  ...textFieldStyle,
                  mb: 2,
                  '& input': { letterSpacing: 2, fontFamily: 'monospace' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#90caf9' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton
            onClick={handleClose2FAModal}
            color="inherit"
            sx={{ mr: 1 }}
            disabled={twofactorStatus.isLoading}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleEnable2FA}
            disabled={!verificationCode || twofactorStatus.isLoading}
          >
            {twofactorStatus.isLoading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              "Activer"
            )}
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* DIALOG POUR SUPPRIMER LE COMPTE */}
      <Dialog
        open={deleteAccountModalOpen}
        onClose={handleCloseDeleteAccountModal}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600, py: 2 }}>
          Supprimer votre compte
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              mt: 1,
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              color: "#f44336",
              "& .MuiAlert-icon": {
                color: "#f44336",
              },
            }}
          >
            Cette action est irréversible. Toutes vos données, credentials et paramètres
            seront définitivement supprimés.
          </Alert>
          
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
            Pour confirmer la suppression, veuillez saisir votre mot de passe et
            taper "SUPPRIMER" dans le champ de confirmation.
          </Typography>
          
          <TextField
            label="Mot de passe"
            variant="outlined"
            type={showDeletePassword ? "text" : "password"}
            fullWidth
            value={deleteAccountPassword}
            onChange={(e) => setDeleteAccountPassword(e.target.value)}
            sx={{ ...textFieldStyle, mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    edge="end"
                    sx={{ color: '#b0b0b0' }}
                  >
                    {showDeletePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Tapez 'SUPPRIMER' pour confirmer"
            variant="outlined"
            fullWidth
            value={deleteAccountText}
            onChange={(e) => setDeleteAccountText(e.target.value)}
            sx={{
              ...textFieldStyle,
              '& .MuiOutlinedInput-root': {
                borderColor: deleteAccountText === 'SUPPRIMER' ? '#f44336' : '#444',
                ...textFieldStyle['& .MuiOutlinedInput-root']
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton
            onClick={handleCloseDeleteAccountModal}
            color="inherit"
            sx={{ mr: 1 }}
            disabled={isDeletingAccount}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteAccountText !== "SUPPRIMER" || !deleteAccountPassword || isDeletingAccount}
          >
            {isDeletingAccount ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              "Supprimer définitivement"
            )}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecuritySection;