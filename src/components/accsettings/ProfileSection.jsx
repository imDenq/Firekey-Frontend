// src/components/accsettings/ProfileSection.jsx
import React, { useState, useEffect } from "react";
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
  IconButton,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

// Styled components
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: "4px solid #333",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ProfileSectionPaper = styled(Paper)(({ theme }) => ({
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

export default function ProfileSection({
  userInfo,
  setUserInfo,
  enqueueSnackbar,
  accessToken,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Prévisualisation locale de l'image
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
      enqueueSnackbar("Veuillez sélectionner un fichier", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("profile_pic", selectedFile);

      // Log pour déboguer
      console.log(
        "Envoi de la photo:",
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );

      const res = await fetch("http://localhost:8001/auth/users/photo/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      // Log complet de la réponse
      console.log("Statut de la réponse:", res.status);
      console.log("Headers:", Object.fromEntries([...res.headers.entries()]));

      const responseText = await res.text();
      console.log("Réponse brute:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Données parsées:", data);
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        if (!res.ok) {
          throw new Error("Format de réponse invalide ou erreur serveur");
        }
      }

      if (!res.ok) {
        if (data && (data.error || data.detail)) {
          throw new Error(data.error || data.detail);
        } else {
          throw new Error("Échec de l'upload de la photo");
        }
      }

      // S'assurer que l'URL est complète
      let profilePicUrl = data.profile_pic;
      if (profilePicUrl && !profilePicUrl.startsWith("http")) {
        // Ajouter un timestamp pour éviter la mise en cache du navigateur
        const timestamp = new Date().getTime();
        profilePicUrl = `http://localhost:8001${profilePicUrl}?t=${timestamp}`;
      }

      enqueueSnackbar("Photo de profil mise à jour", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Mettre à jour l'UI avec l'URL complète et un paramètre anti-cache
      setUserInfo((prev) => ({
        ...prev,
        profilePic: profilePicUrl,
      }));

      // Forcer un rafraîchissement de la page après un court délai pour s'assurer que les autres composants
      // (comme Sidebar et Topbar) récupèrent également la nouvelle photo
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Erreur upload photo:", err);
      enqueueSnackbar(
        err.message || "Une erreur est survenue lors de l'upload",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modification de l'e-mail ou du nom d'utilisateur
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    setFieldErrors({}); // Réinitialiser les erreurs précédentes

    try {
      const body = {
        username: userInfo.username || "",
        email: userInfo.email || "",
        profile: {
          fullName: userInfo.fullName || "",
          language: userInfo.language || "Français",
        },
      };

      const res = await fetch("http://localhost:8001/auth/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();
      let responseData = {};

      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
        }
      } catch (e) {
        console.log("La réponse n'est pas un JSON valide:", responseText);
      }

      if (!res.ok) {
        // Extraire et formater les erreurs de validation
        if (responseData) {
          // Collecter toutes les erreurs
          const errors = {};
          Object.keys(responseData).forEach((field) => {
            if (Array.isArray(responseData[field])) {
              // Si c'est un tableau d'erreurs
              errors[field] = responseData[field].join(", ");
            } else if (typeof responseData[field] === "object") {
              // Pour les champs imbriqués comme profile.fullName
              Object.keys(responseData[field]).forEach((subfield) => {
                errors[`${field}.${subfield}`] =
                  responseData[field][subfield].join(", ");
              });
            } else {
              // Cas simple où l'erreur est une chaîne
              errors[field] = responseData[field];
            }
          });

          // Mettre à jour l'état des erreurs
          setFieldErrors(errors);

          // Afficher un message avec l'erreur principale
          const mainError =
            errors.email ||
            errors.username ||
            errors.profile ||
            errors.non_field_errors ||
            "Vérifiez les champs en erreur";
          throw new Error(mainError);
        } else {
          throw new Error(
            `Erreur ${res.status}: Impossible de mettre à jour le profil`
          );
        }
      }

      // Succès
      setFieldErrors({}); // Effacer toutes les erreurs
      enqueueSnackbar("Profil mis à jour avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (err) {
      console.error("Erreur sauvegarde profil:", err);
      enqueueSnackbar(err.message || "Une erreur est survenue", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ProfileSectionPaper>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative", mb: 2 }}>
              <StyledAvatar
                src={previewUrl || userInfo.profilePic}
                alt="Photo de profil"
              />
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#444",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#666" },
                }}
                component="label"
                disabled={isSubmitting}
              >
                <EditIcon fontSize="small" />
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", mb: 2, textAlign: "center" }}
            >
              JPG ou PNG de 1 Mo maximum.
              <br />
              Une image carrée est recommandée.
            </Typography>
            {selectedFile && (
              <StyledButton
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadPhoto}
                color="primary"
                sx={{ mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Enregistrer la photo"}
              </StyledButton>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}
            >
              Informations personnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nom complet"
                  variant="outlined"
                  fullWidth
                  value={userInfo.fullName || ""}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  sx={textFieldStyle}
                  disabled={isSubmitting}
                  error={!!fieldErrors["profile.fullName"]}
                  helperText={fieldErrors["profile.fullName"]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom d'utilisateur"
                  variant="outlined"
                  fullWidth
                  value={userInfo.username || ""}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  sx={textFieldStyle}
                  disabled={isSubmitting}
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={userInfo.email || ""}
                  onChange={(e) =>
                    setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                  }
                  sx={textFieldStyle}
                  disabled={isSubmitting}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email || "exemple@domaine.com"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Langue préférée"
                  variant="outlined"
                  fullWidth
                  value={userInfo.language || "Français"}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  SelectProps={{
                    native: true,
                  }}
                  sx={textFieldStyle}
                  disabled={isSubmitting}
                  error={!!fieldErrors["profile.language"]}
                  helperText={fieldErrors["profile.language"]}
                >
                  <option value="Français">Français</option>
                  <option value="English">English</option>
                  <option value="Español">Español</option>
                  <option value="Deutsch">Deutsch</option>
                </TextField>
              </Grid>

              {/* Afficher les erreurs générales si elles existent */}
              {fieldErrors.non_field_errors && (
                <Grid item xs={12}>
                  <FormHelperText error>
                    {fieldErrors.non_field_errors}
                  </FormHelperText>
                </Grid>
              )}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </ProfileSectionPaper>

      <ProfileSectionPaper>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}
        >
          Préférences de compte
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={true} name="darkMode" color="primary" />}
            label="Mode sombre"
            sx={{ color: "#ffffff" }}
          />
          <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 4 }}>
            Activer le thème sombre de l'interface
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={true} name="autoSave" color="primary" />}
            label="Sauvegarde automatique"
            sx={{ color: "#ffffff" }}
          />
          <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 4 }}>
            Sauvegarder automatiquement vos modifications
          </Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Switch checked={false} name="betaFeatures" color="primary" />
            }
            label="Fonctionnalités bêta"
            sx={{ color: "#ffffff" }}
          />
          <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 4 }}>
            Accéder aux fonctionnalités expérimentales
          </Typography>
        </Box>
      </ProfileSectionPaper>
    </>
  );
}
