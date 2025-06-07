// src/pages/Credentials.jsx - Version complète corrigée
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  Paper,
  Divider,
  Avatar,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  Tabs,
  Tab,
  Badge,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Switch,
} from "@mui/material";

import { useSnackbar } from "notistack";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CredentialItem from "../components/Credentials/CredentialItem";
import PasswordGenerator from "../components/Credentials/PasswordGenerator";
import TagsManager from "../components/Credentials/TagsManager";
import TagSelector from "../components/Credentials/TagSelector";
import HybridCredentialService from "../services/HybridCredentialService";
import E2ESetupModal from "../components/E2ESetupModal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyIcon from "@mui/icons-material/Key";
import TuneIcon from "@mui/icons-material/Tune";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShieldIcon from "@mui/icons-material/Shield";
import CloudIcon from "@mui/icons-material/Cloud";

// Styled components
const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 8,
  padding: "10px 16px",
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

const SearchBar = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    height: 44,
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "#444" },
    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
  },
  "& .MuiInputLabel-root": {
    color: "#b0b0b0",
    "&.Mui-focused": { color: "#90caf9" },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
  },
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 16,
  backgroundColor: "#1e1e1e",
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledToolbar = styled(Paper)(({ theme }) => ({
  padding: "16px 20px",
  borderRadius: 12,
  marginBottom: 24,
  backgroundColor: "#1e1e1e",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "40px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 300,
}));

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

// Styled Tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  marginBottom: 2,
  "& .MuiTabs-indicator": {
    backgroundColor: "#90caf9",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minWidth: 0,
    padding: "12px 16px",
    color: "#b0b0b0",
    "&.Mui-selected": {
      color: "#90caf9",
      fontWeight: 500,
    },
  },
}));

// Styled Radio pour les méthodes de chiffrement
const EncryptionMethodCard = styled(Paper)(({ theme, selected }) => ({
  padding: 16,
  borderRadius: 12,
  backgroundColor: selected
    ? alpha("#90caf9", 0.1)
    : "rgba(255, 255, 255, 0.05)",
  border: selected ? "2px solid #90caf9" : "1px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: selected
      ? alpha("#90caf9", 0.15)
      : "rgba(255, 255, 255, 0.08)",
    transform: "translateY(-2px)",
  },
}));

