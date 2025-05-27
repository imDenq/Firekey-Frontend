// src/components/Credentials/CredentialItem.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Divider,
  Tooltip,
  FormControlLabel,
  Switch,
  Button,
  Collapse,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  FormHelperText,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SecurityIcon from "@mui/icons-material/Security";
import ShareIcon from "@mui/icons-material/Share";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LinkIcon from "@mui/icons-material/Link";
import TimerIcon from "@mui/icons-material/Timer";
import NotesIcon from "@mui/icons-material/Notes";
import EventIcon from "@mui/icons-material/Event";
import LabelIcon from "@mui/icons-material/Label";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, alpha } from "@mui/material/styles";

// NOUVEAU IMPORT E2E
import E2EStatusBadge from "../E2EStatusBadge";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  height: 28,
  fontWeight: 500,
  fontSize: "0.75rem",
}));

const TagChip = styled(Chip)(({ theme, tagcolor }) => ({
  borderRadius: 16,
  height: 24,
  margin: "0 4px 4px 0",
  backgroundColor: alpha(tagcolor || "#90caf9", 0.2),
  color: tagcolor || "#90caf9",
  fontSize: "0.7rem",
  fontWeight: 500,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: 8,
  padding: 8,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-2px)",
  },
}));

const InfoField = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: 12,
  padding: "8px 12px",
  borderRadius: 8,
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
}));

const NotesField = styled(Paper)(({ theme, isEmpty }) => ({
  padding: 16,
  borderRadius: 8,
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  marginTop: 12,
  marginBottom: 12,
  transition: "background-color 0.2s",
  border: isEmpty ? "1px dashed rgba(255, 255, 255, 0.1)" : "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  "& .MuiDialogTitle-root": {
    fontSize: "1.2rem",
    fontWeight: 600,
    padding: "20px 24px",
    color: "#ffffff",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  "& .MuiDialogContent-root": {
    padding: "24px",
  },
  "& .MuiDialogActions-root": {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
}));

// Wrapper pour positionner correctement l'indicateur
const CredentialWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
}));

// Nouvel indicateur de force du mot de passe
const PasswordStrengthIndicator = styled(Box)(({ strength }) => {
  const getStrengthColor = () => {
    switch (strength) {
      case "strong":
        return "#4caf50";
      case "medium":
        return "#ff9800";
      case "weak":
        return "#f44336";
      default:
        return "#b0b0b0";
    }
  };

  const getStrengthGradient = () => {
    const color = getStrengthColor();
    return `linear-gradient(135deg, ${alpha(color, 0.9)} 0%, ${alpha(
      color,
      0.6
    )} 100%)`;
  };

  return {
    position: "absolute",
    top: -24, // Positionné au-dessus de la carte
    left: -24, // Positionné à gauche de la carte
    width: 60,
    height: 60,
    background: getStrengthGradient(),
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
    borderTopLeftRadius: 16, // Correspond au border radius de StyledCard dans Credentials.jsx
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 6,
    zIndex: 1,
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
      borderTopLeftRadius: 16,
    },
  };
});

