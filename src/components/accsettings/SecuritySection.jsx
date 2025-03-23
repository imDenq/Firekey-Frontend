// src/components/accsettings/SecuritySection.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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

  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleSaveNewPassword = async () => {
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

    try {
      // Exemple d'endpoint POST /api/user/change-password/
      const res = await fetch(
        "http://localhost:8001/api/user/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Impossible de changer le mot de passe");
      }

      enqueueSnackbar("Mot de passe modifié avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      handleClosePasswordModal();
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Erreur lors du changement de mot de passe", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const handleTwoFactorChange = (event) => {
    setUserInfo({
      ...userInfo,
      twoFactorEnabled: event.target.checked,
    });

    enqueueSnackbar(
      `Authentification à deux facteurs ${
        event.target.checked ? "activée" : "désactivée"
      }`,
      {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      }
    );
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
                checked={userInfo.twoFactorEnabled}
                onChange={handleTwoFactorChange}
                name="twoFactor"
                color="primary"
              />
            }
            label={userInfo.twoFactorEnabled ? "Activée" : "Désactivée"}
            sx={{ color: "#ffffff" }}
          />
          <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 1 }}>
            {userInfo.twoFactorEnabled
              ? "Un code de vérification sera envoyé à votre email à chaque connexion."
              : "Activez cette option pour une sécurité renforcée de votre compte."}
          </Typography>
        </Box>
        {userInfo.twoFactorEnabled && (
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
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: "#ffffff" }}
          >
            Session actuelle
          </Typography>
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Paris, France • Chrome sur macOS • {new Date().toLocaleString()}
          </Typography>
        </Box>
        <Divider sx={{ my: 2, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: "#ffffff" }}
          >
            Autre appareil
          </Typography>
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Lyon, France • Safari sur iPhone • Hier à 18:45
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <StyledButton
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Déconnecter toutes les autres sessions
          </StyledButton>
        </Box>
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
          <StyledButton variant="outlined" color="error">
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
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ ...textFieldStyle, mb: 2 }}
          />
          <TextField
            label="Nouveau mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ ...textFieldStyle, mb: 2 }}
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={textFieldStyle}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <StyledButton
            onClick={handleClosePasswordModal}
            color="inherit"
            sx={{ mr: 1 }}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSaveNewPassword}
          >
            Confirmer
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecuritySection;