export default function Credentials() {
  const drawerWidth = 240;
  const { enqueueSnackbar } = useSnackbar();
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'sensitive', 'normal'
  const [activeTagFilter, setActiveTagFilter] = useState(null); // Pour filtrer par tag
  const [tags, setTags] = useState([]); // Liste des tags disponibles
  const accessToken = localStorage.getItem("accessToken") || "";

  // États E2E corrigés avec état backend
  const [hybridService] = useState(() => new HybridCredentialService());
  const [e2eStatus, setE2eStatus] = useState({
    e2eAvailable: false,
    e2eEnabled: false,
    e2eUnlocked: false,
    setupCompleted: false,
    activatedAt: null,
    isNewUser: false,
  });
  const [showE2ESetup, setShowE2ESetup] = useState(false);

  // États pour les menus
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [tagAnchorEl, setTagAnchorEl] = useState(null); // Menu pour filtrer par tag
  const openFilterMenu = Boolean(filterAnchorEl);
  const openSortMenu = Boolean(sortAnchorEl);
  const openTagMenu = Boolean(tagAnchorEl);

  // États pour les modales
  const [tagsManagerOpen, setTagsManagerOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyModalCred, setVerifyModalCred] = useState(null);
  const [verifyPurpose, setVerifyPurpose] = useState(""); // 'unlock' ou 'disableSensitive'
  const [typedPassword, setTypedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [e2eSetupOpen, setE2eSetupOpen] = useState(false);

  // States pour la création d'un nouveau credential
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newIsSensitive, setNewIsSensitive] = useState(false);
  const [newTags, setNewTags] = useState([]); // Tags pour le nouveau credential
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTabAdd, setActiveTabAdd] = useState(0);

  // État pour choisir la méthode de chiffrement
  const [encryptionMethod, setEncryptionMethod] = useState("auto"); // "auto", "legacy", "e2e"

  // States pour l'édition d'un credential
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editIsSensitive, setEditIsSensitive] = useState(false);
  const [editTags, setEditTags] = useState([]); // Tags pour le credential en édition
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [activeTabEdit, setActiveTabEdit] = useState(0);

  // States pour la suppression d'un credential
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  // CORRIGÉ: Chargement initial sans double appel
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 Initialisation de l'application...");

        // MODIFIÉ: Initialiser sans mot de passe au premier chargement
        const status = await hybridService.initialize();
        console.log("🎯 Status E2E initial:", status);
        setE2eStatus(status);

        // Charger les credentials et tags
        await fetchCredentials();
        await fetchTags();

        console.log("✅ Initialisation terminée");
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        enqueueSnackbar("Erreur lors de l'initialisation de l'application", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    };

    initializeApp();
  }, []); // IMPORTANT: tableau de dépendances vide pour éviter les re-rendus

  // CORRIGÉ: Fonction pour rafraîchir le statut E2E
  const refreshE2EStatus = async () => {
    try {
      console.log("🔄 Rafraîchissement du statut E2E...");

      // IMPORTANT: Ne pas réinitialiser complètement, juste récupérer le statut
      const status = await hybridService.getE2EStatus(true); // Force refresh

      // Mettre à jour uniquement les champs de statut, garder l'état de session
      const currentStatus = await hybridService.initialize();
      setE2eStatus(currentStatus);

      console.log("✅ Statut E2E rafraîchi:", currentStatus);
      return currentStatus;
    } catch (error) {
      console.error("❌ Erreur rafraîchissement statut E2E:", error);
      return null;
    }
  };

  // Filtrer les credentials quand la recherche change ou le filtre change
  useEffect(() => {
    if (!credentials.length) {
      setFilteredCredentials([]);
      return;
    }

    let filtered = [...credentials];

    // Appliquer le filtre de sensibilité
    if (activeFilter === "sensitive") {
      filtered = filtered.filter((cred) => cred.is_sensitive);
    } else if (activeFilter === "normal") {
      filtered = filtered.filter((cred) => !cred.is_sensitive);
    }

    // Appliquer le filtre par tag
    if (activeTagFilter) {
      filtered = filtered.filter(
        (cred) =>
          cred.tags && cred.tags.some((tag) => tag.id === activeTagFilter.id)
      );
    }

    // Appliquer la recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (cred) =>
          cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cred.website &&
            cred.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (cred.email &&
            cred.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (cred.tags &&
            cred.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    setFilteredCredentials(filtered);
  }, [searchQuery, credentials, activeFilter, activeTagFilter]);

  // ---------------------------------------
  // Gestion des menus
  // ---------------------------------------
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleTagMenuOpen = (event) => {
    setTagAnchorEl(event.currentTarget);
  };

  const handleTagMenuClose = () => {
    setTagAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    handleFilterMenuClose();
  };

  const handleTagFilterChange = (tag) => {
    setActiveTagFilter(tag);
    handleTagMenuClose();
  };

  const handleSort = (sortType) => {
    let sortedCreds = [...credentials];

    if (sortType === "name-asc") {
      sortedCreds.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "name-desc") {
      sortedCreds.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === "date-newest") {
      sortedCreds.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortType === "date-oldest") {
      sortedCreds.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (sortType === "strength-strongest") {
      // Trier par force décroissante (fort -> moyen -> faible)
      sortedCreds.sort((a, b) => {
        const strengthOrder = { strong: 3, medium: 2, weak: 1 };
        const aStrength = strengthOrder[a.strength] || 0;
        const bStrength = strengthOrder[b.strength] || 0;
        // Si même force, trier par score
        if (aStrength === bStrength) {
          return (b.score || 0) - (a.score || 0);
        }
        return bStrength - aStrength;
      });
    } else if (sortType === "strength-weakest") {
      // Trier par force croissante (faible -> moyen -> fort)
      sortedCreds.sort((a, b) => {
        const strengthOrder = { strong: 3, medium: 2, weak: 1 };
        const aStrength = strengthOrder[a.strength] || 0;
        const bStrength = strengthOrder[b.strength] || 0;
        // Si même force, trier par score
        if (aStrength === bStrength) {
          return (a.score || 0) - (b.score || 0);
        }
        return aStrength - bStrength;
      });
    }

    setCredentials(sortedCreds);
    handleSortMenuClose();
  };

  const openTagsManager = () => {
    setTagsManagerOpen(true);
  };

  // ---------------------------------------
  // 1) Récupérer les données - MODIFIÉ pour utiliser HybridCredentialService
  // ---------------------------------------
  const fetchCredentials = async () => {
    try {
      console.log("📥 Récupération des credentials...");

      // Utiliser le service hybride au lieu de l'API directe
      const allCredentials = await hybridService.getAllCredentials();

      // Combiner les credentials E2E et legacy
      const combinedCredentials = [
        ...allCredentials.e2e.map((cred) => ({ ...cred, _source: "e2e" })),
        ...allCredentials.legacy.map((cred) => ({
          ...cred,
          _source: "legacy",
        })),
      ];

      console.log(
        `📦 ${combinedCredentials.length} credentials récupérés (${allCredentials.e2e.length} E2E + ${allCredentials.legacy.length} legacy)`
      );

      // Enrichir avec les données de sécurité (comme avant)
      try {
        const securityRes = await fetch(
          "https://firekey.theokaszak.fr/api/security/dashboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (securityRes.ok) {
          const securityData = await securityRes.json();
          const strengthMap = {};

          if (securityData.recent_credentials) {
            securityData.recent_credentials.forEach((cred) => {
              strengthMap[cred.id] = {
                strength: cred.strength,
                score: cred.score,
              };
            });
          }

          const enrichedCredentials = combinedCredentials.map((cred) => ({
            ...cred,
            strength: strengthMap[cred.id]?.strength || "medium",
            score: strengthMap[cred.id]?.score || 50,
          }));

          setCredentials(enrichedCredentials);
          setFilteredCredentials(enrichedCredentials);
        } else {
          setCredentials(combinedCredentials);
          setFilteredCredentials(combinedCredentials);
        }
      } catch (securityErr) {
        console.error("Erreur données de sécurité:", securityErr);
        setCredentials(combinedCredentials);
        setFilteredCredentials(combinedCredentials);
      }
    } catch (err) {
      console.error("❌ Erreur récupération credentials:", err);
      enqueueSnackbar("Impossible de récupérer la liste des credentials", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch("https://firekey.theokaszak.fr/api/tags/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Erreur fetch tags");
      }
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Impossible de récupérer les tags", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // Fonctions E2E corrigées
  // ---------------------------------------
  const initializeE2E = async () => {
    setE2eSetupOpen(true);
  };

  // CORRIGÉ: Callback après activation E2E
  const handleE2EActivationSuccess = async (userPassword) => {
    try {
      console.log("🔐 Activation E2E avec mot de passe...");

      const result = await hybridService.activateE2E(userPassword);

      if (result.success) {
        console.log("✅ E2E activé côté backend");

        // IMPORTANT: Attendre un peu puis réinitialiser complètement
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Forcer un refresh complet du statut
        const newStatus = await hybridService.initialize(userPassword);
        console.log("🔄 Nouveau statut après activation:", newStatus);

        if (newStatus) {
          setE2eStatus(newStatus);

          // Vérifier que le service est bien débloqué
          console.log("🔧 Service débloqué après activation:", {
            isUnlocked: hybridService.isE2EUnlocked(),
            isReady:
              hybridService.isE2EReadyForCreation?.() ||
              "méthode non disponible",
          });

          enqueueSnackbar("E2E activé avec succès! 🔒", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });

          // Rafraîchir les credentials
          await fetchCredentials();

          // Fermer la modal
          setE2eSetupOpen(false);
        }
      } else {
        enqueueSnackbar(result.error || "Erreur lors de l'activation E2E", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (error) {
      console.error("❌ Erreur activation E2E:", error);
      enqueueSnackbar("Erreur lors de l'activation E2E", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 2) Ajout d'un credential - CORRIGÉ pour E2E
  // ---------------------------------------
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
    setActiveTabAdd(0);
    setNewTags([]);

    // Définir la méthode par défaut basée sur le statut backend
    if (e2eStatus.e2eEnabled) {
      setEncryptionMethod("auto"); // Auto = E2E si disponible
    } else {
      setEncryptionMethod("legacy");
    }
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewName("");
    setNewWebsite("");
    setNewEmail("");
    setNewPassword("");
    setNewNote("");
    setNewIsSensitive(false);
    setNewTags([]);
    setShowNewPassword(false);
    setActiveTabAdd(0);
    setEncryptionMethod("auto");
  };

  // CORRIGÉ: Fonction de sauvegarde avec logique E2E améliorée

  const handleSaveCredential = async () => {
    if (!newName.trim()) {
      enqueueSnackbar("Le champ Nom est requis", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    try {
      // Préparer les données du credential
      const credentialData = {
        name: newName.trim(),
        website: newWebsite.trim(),
        email: newEmail.trim(),
        password: newPassword || "password123",
        note: newNote.trim(),
        is_sensitive: newIsSensitive,
        tag_ids: newTags.map((tag) => tag.id),
      };

      console.log("💾 Préparation sauvegarde credential...");
      console.log("🎯 Méthode de chiffrement sélectionnée:", encryptionMethod);
      console.log("🔐 État E2E complet:", e2eStatus);
      console.log("🔧 Service E2E état:", {
        isUnlocked: hybridService.isE2EUnlocked(),
        isReady:
          hybridService.isE2EReadyForCreation?.() || "méthode non disponible",
      });

      let result;

      // CORRIGÉ: Logique simplifiée pour E2E
      if (encryptionMethod === "e2e") {
        // Forcer E2E - Vérifier seulement que c'est activé
        if (!e2eStatus.e2eEnabled) {
          throw new Error(
            "E2E n'est pas activé. Veuillez d'abord activer E2E."
          );
        }

        console.log("🔒 Utilisation du chiffrement E2E forcé");
        result = await hybridService.saveCredentialE2E(credentialData);
      } else if (encryptionMethod === "auto" && e2eStatus.e2eEnabled) {
        // Mode auto avec E2E activé - Essayer E2E en premier
        console.log("🔄 Mode automatique - Tentative E2E");
        try {
          result = await hybridService.saveCredentialE2E(credentialData);
        } catch (e2eError) {
          console.warn(
            "⚠️ Échec E2E, basculement vers Legacy:",
            e2eError.message
          );
          // Si E2E échoue, basculer vers Legacy
          result = await hybridService.saveCredentialLegacy(credentialData);
        }
      } else {
        // Legacy par défaut
        console.log("🗄️ Utilisation du chiffrement Legacy");
        result = await hybridService.saveCredentialLegacy(credentialData);
      }

      if (result.success) {
        console.log("✅ Credential sauvegardé:", result.type);

        // Rafraîchir la liste
        await fetchCredentials();

        enqueueSnackbar(
          `Credential ajouté avec succès (${result.type.toUpperCase()})`,
          {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );

        handleCloseAddModal();
      } else {
        throw new Error(
          result.error || "Erreur inconnue lors de la sauvegarde"
        );
      }
    } catch (err) {
      console.error("❌ Erreur sauvegarde credential:", err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 3) Édition d'un credential - MODIFIÉ
  // ---------------------------------------
  const handleOpenEditModal = (cred) => {
    setEditId(cred.id);
    setEditName(cred.name);
    setEditWebsite(cred.website || "");
    setEditEmail(cred.email || "");
    setEditNote(cred.note || cred.notes || "");
    setEditIsSensitive(cred.is_sensitive);
    setEditTags(cred.tags || []);

    // Réinitialiser les états liés au mot de passe
    setEditPassword("");
    setShowEditPassword(false);
    setChangePassword(false);
    setActiveTabEdit(0);

    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditId(null);
    setEditName("");
    setEditWebsite("");
    setEditEmail("");
    setEditNote("");
    setEditIsSensitive(false);
    setEditTags([]);
    setEditPassword("");
    setShowEditPassword(false);
    setChangePassword(false);
    setActiveTabEdit(0);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      enqueueSnackbar("Le champ Nom est requis", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    // Vérifier si le mot de passe n'est pas vide quand on veut le changer
    if (changePassword && !editPassword.trim()) {
      enqueueSnackbar("Le nouveau mot de passe ne peut pas être vide", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    // Récupérer le credential actuel pour comparer l'état "sensible"
    const currentCred = credentials.find((c) => c.id === editId);

    // Si on désactive la protection renforcée d'un credential sensible
    // On doit demander une vérification de mot de passe
    if (currentCred && currentCred.is_sensitive && !editIsSensitive) {
      // Fermer la modale d'édition
      setEditModalOpen(false);

      // Ouvrir la modale de vérification du mot de passe
      setVerifyModalCred(currentCred);
      setVerifyPurpose("disableSensitive");
      setTypedPassword("");
      setShowPassword(false);
      setVerifyModalOpen(true);

      // Sauvegarder les valeurs d'édition pour les utiliser après vérification
      const pendingEditData = {
        id: editId,
        name: editName.trim(),
        website: editWebsite.trim(),
        email: editEmail.trim(),
        note: editNote.trim(),
        is_sensitive: false, // On veut désactiver la protection
        tag_ids: editTags.map((tag) => tag.id),
      };

      // Ajouter le mot de passe s'il a été modifié
      if (changePassword) {
        pendingEditData.password = editPassword;
      }

      sessionStorage.setItem("pendingEdit", JSON.stringify(pendingEditData));

      return;
    }

    try {
      const body = {
        name: editName.trim(),
        website: editWebsite.trim(),
        email: editEmail.trim(),
        note: editNote.trim(),
        is_sensitive: editIsSensitive,
        tag_ids: editTags.map((tag) => tag.id),
      };

      // Ajouter le mot de passe au body seulement s'il a été modifié
      if (changePassword) {
        body.password = editPassword;
      }

      // MODIFIÉ: Utiliser le service hybride
      const isE2E = currentCred._source === "e2e";
      const result = await hybridService.updateCredential(editId, body, isE2E);

      if (result.success) {
        enqueueSnackbar("Credential modifié avec succès", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        // Rafraîchir la liste
        await fetchCredentials();
        handleCloseEditModal();
      }
    } catch (err) {
      console.error("❌ Erreur modification credential:", err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 4) Suppression d'un credential - MODIFIÉ
  // ---------------------------------------
  const handleOpenDeleteModal = (cred) => {
    setDeleteId(cred.id);
    setDeleteName(cred.name);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const handleConfirmDelete = async () => {
    try {
      const currentCred = credentials.find((c) => c.id === deleteId);
      const isE2E = currentCred._source === "e2e";

      // MODIFIÉ: Utiliser le service hybride
      const result = await hybridService.deleteCredential(deleteId, isE2E);

      if (result.success) {
        enqueueSnackbar("Credential supprimé avec succès", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        // Rafraîchir la liste
        await fetchCredentials();
        handleCloseDeleteModal();
      }
    } catch (err) {
      console.error("❌ Erreur suppression credential:", err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 5) Déverrouillage (toggle password)
  // ---------------------------------------
  const handleTogglePassword = (cred) => {
    // Si pas unlocké => on veut déverrouiller
    if (!cred.unlocked) {
      if (cred.is_sensitive) {
        // S'il est sensible, on demande le mdp
        setVerifyModalCred(cred);
        setVerifyPurpose("unlock");
        setTypedPassword("");
        setShowPassword(false);
        setVerifyModalOpen(true);
      } else {
        // Non sensible => on appelle directement /decrypt/
        decryptNonSensitive(cred);
      }
    } else {
      // Si déjà unlocké => on re-masque
      setCredentials((prev) =>
        prev.map((c) => (c.id === cred.id ? { ...c, unlocked: false } : c))
      );
    }
  };

  // Déchiffrer un credential non-sensible sans exiger le mot de passe de compte
  const decryptNonSensitive = async (cred) => {
    try {
      // Pour les credentials E2E, le mot de passe est déjà disponible
      if (cred._source === "e2e") {
        setCredentials((prev) =>
          prev.map((c) => (c.id === cred.id ? { ...c, unlocked: true } : c))
        );
        enqueueSnackbar("Mot de passe affiché", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        return;
      }

      // Pour les credentials legacy
      const res = await fetch(
        `https://firekey.theokaszak.fr/api/credentials/${cred.id}/decrypt/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Impossible de déchiffrer");
      }
      const data = await res.json(); // { password: "..." }

      // Mettre à jour localement
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id
            ? { ...c, password: data.password, unlocked: true }
            : c
        )
      );
      enqueueSnackbar("Mot de passe affiché", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 6) Changement "Sensible"
  // ---------------------------------------
  const handleSensitiveChange = (cred, checked) => {
    // On veut désactiver "sensible" => demander mdp
    if (cred.is_sensitive && !checked) {
      setVerifyModalCred(cred);
      setVerifyPurpose("disableSensitive");
      setTypedPassword("");
      setShowPassword(false);
      setVerifyModalOpen(true);
    } else {
      // Cas normal: on active la sensibilité, ou on modifie sans mdp
      patchIsSensitive(cred, checked);
    }
  };

  const patchIsSensitive = async (cred, checked) => {
    try {
      const body = { is_sensitive: checked };

      // MODIFIÉ: Utiliser le service hybride
      const isE2E = cred._source === "e2e";
      const result = await hybridService.updateCredential(cred.id, body, isE2E);

      if (result.success) {
        enqueueSnackbar("Modification enregistrée", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        // Rafraîchir la liste
        await fetchCredentials();
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 7) Vérification du mot de passe de compte
  // ---------------------------------------

  const handleVerifyPassword = async () => {
    if (!verifyModalCred) return;

    try {
      // 1) Vérifier le mot de passe de compte
      const apiEndpoint =
        verifyModalCred._source === "e2e"
          ? `https://firekey.theokaszak.fr/api/credentials-e2e/${verifyModalCred.id}/verify/`
          : `https://firekey.theokaszak.fr/api/credentials/${verifyModalCred.id}/verify/`;

      const verifyRes = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password: typedPassword }),
      });
      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Erreur de vérification");
      }

      // 2) Selon le but (unlock ou disableSensitive)
      if (verifyPurpose === "unlock") {
        if (verifyModalCred._source === "e2e") {
          // Pour E2E, le mot de passe est déjà disponible
          setCredentials((prev) =>
            prev.map((c) =>
              c.id === verifyModalCred.id ? { ...c, unlocked: true } : c
            )
          );
          enqueueSnackbar("Déverrouillé avec succès", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        } else {
          // Pour legacy, on appelle decrypt
          const decryptRes = await fetch(
            `https://firekey.theokaszak.fr/api/credentials/${verifyModalCred.id}/decrypt/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!decryptRes.ok) {
            const errData = await decryptRes.json();
            throw new Error(errData.error || "Impossible de déchiffrer");
          }
          const data = await decryptRes.json(); // { password: "..." }

          // On met à jour le credential
          setCredentials((prev) =>
            prev.map((c) =>
              c.id === verifyModalCred.id
                ? { ...c, password: data.password, unlocked: true }
                : c
            )
          );
          enqueueSnackbar("Déverrouillé avec succès", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        }
      } else if (verifyPurpose === "disableSensitive") {
        // Vérifier si c'est une modification en attente depuis l'édition
        const pendingEditStr = sessionStorage.getItem("pendingEdit");

        if (pendingEditStr) {
          // C'est une édition complète qui a été interrompue pour vérifier le mot de passe
          const pendingEdit = JSON.parse(pendingEditStr);

          // MODIFIÉ: Utiliser le service hybride
          const isE2E = verifyModalCred._source === "e2e";
          const result = await hybridService.updateCredential(
            pendingEdit.id,
            pendingEdit,
            isE2E
          );

          if (result.success) {
            // Supprimer les données d'édition en attente
            sessionStorage.removeItem("pendingEdit");

            enqueueSnackbar("Credential modifié avec succès", {
              variant: "success",
              anchorOrigin: { vertical: "top", horizontal: "right" },
            });

            // Rafraîchir la liste
            await fetchCredentials();
          }
        } else {
          // C'est juste un changement de l'option "sensible" depuis la liste
          await patchIsSensitive(verifyModalCred, false);
        }
      }

      // On ferme la modale
      setVerifyModalOpen(false);
      setVerifyModalCred(null);
      setVerifyPurpose("");
      setTypedPassword("");
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 8) Gestion des Tags
  // ---------------------------------------

  const handleAddTag = async (credentialId, tagId) => {
    try {
      const currentCred = credentials.find((c) => c.id === credentialId);
      const apiEndpoint =
        currentCred._source === "e2e"
          ? `https://firekey.theokaszak.fr/api/credentials-e2e/${credentialId}/add_tag/`
          : `https://firekey.theokaszak.fr/api/credentials/${credentialId}/add_tag/`;

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tag_id: tagId }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du tag");
      }

      enqueueSnackbar("Tag ajouté avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Rafraîchir la liste
      await fetchCredentials();
    } catch (error) {
      console.error("Erreur:", error);
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const handleRemoveTag = async (credentialId, tagId) => {
    try {
      const currentCred = credentials.find((c) => c.id === credentialId);
      const apiEndpoint =
        currentCred._source === "e2e"
          ? `https://firekey.theokaszak.fr/api/credentials-e2e/${credentialId}/remove_tag/`
          : `https://firekey.theokaszak.fr/api/credentials/${credentialId}/remove_tag/`;

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tag_id: tagId }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression du tag");
      }

      // Si on filtre actuellement par ce tag, réinitialiser le filtre
      if (activeTagFilter && activeTagFilter.id === tagId) {
        setActiveTagFilter(null);
      }

      enqueueSnackbar("Tag supprimé avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Rafraîchir la liste
      await fetchCredentials();
    } catch (error) {
      console.error("Erreur:", error);
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // Fonction pour gérer les changements de tags dans les formulaires
  const handleNewTagToggle = (tag) => {
    const isSelected = newTags.some((t) => t.id === tag.id);

    if (isSelected) {
      setNewTags((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      setNewTags((prev) => [...prev, tag]);
    }
  };

  const handleEditTagToggle = (tag) => {
    const isSelected = editTags.some((t) => t.id === tag.id);

    if (isSelected) {
      setEditTags((prev) => prev.filter((t) => t.id !== tag.id));
    } else {
      setEditTags((prev) => [...prev, tag]);
    }
  };

  // -----------------------------------------
  // 9) Gestion du générateur de mot de passe
  // -----------------------------------------

  // Callback pour recevoir le mot de passe généré
  const handleSelectNewPassword = (password) => {
    setNewPassword(password);
  };

  const handleSelectEditPassword = (password) => {
    setEditPassword(password);
    setChangePassword(true);
  };

  // Gestion des onglets
  const handleAddTabChange = (event, newValue) => {
    setActiveTabAdd(newValue);
  };

  const handleEditTabChange = (event, newValue) => {
    setActiveTabEdit(newValue);
  };

  // Cleanup des éditions en attente
  useEffect(() => {
    sessionStorage.removeItem("pendingEdit");
  }, []);

  // CORRIGÉ: Fonctions pour les badges E2E
  const renderE2EStatusBadge = () => {
    if (!e2eStatus.e2eAvailable && !e2eStatus.e2eEnabled) {
      return null; // Pas de badge si E2E n'est pas disponible ni activé
    }

    if (e2eStatus.e2eEnabled) {
      const badgeText = e2eStatus.e2eUnlocked
        ? "E2E Activé & Débloqué"
        : "E2E Activé";
      const badgeColor = e2eStatus.e2eUnlocked ? "#4caf50" : "#ff9800";

      return (
        <Chip
          icon={<SecurityIcon />}
          label={badgeText}
          color={e2eStatus.e2eUnlocked ? "success" : "warning"}
          variant="outlined"
          sx={{
            backgroundColor: alpha(badgeColor, 0.1),
            borderColor: badgeColor,
            color: badgeColor,
          }}
        />
      );
    } else if (e2eStatus.e2eAvailable) {
      return (
        <Chip
          icon={<LockIcon />}
          label="E2E Disponible - Cliquez pour activer"
          color="warning"
          variant="outlined"
          onClick={initializeE2E}
          sx={{
            backgroundColor: alpha("#ff9800", 0.1),
            borderColor: "#ff9800",
            color: "#ff9800",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: alpha("#ff9800", 0.15),
            },
          }}
        />
      );
    }

    return null;
  };

  // CORRIGÉ: Condition pour l'option E2E dans le formulaire
  const isE2EOptionEnabled = () => {
    console.log("🔍 Vérification disponibilité E2E:", {
      enabled: e2eStatus.e2eEnabled,
      unlocked: e2eStatus.e2eUnlocked,
      available: e2eStatus.e2eAvailable,
      setupCompleted: e2eStatus.setupCompleted,
      serviceUnlocked: hybridService.isE2EUnlocked(),
      serviceReady:
        hybridService.isE2EReadyForCreation?.() || "méthode non disponible",
    });

    // CORRIGÉ: Vérifier seulement si E2E est activé, pas forcément débloqué
    // Car le déverrouillage peut se faire automatiquement lors de la sauvegarde
    return e2eStatus.e2eEnabled;
  };

  // CORRIGÉ: Description des méthodes de chiffrement
  const getEncryptionMethodDescription = (method) => {
    switch (method) {
      case "auto":
        if (e2eStatus.e2eEnabled) {
          return e2eStatus.e2eUnlocked
            ? "Utilise E2E car il est activé et débloqué"
            : "Utilise E2E (déverrouillage automatique si nécessaire)";
        } else {
          return "Chiffrement côté serveur uniquement";
        }
      case "legacy":
        return "Chiffrement côté serveur avec clé maître";
      case "e2e":
        if (e2eStatus.e2eEnabled) {
          return e2eStatus.e2eUnlocked
            ? "Chiffrement de bout en bout dans votre navigateur"
            : "E2E activé - déverrouillage automatique lors de la sauvegarde";
        } else {
          return "E2E non activé";
        }
      default:
        return "";
    }
  };

  // Fonction de debug pour diagnostiquer l'état E2E
  const debugE2EState = () => {
    console.log("🔍 État E2E Debug:", {
      e2eStatus,
      isE2EUnlocked: hybridService.isE2EUnlocked(),
      isE2EReady:
        hybridService.isE2EReadyForCreation?.() || "méthode non disponible",
    });
  };

  // Exposer la fonction de debug dans window pour pouvoir l'appeler depuis la console
  useEffect(() => {
    window.debugE2E = debugE2EState;
  }, [e2eStatus]);

  // ---------------------------------------
  // Rendu
  // ---------------------------------------
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <Sidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />

        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#ffffff", mb: 1 }}
            >
              Mes Credentials
            </Typography>
            <Typography variant="body1" sx={{ color: "#b0b0b0" }}>
              Gérez et sécurisez vos informations de connexion.
            </Typography>
          </Box>

          {/* Badge de statut E2E */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            {renderE2EStatusBadge()}
            {/* Debug info en mode développement */}
            {process.env.NODE_ENV === "development" && (
              <Chip
                size="small"
                label={`Debug: Available=${e2eStatus.e2eAvailable} Enabled=${e2eStatus.e2eEnabled} Unlocked=${e2eStatus.e2eUnlocked}`}
                sx={{ fontSize: "10px", opacity: 0.7 }}
              />
            )}
          </Box>

          <StyledToolbar>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
              >
                Ajouter
              </StyledButton>

              <Box sx={{ position: "relative" }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterMenuOpen}
                  endIcon={
                    openFilterMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  Filtrer
                </StyledButton>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={openFilterMenu}
                  onClose={handleFilterMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 180,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleFilterChange("all")}
                    sx={{
                      backgroundColor:
                        activeFilter === "all"
                          ? alpha("#90caf9", 0.15)
                          : "transparent",
                      "&:hover": { backgroundColor: alpha("#90caf9", 0.08) },
                    }}
                  >
                    <ListItemText>Tous les credentials</ListItemText>
                    {activeFilter === "all" && (
                      <Chip
                        size="small"
                        label="Actif"
                        color="primary"
                        sx={{ height: 24 }}
                      />
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterChange("sensitive")}
                    sx={{
                      backgroundColor:
                        activeFilter === "sensitive"
                          ? alpha("#90caf9", 0.15)
                          : "transparent",
                      "&:hover": { backgroundColor: alpha("#90caf9", 0.08) },
                    }}
                  >
                    <ListItemIcon>
                      <SecurityIcon
                        fontSize="small"
                        sx={{ color: "#f44336" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Sensibles uniquement</ListItemText>
                    {activeFilter === "sensitive" && (
                      <Chip
                        size="small"
                        label="Actif"
                        color="primary"
                        sx={{ height: 24 }}
                      />
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterChange("normal")}
                    sx={{
                      backgroundColor:
                        activeFilter === "normal"
                          ? alpha("#90caf9", 0.15)
                          : "transparent",
                      "&:hover": { backgroundColor: alpha("#90caf9", 0.08) },
                    }}
                  >
                    <ListItemIcon>
                      <LockIcon fontSize="small" sx={{ color: "#4caf50" }} />
                    </ListItemIcon>
                    <ListItemText>Standards uniquement</ListItemText>
                    {activeFilter === "normal" && (
                      <Chip
                        size="small"
                        label="Actif"
                        color="primary"
                        sx={{ height: 24 }}
                      />
                    )}
                  </MenuItem>
                </Menu>
              </Box>

              <Box sx={{ position: "relative" }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  startIcon={<SortIcon />}
                  onClick={handleSortMenuOpen}
                  endIcon={
                    openSortMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  Trier
                </StyledButton>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={openSortMenu}
                  onClose={handleSortMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 200,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleSort("name-asc")}>
                    <ListItemText>Nom (A à Z)</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleSort("name-desc")}>
                    <ListItemText>Nom (Z à A)</ListItemText>
                  </MenuItem>
                  <Divider
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  />
                  <MenuItem onClick={() => handleSort("date-newest")}>
                    <ListItemText>Plus récents en premier</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleSort("date-oldest")}>
                    <ListItemText>Plus anciens en premier</ListItemText>
                  </MenuItem>
                  <Divider
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  />
                  <MenuItem onClick={() => handleSort("strength-strongest")}>
                    <ListItemIcon>
                      <SecurityIcon
                        fontSize="small"
                        sx={{ color: "#4caf50" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Plus sécurisés en premier</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleSort("strength-weakest")}>
                    <ListItemIcon>
                      <SecurityIcon
                        fontSize="small"
                        sx={{ color: "#f44336" }}
                      />
                    </ListItemIcon>
                    <ListItemText>Moins sécurisés en premier</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>

              <Box sx={{ position: "relative" }}>
                <Badge
                  badgeContent={tags.length}
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -3,
                      top: 3,
                    },
                  }}
                >
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    startIcon={<LocalOfferIcon />}
                    onClick={handleTagMenuOpen}
                    endIcon={
                      openTagMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                  >
                    Tags
                  </StyledButton>
                </Badge>
                <Menu
                  anchorEl={tagAnchorEl}
                  open={openTagMenu}
                  onClose={handleTagMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 240,
                      maxHeight: 350,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleTagFilterChange(null)}
                    sx={{
                      backgroundColor: !activeTagFilter
                        ? alpha("#90caf9", 0.15)
                        : "transparent",
                      "&:hover": { backgroundColor: alpha("#90caf9", 0.08) },
                    }}
                  >
                    <ListItemText>Tous les credentials</ListItemText>
                    {!activeTagFilter && (
                      <Chip
                        size="small"
                        label="Actif"
                        color="primary"
                        sx={{ height: 24 }}
                      />
                    )}
                  </MenuItem>

                  <Divider
                    sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  />

                  {tags.length === 0 ? (
                    <MenuItem disabled>
                      <ListItemText>Aucun tag disponible</ListItemText>
                    </MenuItem>
                  ) : (
                    tags.map((tag) => (
                      <MenuItem
                        key={tag.id}
                        onClick={() => handleTagFilterChange(tag)}
                        sx={{
                          backgroundColor:
                            activeTagFilter?.id === tag.id
                              ? alpha(tag.color, 0.15)
                              : "transparent",
                          "&:hover": {
                            backgroundColor: alpha(tag.color, 0.08),
                          },
                        }}
                      >
                        <ListItemIcon>
                          <LocalOfferIcon sx={{ color: tag.color }} />
                        </ListItemIcon>
                        <ListItemText>
                          {tag.name}
                          <Typography
                            variant="caption"
                            sx={{ ml: 1, color: "#b0b0b0" }}
                          >
                            ({tag.credential_count})
                          </Typography>
                        </ListItemText>
                        {activeTagFilter?.id === tag.id && (
                          <Chip
                            size="small"
                            label="Actif"
                            sx={{
                              height: 24,
                              backgroundColor: alpha(tag.color, 0.2),
                              color: tag.color,
                            }}
                          />
                        )}
                      </MenuItem>
                    ))
                  )}

                  <Divider
                    sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                  />

                  <MenuItem onClick={openTagsManager} sx={{ color: "#90caf9" }}>
                    <ListItemIcon>
                      <AddIcon sx={{ color: "#90caf9" }} />
                    </ListItemIcon>
                    <ListItemText>Gérer les tags</ListItemText>
                  </MenuItem>
                </Menu>
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
                    <SearchIcon sx={{ color: "#b0b0b0" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: "300px" } }}
            />
          </StyledToolbar>

          {/* Affichage du filtre actif s'il y en a un */}
          {(activeFilter !== "all" || activeTagFilter) && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mr: 1 }}>
                Filtres actifs:
              </Typography>
              {activeFilter !== "all" && (
                <Chip
                  label={
                    activeFilter === "sensitive"
                      ? "Credentials sensibles"
                      : "Credentials standards"
                  }
                  color="primary"
                  onDelete={() => setActiveFilter("all")}
                  size="small"
                  sx={{ borderRadius: "4px", mr: 1 }}
                />
              )}
              {activeTagFilter && (
                <Chip
                  label={activeTagFilter.name}
                  onDelete={() => setActiveTagFilter(null)}
                  size="small"
                  sx={{
                    borderRadius: "4px",
                    backgroundColor: alpha(activeTagFilter.color, 0.2),
                    color: activeTagFilter.color,
                  }}
                />
              )}
            </Box>
          )}

          {/* État vide - aucun credential */}
          {credentials.length === 0 && (
            <Fade in={true}>
              <EmptyStateContainer>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 3,
                    bgcolor: alpha("#90caf9", 0.2),
                  }}
                >
                  <LockIcon sx={{ fontSize: 40, color: "#90caf9" }} />
                </Avatar>
                <Typography
                  variant="h5"
                  sx={{ color: "#ffffff", mb: 2, fontWeight: 500 }}
                >
                  Aucun credential enregistré
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#b0b0b0", mb: 4, maxWidth: 500 }}
                >
                  Commencez à sécuriser vos mots de passe en ajoutant votre
                  premier credential. Tous vos mots de passe seront chiffrés et
                  protégés.
                </Typography>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                >
                  Ajouter mon premier credential
                </StyledButton>
              </EmptyStateContainer>
            </Fade>
          )}

          {/* Résultats de recherche vides */}
          {credentials.length > 0 && filteredCredentials.length === 0 && (
            <Fade in={true}>
              <EmptyStateContainer>
                <SearchIcon sx={{ fontSize: 40, color: "#90caf9", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#ffffff", mb: 1 }}>
                  Aucun résultat trouvé
                </Typography>
                <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
                  Essayez d'autres termes de recherche ou modifiez vos filtres.
                </Typography>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                    setActiveTagFilter(null);
                  }}
                >
                  Réinitialiser les filtres
                </StyledButton>
              </EmptyStateContainer>
            </Fade>
          )}

          {/* Liste de credentials */}
          {filteredCredentials.length > 0 && (
            <Grid container spacing={3}>
              {filteredCredentials.map((cred) => (
                <Grid item xs={12} key={cred.id}>
                  <Fade in={true} timeout={300}>
                    <StyledCard>
                      <CredentialItem
                        cred={cred}
                        onTogglePassword={handleTogglePassword}
                        onEdit={handleOpenEditModal}
                        onDelete={handleOpenDeleteModal}
                        onSensitiveChange={handleSensitiveChange}
                        onTagAdd={handleAddTag}
                        onTagRemove={handleRemoveTag}
                        availableTags={tags}
                      />
                    </StyledCard>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Statistiques */}
          {credentials.length > 0 && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {filteredCredentials.length} credential
                {filteredCredentials.length > 1 ? "s" : ""} affiché
                {filteredCredentials.length > 1 ? "s" : ""}
                {activeFilter !== "all" || activeTagFilter || searchQuery
                  ? ` sur ${credentials.length} total`
                  : ""}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Dialog d'ajout avec choix de méthode de chiffrement */}
      <StyledDialog
        open={addModalOpen}
        onClose={handleCloseAddModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ajouter un Credential</DialogTitle>
        <DialogContent>
          <StyledTabs
            value={activeTabAdd}
            onChange={handleAddTabChange}
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<LockIcon />}
              iconPosition="start"
              label="Informations"
              id="add-tab-0"
              aria-controls="add-tabpanel-0"
            />
            <Tab
              icon={<KeyIcon />}
              iconPosition="start"
              label="Générateur de mot de passe"
              id="add-tab-1"
              aria-controls="add-tabpanel-1"
            />
          </StyledTabs>

          {/* Panneau Informations */}
          <Box
            role="tabpanel"
            hidden={activeTabAdd !== 0}
            id="add-tabpanel-0"
            aria-labelledby="add-tab-0"
          >
            {activeTabAdd === 0 && (
              <>
                {/* Choix de la méthode de chiffrement */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", mb: 2, fontWeight: 500 }}
                  >
                    Méthode de chiffrement
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Option Auto */}
                    <Grid item xs={12} md={4}>
                      <EncryptionMethodCard
                        selected={encryptionMethod === "auto"}
                        onClick={() => setEncryptionMethod("auto")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Radio
                            checked={encryptionMethod === "auto"}
                            onChange={() => setEncryptionMethod("auto")}
                            sx={{ color: "#90caf9", mr: 1 }}
                          />
                          <ShieldIcon sx={{ color: "#90caf9", mr: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Automatique
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                          {getEncryptionMethodDescription("auto")}
                        </Typography>
                      </EncryptionMethodCard>
                    </Grid>

                    {/* Option Legacy */}
                    <Grid item xs={12} md={4}>
                      <EncryptionMethodCard
                        selected={encryptionMethod === "legacy"}
                        onClick={() => setEncryptionMethod("legacy")}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Radio
                            checked={encryptionMethod === "legacy"}
                            onChange={() => setEncryptionMethod("legacy")}
                            sx={{ color: "#90caf9", mr: 1 }}
                          />
                          <CloudIcon sx={{ color: "#ff9800", mr: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Serveur
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                          {getEncryptionMethodDescription("legacy")}
                        </Typography>
                      </EncryptionMethodCard>
                    </Grid>

                    {/* Option E2E */}
                    <Grid item xs={12} md={4}>
                      <EncryptionMethodCard
                        selected={encryptionMethod === "e2e"}
                        onClick={() =>
                          isE2EOptionEnabled() && setEncryptionMethod("e2e")
                        }
                        sx={{
                          opacity: isE2EOptionEnabled() ? 1 : 0.5,
                          cursor: isE2EOptionEnabled()
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Radio
                            checked={encryptionMethod === "e2e"}
                            onChange={() =>
                              isE2EOptionEnabled() && setEncryptionMethod("e2e")
                            }
                            disabled={!isE2EOptionEnabled()}
                            sx={{ color: "#90caf9", mr: 1 }}
                          />
                          <SecurityIcon sx={{ color: "#4caf50", mr: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            E2E
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                          {getEncryptionMethodDescription("e2e")}
                        </Typography>
                      </EncryptionMethodCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* Alerte informative */}
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    backgroundColor: "rgba(41, 182, 246, 0.1)",
                    color: "#29b6f6",
                    "& .MuiAlert-icon": {
                      color: "#29b6f6",
                    },
                  }}
                >
                  {encryptionMethod === "e2e" && isE2EOptionEnabled() && (
                    <>
                      Chiffrement de bout en bout activé - Vos données sont
                      chiffrées localement.
                      <Box
                        sx={{ mt: 1, display: "flex", alignItems: "center" }}
                      >
                        <SecurityIcon
                          sx={{ fontSize: 16, mr: 0.5, color: "#4caf50" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#4caf50", fontWeight: 500 }}
                        >
                          Mode E2E sélectionné
                        </Typography>
                      </Box>
                    </>
                  )}
                  {encryptionMethod === "legacy" &&
                    "Chiffrement côté serveur - Vos données sont sécurisées par notre infrastructure."}
                  {encryptionMethod === "auto" &&
                    (e2eStatus.e2eEnabled && e2eStatus.e2eUnlocked
                      ? "Mode automatique - E2E sera utilisé car il est activé et débloqué."
                      : "Mode automatique - Chiffrement serveur sera utilisé.")}
                </Alert>

                {/* Formulaire */}
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />
                <TextField
                  label="Site web"
                  variant="outlined"
                  fullWidth
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />
                <TextField
                  label="Mot de passe"
                  variant="outlined"
                  type={showNewPassword ? "text" : "password"}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          sx={{ color: "#b0b0b0" }}
                        >
                          {showNewPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />

                {/* Sélecteur de tags */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                    Tags (optionnel)
                  </Typography>
                  <TagSelector
                    selectedTags={newTags}
                    availableTags={tags}
                    onTagToggle={handleNewTagToggle}
                  />
                </Box>

                <TextField
                  label="Note"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newIsSensitive}
                      onChange={(e) => setNewIsSensitive(e.target.checked)}
                      sx={{
                        color: "#b0b0b0",
                        "&.Mui-checked": { color: "#90caf9" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Marquer comme sensible
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                        Exige une vérification supplémentaire pour afficher le
                        mot de passe
                      </Typography>
                    </Box>
                  }
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    onClick={() => setActiveTabAdd(1)}
                    startIcon={<KeyIcon />}
                  >
                    Ouvrir le générateur de mot de passe
                  </StyledButton>
                </Box>
              </>
            )}
          </Box>

          {/* Panneau Générateur de mot de passe */}
          <Box
            role="tabpanel"
            hidden={activeTabAdd !== 1}
            id="add-tabpanel-1"
            aria-labelledby="add-tab-1"
          >
            {activeTabAdd === 1 && (
              <PasswordGenerator
                onSelectPassword={handleSelectNewPassword}
                initialPassword={newPassword}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseAddModal} color="inherit">
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSaveCredential}
          >
            Enregistrer
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog d'édition */}
      <StyledDialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Modifier un Credential</DialogTitle>
        <DialogContent>
          <StyledTabs
            value={activeTabEdit}
            onChange={handleEditTabChange}
            sx={{ mb: 3, mt: 1 }}
          >
            <Tab
              icon={<TuneIcon />}
              iconPosition="start"
              label="Informations"
              id="edit-tab-0"
              aria-controls="edit-tabpanel-0"
            />
            <Tab
              icon={<KeyIcon />}
              iconPosition="start"
              label="Générateur de mot de passe"
              id="edit-tab-1"
              aria-controls="edit-tabpanel-1"
            />
          </StyledTabs>

          {/* Panneau Informations */}
          <Box
            role="tabpanel"
            hidden={activeTabEdit !== 0}
            id="edit-tabpanel-0"
            aria-labelledby="edit-tab-0"
          >
            {activeTabEdit === 0 && (
              <>
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />
                <TextField
                  label="Site web"
                  variant="outlined"
                  fullWidth
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 3 }}
                />

                {/* Section de modification du mot de passe */}
                <Box sx={{ mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        sx={{
                          color: "#b0b0b0",
                          "&.Mui-checked": { color: "#90caf9" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Modifier le mot de passe
                      </Typography>
                    }
                  />

                  {changePassword && (
                    <Fade in={changePassword}>
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Nouveau mot de passe"
                          variant="outlined"
                          type={showEditPassword ? "text" : "password"}
                          fullWidth
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() =>
                                    setShowEditPassword(!showEditPassword)
                                  }
                                  edge="end"
                                  sx={{ color: "#b0b0b0" }}
                                >
                                  {showEditPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ ...textFieldStyle }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                          }}
                        >
                          <StyledButton
                            variant="outlined"
                            color="primary"
                            onClick={() => setActiveTabEdit(1)}
                            startIcon={<KeyIcon />}
                            size="small"
                          >
                            Ouvrir le générateur de mot de passe
                          </StyledButton>
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </Box>

                {/* Sélecteur de tags */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
                    Tags (optionnel)
                  </Typography>
                  <TagSelector
                    selectedTags={editTags}
                    availableTags={tags}
                    onTagToggle={handleEditTagToggle}
                  />
                </Box>

                <TextField
                  label="Note"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  sx={{ ...textFieldStyle, mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editIsSensitive}
                      onChange={(e) => setEditIsSensitive(e.target.checked)}
                      sx={{
                        color: "#b0b0b0",
                        "&.Mui-checked": { color: "#90caf9" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Marquer comme sensible
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                        Exige une vérification supplémentaire pour afficher le
                        mot de passe
                      </Typography>
                    </Box>
                  }
                />
              </>
            )}
          </Box>

          {/* Panneau Générateur de mot de passe */}
          <Box
            role="tabpanel"
            hidden={activeTabEdit !== 1}
            id="edit-tabpanel-1"
            aria-labelledby="edit-tab-1"
          >
            {activeTabEdit === 1 && (
              <PasswordGenerator
                onSelectPassword={handleSelectEditPassword}
                initialPassword={editPassword}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseEditModal} color="inherit">
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
          >
            Enregistrer
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog de vérification de mot de passe */}
      <StyledDialog
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Vérification de sécurité</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              mt: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(33, 150, 243, 0.1)",
                mb: 2,
                width: 60,
                height: 60,
              }}
            >
              <LockIcon sx={{ color: "#2196f3", fontSize: 30 }} />
            </Avatar>
            <Typography
              variant="body1"
              sx={{
                color: "#ffffff",
                fontWeight: 500,
                mb: 1,
                textAlign: "center",
              }}
            >
              {verifyPurpose === "unlock"
                ? "Veuillez confirmer votre mot de passe"
                : "Confirmation requise"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", textAlign: "center" }}
            >
              {verifyPurpose === "unlock"
                ? "Ce credential est marqué comme sensible et nécessite une vérification supplémentaire."
                : "Pour désactiver la protection supplémentaire, veuillez confirmer votre mot de passe."}
            </Typography>
          </Box>

          <TextField
            label="Mot de passe"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={typedPassword}
            onChange={(e) => setTypedPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "#b0b0b0" }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={textFieldStyle}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton
            onClick={() => setVerifyModalOpen(false)}
            color="inherit"
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleVerifyPassword}
          >
            Confirmer
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog de confirmation de suppression */}
      <StyledDialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Supprimer ce credential</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "#e0e0e0", mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer le credential{" "}
            <strong>{deleteName}</strong> ?
          </Typography>
          <Alert
            severity="warning"
            sx={{
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              color: "#ff5252",
              "& .MuiAlert-icon": {
                color: "#ff5252",
              },
            }}
          >
            Cette action est irréversible. Toutes les données associées seront
            définitivement perdues.
          </Alert>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseDeleteModal} color="inherit">
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleConfirmDelete}
          >
            Supprimer
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* Modal d'activation E2E */}
      <E2ESetupModal
        open={e2eSetupOpen}
        onClose={() => setE2eSetupOpen(false)}
        onSuccess={handleE2EActivationSuccess}
      />

      {/* Gestionnaire de tags */}
      <TagsManager
        open={tagsManagerOpen}
        onClose={() => setTagsManagerOpen(false)}
        onTagsChange={fetchTags}
      />
    </Box>
  );
}