const StrengthIcon = styled(LockIcon)(({ strength }) => {
  const getIconColor = () => {
    switch (strength) {
      case "strong":
        return "#ffffff";
      case "medium":
        return "#ffffff";
      case "weak":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  return {
    fontSize: 18,
    color: getIconColor(),
    position: "relative",
    zIndex: 1,
  };
});

// Style commun pour les TextField
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
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

const CredentialItem = ({
  cred,
  onTogglePassword,
  onEdit,
  onDelete,
  onSensitiveChange,
  onTagAdd,
  onTagRemove,
  availableTags = [],
}) => {
  // État pour la modale de partage
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [expiryDays, setExpiryDays] = useState(1);
  const [accessLimit, setAccessLimit] = useState(1);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [accessLimitEnabled, setAccessLimitEnabled] = useState(true);
  const accessToken = localStorage.getItem("accessToken") || "";

  // États pour les notifications de copie
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  // État pour stocker la date de création
  const [creationDate, setCreationDate] = useState("Date inconnue");

  // État pour le menu des tags
  const [tagsAnchorEl, setTagsAnchorEl] = useState(null);
  const tagsMenuOpen = Boolean(tagsAnchorEl);

  // État pour la force du mot de passe - utiliser les données du credential si disponibles
  const [passwordStrength, setPasswordStrength] = useState(
    cred.strength || "medium"
  );
  const [passwordScore, setPasswordScore] = useState(cred.score || 50);

  // Récupérer la force du mot de passe si elle n'est pas fournie
  useEffect(() => {
    // Les données de force sont maintenant toujours fournies par le parent
    if (cred.strength && cred.score !== undefined) {
      setPasswordStrength(cred.strength);
      setPasswordScore(cred.score);
    }
  }, [cred.strength, cred.score]);

  // Récupérer la date de création au chargement du composant
  useEffect(() => {
    // Si on a déjà la date dans le credential, utiliser celle-ci
    if (cred.created_at) {
      setCreationDate(formatCreationDate(cred.created_at));
    } else {
      // Sinon, essayer de récupérer les détails du credential
      const fetchCredentialDetails = async () => {
        try {
          // Choisir l'endpoint selon le type de credential
          const apiEndpoint =
            cred._source === "e2e"
              ? `http://localhost:8001/api/credentials-e2e/${cred.id}/`
              : `http://localhost:8001/api/credentials/${cred.id}/`;

          const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.created_at) {
              setCreationDate(formatCreationDate(data.created_at));
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des détails du credential:",
            error
          );
        }
      };

      // Appeler la fonction de récupération seulement si l'ID est présent
      if (cred.id) {
        fetchCredentialDetails();
      }
    }
  }, [cred.id, cred.created_at, cred._source, accessToken]);

  // Formater la date de création
  const formatCreationDate = (dateString) => {
    if (!dateString) return "Date inconnue";

    try {
      const date = new Date(dateString);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) return "Date inconnue";

      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date inconnue";
    }
  };

  // Fonction pour copier le mot de passe
  const handleCopyPassword = () => {
    if (cred.password && cred.unlocked) {
      navigator.clipboard
        .writeText(cred.password)
        .then(() => {
          setCopiedPassword(true);
          setTimeout(() => setCopiedPassword(false), 2000);
        })
        .catch((err) => {
          console.error("Erreur lors de la copie", err);
        });
    }
  };

  // Fonction pour copier l'email
  const handleCopyEmail = () => {
    if (cred.email) {
      navigator.clipboard
        .writeText(cred.email)
        .then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        })
        .catch((err) => {
          console.error("Erreur lors de la copie", err);
        });
    }
  };

  // Fonction pour copier la note
  const handleCopyNote = () => {
    const noteContent = cred.note || cred.notes || "";
    if (noteContent) {
      navigator.clipboard
        .writeText(noteContent)
        .then(() => {
          setCopiedNote(true);
          setTimeout(() => setCopiedNote(false), 2000);
        })
        .catch((err) => {
          console.error("Erreur lors de la copie", err);
        });
    }
  };

  // Fonction pour ouvrir le site web
  const handleOpenWebsite = () => {
    if (cred.website) {
      let url = cred.website;
      // Ajouter http:// si nécessaire
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Ouvrir la modale de partage
  const handleOpenShareModal = () => {
    setShareModalOpen(true);
    setGeneratedLink("");
  };

  // Fermer la modale de partage
  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setExpiryDays(1);
    setAccessLimit(1);
    setGeneratedLink("");
  };

  // Générer le lien de partage
  const handleGenerateShareLink = async () => {
    setIsGenerating(true);

    try {
      // Calculer la date d'expiration côté client
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      const payload = {
        credential_id: parseInt(cred.id),
        expires_at: expiryDate.toISOString(), // Envoyer la date directement au format ISO
        max_access_count: accessLimitEnabled ? accessLimit : null,
      };

      console.log("Payload envoyé:", JSON.stringify(payload));
      console.log("Credential ID:", cred.id, "Type:", typeof cred.id);

      const response = await fetch("http://localhost:8001/api/shares/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Réponse d'erreur:", errorText);
        throw new Error("Erreur lors de la génération du lien");
      }

      const data = await response.json();
      const shareUrl = `http://localhost:5173/share/${data.share_id}`;
      setGeneratedLink(shareUrl);
    } catch (error) {
      console.error("Erreur:", error);
      // Idéalement utiliser un snackbar ici
    } finally {
      setIsGenerating(false);
    }
  };

  // Copier le lien généré
  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard
        .writeText(generatedLink)
        .then(() => {
          console.log("Lien copié !");
          // Idéalement afficher un snackbar ici
        })
        .catch((err) => {
          console.error("Erreur lors de la copie", err);
        });
    }
  };

  // Gestion du menu de tags
  const handleTagsMenuOpen = (event) => {
    setTagsAnchorEl(event.currentTarget);
  };

  const handleTagsMenuClose = () => {
    setTagsAnchorEl(null);
  };

  // Fonction pour ajouter un tag
  const handleAddTag = (tagId) => {
    if (onTagAdd) {
      onTagAdd(cred.id, tagId);
    }
    handleTagsMenuClose();
  };

  // Fonction pour supprimer un tag
  const handleRemoveTag = (tagId) => {
    if (onTagRemove) {
      onTagRemove(cred.id, tagId);
    }
  };

  // Filtrer les tags non utilisés pour le menu
  const unusedTags = availableTags.filter(
    (tag) => !cred.tags || !cred.tags.some((credTag) => credTag.id === tag.id)
  );

  // Obtenir le texte de la force du mot de passe
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "strong":
        return "Fort";
      case "medium":
        return "Moyen";
      case "weak":
        return "Faible";
      default:
        return "Inconnu";
    }
  };

  // Récupérer le contenu de la note (compatible E2E et legacy)
  const getNoteContent = () => {
    return cred.note || cred.notes || "";
  };

  return (
    <CredentialWrapper>
      {/* Indicateur de force du mot de passe */}
      <Tooltip
        title={`Mot de passe ${getPasswordStrengthText()} (Score: ${passwordScore}/100)`}
        placement="top-start"
        arrow
      >
        <PasswordStrengthIndicator
          strength={passwordStrength}
        ></PasswordStrengthIndicator>
      </Tooltip>

      {/* Contenu du credential */}
      <Box>
        {/* Ligne principale avec le nom et les actions */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {cred.name}
                {cred.is_sensitive && (
                  <Tooltip title="Credential sensible - Protégé par mot de passe">
                    <SecurityIcon
                      sx={{ color: "#f44336", ml: 1, fontSize: 20 }}
                    />
                  </Tooltip>
                )}
              </Typography>

              {/* NOUVEAU: Badge E2E */}
              <E2EStatusBadge credential={cred} />

              {cred.website && (
                <Chip
                  label={cred.website}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#e0e0e0",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
                    ml: 1,
                  }}
                  icon={
                    <LanguageIcon
                      sx={{
                        fontSize: "16px !important",
                        color: "#e0e0e0 !important",
                      }}
                    />
                  }
                  onClick={handleOpenWebsite}
                />
              )}
            </Box>

            {/* Tags sous le titre */}
            {cred.tags && cred.tags.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mt: 1,
                  mb: 1,
                }}
              >
                {cred.tags.map((tag) => (
                  <TagChip
                    key={tag.id}
                    label={tag.name}
                    tagcolor={tag.color}
                    size="small"
                    onDelete={() => handleRemoveTag(tag.id)}
                  />
                ))}
                {/* Bouton d'ajout de tag */}
                {unusedTags.length > 0 && (
                  <Tooltip title="Ajouter un tag">
                    <Chip
                      icon={<LabelIcon sx={{ fontSize: "18px !important" }} />}
                      label="+"
                      size="small"
                      variant="outlined"
                      onClick={handleTagsMenuOpen}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        color: "#b0b0b0",
                        height: 24,
                        cursor: "pointer",
                        ml: 1,
                        "&:hover": {
                          borderColor: "rgba(255, 255, 255, 0.4)",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            )}

            {/* Menu pour ajouter des tags */}
            <Menu
              anchorEl={tagsAnchorEl}
              open={tagsMenuOpen}
              onClose={handleTagsMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                Ajouter un tag
              </Typography>
              <Divider
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", mb: 1 }}
              />
              {unusedTags.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    Aucun tag disponible
                  </Typography>
                </MenuItem>
              ) : (
                unusedTags.map((tag) => (
                  <MenuItem key={tag.id} onClick={() => handleAddTag(tag.id)}>
                    <LabelIcon
                      sx={{ mr: 1, color: tag.color }}
                      fontSize="small"
                    />
                    <Typography variant="body2">{tag.name}</Typography>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Date de création - utilise l'état local pour afficher la date */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <EventIcon sx={{ color: "#b0b0b0", fontSize: 16, mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                Créé le {creationDate}
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Partager">
                <ActionButton onClick={handleOpenShareModal}>
                  <ShareIcon fontSize="small" sx={{ color: "#4caf50" }} />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Modifier">
                <ActionButton onClick={() => onEdit(cred)}>
                  <EditIcon fontSize="small" sx={{ color: "#90caf9" }} />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <ActionButton onClick={() => onDelete(cred)}>
                  <DeleteIcon fontSize="small" sx={{ color: "#f44336" }} />
                </ActionButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

        <Grid container spacing={3}>
          {/* Informations du credential */}
          <Grid item xs={12} md={8}>
            {cred.email && (
              <InfoField>
                <EmailIcon sx={{ color: "#b0b0b0", mr: 2, fontSize: 20 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="#e0e0e0">
                    {cred.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {copiedEmail && (
                    <Chip
                      label="Copié !"
                      size="small"
                      color="success"
                      sx={{ height: 24, mr: 1 }}
                    />
                  )}
                  <Tooltip title="Copier l'email">
                    <IconButton
                      size="small"
                      onClick={handleCopyEmail}
                      sx={{ color: "#b0b0b0" }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </InfoField>
            )}

            {/* Affichage du mot de passe */}
            <InfoField
              sx={{
                backgroundColor: cred.unlocked
                  ? "rgba(144, 202, 249, 0.08)"
                  : "rgba(255, 255, 255, 0.03)",
                border: cred.unlocked
                  ? "1px solid rgba(144, 202, 249, 0.2)"
                  : "none",
              }}
            >
              <LockIcon
                sx={{
                  color: cred.unlocked ? "#90caf9" : "#b0b0b0",
                  mr: 2,
                  fontSize: 20,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                {cred.unlocked ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ffffff",
                      fontFamily: "monospace",
                      fontSize: "1rem",
                      letterSpacing: "0.5px",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      py: "4px",
                      px: 2,
                      borderRadius: 1,
                      display: "inline-block",
                    }}
                  >
                    {cred.password}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    •••••••••••••••
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {copiedPassword && cred.unlocked && (
                  <Chip
                    label="Copié !"
                    size="small"
                    color="success"
                    sx={{ height: 24, mr: 1 }}
                  />
                )}
                <Tooltip title={cred.unlocked ? "Masquer" : "Afficher"}>
                  <IconButton
                    size="small"
                    onClick={() => onTogglePassword(cred)}
                    sx={{ color: cred.unlocked ? "#90caf9" : "#b0b0b0" }}
                  >
                    {cred.unlocked ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                {cred.unlocked && (
                  <Tooltip title="Copier le mot de passe">
                    <IconButton
                      size="small"
                      onClick={handleCopyPassword}
                      sx={{ color: "#b0b0b0" }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </InfoField>

            {/* Notes - Toujours afficher la section, même si vide */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#b0b0b0",
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  fontSize: "0.75rem",
                }}
              >
                <NotesIcon sx={{ fontSize: 16, mr: 0.5, color: "#90caf9" }} />
                Notes:
              </Typography>
              <NotesField
                isEmpty={!getNoteContent() || getNoteContent().trim() === ""}
              >
                {getNoteContent() && getNoteContent().trim() !== "" ? (
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#e0e0e0",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        pr: 4, // Espace pour le bouton de copie
                      }}
                    >
                      {getNoteContent()}
                    </Typography>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copiedNote && (
                        <Chip
                          label="Copié !"
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: "0.7rem", mr: 1 }}
                        />
                      )}
                      <Tooltip title="Copier la note">
                        <IconButton
                          size="small"
                          onClick={handleCopyNote}
                          sx={{ color: "#b0b0b0" }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", fontStyle: "italic" }}
                  >
                    Aucune note pour ce credential.
                  </Typography>
                )}
              </NotesField>
            </Box>
          </Grid>

          {/* Contrôles et options */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderRadius: 2,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={cred.is_sensitive}
                    onChange={(e) => onSensitiveChange(cred, e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#ffffff", fontWeight: 500 }}
                    >
                      Protection renforcée
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#b0b0b0", display: "block" }}
                    >
                      {cred.is_sensitive
                        ? "Vérification supplémentaire activée"
                        : "Accessible sans confirmation"}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", ml: 4, mb: 2 }}
              />

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
              >
                {cred.website && (
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    startIcon={<OpenInNewIcon />}
                    onClick={handleOpenWebsite}
                    size="small"
                  >
                    Visiter le site
                  </StyledButton>
                )}

                {/* MODIFIÉ: Ne montrer le partage que pour les credentials legacy */}
                {cred._source !== "e2e" && (
                  <StyledButton
                    variant="outlined"
                    color="success"
                    startIcon={<ShareIcon />}
                    onClick={handleOpenShareModal}
                    size="small"
                  >
                    Partager ce credential
                  </StyledButton>
                )}

                {/* Afficher un message pour les credentials E2E */}
                {cred._source === "e2e" && (
                  <Tooltip title="Les credentials E2E ne peuvent pas être partagés car ils sont chiffrés localement">
                    <Box>
                      <StyledButton
                        variant="outlined"
                        color="primary"
                        startIcon={<ShareIcon />}
                        disabled
                        size="small"
                        sx={{ opacity: 0.5 }}
                      >
                        Partage E2E indisponible
                      </StyledButton>
                    </Box>
                  </Tooltip>
                )}
              </Box>

              <StyledButton
                variant="contained"
                color="primary"
                startIcon={
                  cred.unlocked ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
                onClick={() => onTogglePassword(cred)}
              >
                {cred.unlocked ? "Masquer" : "Afficher"}
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Modale de partage - SEULEMENT pour les credentials legacy */}
      {cred._source !== "e2e" && (
        <StyledDialog
          open={shareModalOpen}
          onClose={handleCloseShareModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Partager {cred.name}</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3, mt: 1 }}>
              <Alert
                severity="info"
                sx={{
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  color: "#90caf9",
                  border: "none",
                  mb: 3,
                }}
              >
                Le lien partagé permet d'accéder une seule fois aux informations
                du credential sans nécessiter de connexion.
              </Alert>

              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "#ffffff", fontWeight: 500 }}
              >
                Paramètres du lien
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarTodayIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "#90caf9" }}
                  />
                  Expiration du lien
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Slider
                    value={expiryDays}
                    onChange={(e, newValue) => setExpiryDays(newValue)}
                    step={1}
                    min={1}
                    max={30}
                    valueLabelDisplay="auto"
                    aria-labelledby="expiry-slider"
                    sx={{
                      color: "#90caf9",
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                  <TextField
                    variant="outlined"
                    value={expiryDays}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 30) {
                        setExpiryDays(value);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">jours</InputAdornment>
                      ),
                    }}
                    sx={{ ...textFieldStyle, width: "120px" }}
                  />
                </Box>
                <FormHelperText sx={{ color: "#b0b0b0" }}>
                  Le lien expirera automatiquement après {expiryDays} jour
                  {expiryDays > 1 ? "s" : ""}.
                </FormHelperText>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={accessLimitEnabled}
                      onChange={(e) => setAccessLimitEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TimerIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#90caf9" }}
                      />
                      Limiter le nombre d'accès
                    </Typography>
                  }
                />

                {accessLimitEnabled && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                      ml: 4,
                    }}
                  >
                    <Slider
                      value={accessLimit}
                      onChange={(e, newValue) => setAccessLimit(newValue)}
                      step={1}
                      min={1}
                      max={10}
                      valueLabelDisplay="auto"
                      aria-labelledby="access-slider"
                      sx={{
                        color: "#90caf9",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                    <TextField
                      variant="outlined"
                      value={accessLimit}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 10) {
                          setAccessLimit(value);
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">accès</InputAdornment>
                        ),
                      }}
                      sx={{ ...textFieldStyle, width: "120px" }}
                    />
                  </Box>
                )}

                <FormHelperText
                  sx={{ color: "#b0b0b0", ml: accessLimitEnabled ? 4 : 0 }}
                >
                  {accessLimitEnabled
                    ? `Le lien sera désactivé après ${accessLimit} utilisation${
                        accessLimit > 1 ? "s" : ""
                      }.`
                    : "Le lien pourra être utilisé un nombre illimité de fois avant expiration."}
                </FormHelperText>
              </Box>

              {generatedLink && (
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, color: "#ffffff", fontWeight: 500 }}
                  >
                    Lien de partage généré
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={generatedLink}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon sx={{ color: "#90caf9" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleCopyLink}
                            edge="end"
                            sx={{ color: "#b0b0b0" }}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyle}
                  />
                  <FormHelperText sx={{ color: "#4caf50", mt: 1 }}>
                    Cliquez sur l'icône pour copier le lien
                  </FormHelperText>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleCloseShareModal} color="inherit">
              Fermer
            </StyledButton>
            {!generatedLink ? (
              <StyledButton
                onClick={handleGenerateShareLink}
                variant="contained"
                color="primary"
                disabled={isGenerating}
                startIcon={<ShareIcon />}
              >
                {isGenerating ? "Génération..." : "Générer le lien"}
              </StyledButton>
            ) : (
              <StyledButton
                onClick={handleCopyLink}
                variant="contained"
                color="success"
                startIcon={<ContentCopyIcon />}
              >
                Copier le lien
              </StyledButton>
            )}
          </DialogActions>
        </StyledDialog>
      )}
    </CredentialWrapper>
  );
};

export default CredentialItem;
