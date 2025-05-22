// src/pages/Credentials.jsx
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
} from "@mui/material";

import { useSnackbar } from "notistack";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CredentialItem from "../components/Credentials/CredentialItem";
import PasswordGenerator from "../components/Credentials/PasswordGenerator";
import TagsManager from "../components/Credentials/TagsManager";
import TagSelector from "../components/Credentials/TagSelector";
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

  // Chargement initial
  useEffect(() => {
    fetchCredentials();
    fetchTags();
  }, []);

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
  // 1) Récupérer les données
  // ---------------------------------------
  const fetchCredentials = async () => {
    try {
      // Récupérer les credentials
      const res = await fetch("http://localhost:8001/api/credentials/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur fetch credentials");
      }

      const credentialsData = await res.json();

      // Récupérer les données de sécurité pour obtenir la force des mots de passe
      try {
        const securityRes = await fetch(
          "http://localhost:8001/api/security/dashboard/",
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

          // Créer une map des forces de mot de passe par ID
          const strengthMap = {};
          if (securityData.recent_credentials) {
            securityData.recent_credentials.forEach((cred) => {
              strengthMap[cred.id] = {
                strength: cred.strength,
                score: cred.score,
              };
            });
          }

          // Enrichir les credentials avec les données de force
          const enrichedCredentials = credentialsData.map((cred) => ({
            ...cred,
            strength: strengthMap[cred.id]?.strength || "medium",
            score: strengthMap[cred.id]?.score || 50,
          }));

          setCredentials(enrichedCredentials);
          setFilteredCredentials(enrichedCredentials);
        } else {
          // Si l'API de sécurité échoue, utiliser les credentials sans enrichissement
          setCredentials(credentialsData);
          setFilteredCredentials(credentialsData);
        }
      } catch (securityErr) {
        console.error(
          "Erreur lors de la récupération des données de sécurité:",
          securityErr
        );
        // Utiliser les credentials sans enrichissement
        setCredentials(credentialsData);
        setFilteredCredentials(credentialsData);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Impossible de récupérer la liste des credentials", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/tags/", {
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
  // 2) Ajout d'un credential
  // ---------------------------------------
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
    setActiveTabAdd(0);
    setNewTags([]);
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
  };

  const handleSaveCredential = async () => {
    if (!newName.trim()) {
      enqueueSnackbar("Le champ Nom est requis", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    try {
      const body = {
        name: newName.trim(),
        website: newWebsite.trim(),
        email: newEmail.trim(),
        password: newPassword || "password123",
        note: newNote.trim(),
        is_sensitive: newIsSensitive,
        tag_ids: newTags.map((tag) => tag.id),
      };
      const res = await fetch("http://localhost:8001/api/credentials/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur ajout credential");
      }
      const newCred = await res.json();
      setCredentials((prev) => [...prev, newCred]);
      enqueueSnackbar("Credential ajouté avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      handleCloseAddModal();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 3) Édition d'un credential
  // ---------------------------------------
  const handleOpenEditModal = (cred) => {
    setEditId(cred.id);
    setEditName(cred.name);
    setEditWebsite(cred.website || "");
    setEditEmail(cred.email || "");
    setEditNote(cred.note || "");
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

      const res = await fetch(
        `http://localhost:8001/api/credentials/${editId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur edition credential");
      }

      // Afficher la réponse pour debug
      const responseText = await res.text();

      let updated = {};
      try {
        updated = JSON.parse(responseText);
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
      }

      setCredentials((prev) =>
        prev.map((c) => (c.id === editId ? { ...updated, unlocked: false } : c))
      );

      enqueueSnackbar("Credential modifié avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 4) Suppression d'un credential
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
      const res = await fetch(
        `http://localhost:8001/api/credentials/${deleteId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur suppression credential");
      }
      setCredentials((prev) => prev.filter((c) => c.id !== deleteId));
      enqueueSnackbar("Credential supprimé avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      handleCloseDeleteModal();
    } catch (err) {
      console.error(err);
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
      const res = await fetch(
        `http://localhost:8001/api/credentials/${cred.id}/decrypt/`,
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
      const res = await fetch(
        `http://localhost:8001/api/credentials/${cred.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erreur maj "sensible"');
      }
      const updated = await res.json();
      setCredentials((prev) =>
        prev.map((c) => (c.id === cred.id ? updated : c))
      );
      enqueueSnackbar("Modification enregistrée", {
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
  // 7) Vérification du mot de passe de compte
  // ---------------------------------------

  const handleVerifyPassword = async () => {
    if (!verifyModalCred) return;

    try {
      // 1) Vérifier le mot de passe de compte
      const verifyRes = await fetch(
        `http://localhost:8001/api/credentials/${verifyModalCred.id}/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password: typedPassword }),
        }
      );
      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error || "Erreur de vérification");
      }

      // 2) Selon le but (unlock ou disableSensitive)
      if (verifyPurpose === "unlock") {
        // On appelle decrypt
        const decryptRes = await fetch(
          `http://localhost:8001/api/credentials/${verifyModalCred.id}/decrypt/`,
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
      } else if (verifyPurpose === "disableSensitive") {
        // Vérifier si c'est une modification en attente depuis l'édition
        const pendingEditStr = sessionStorage.getItem("pendingEdit");

        if (pendingEditStr) {
          // C'est une édition complète qui a été interrompue pour vérifier le mot de passe
          const pendingEdit = JSON.parse(pendingEditStr);

          // Effectuer la mise à jour avec toutes les données d'édition
          const res = await fetch(
            `http://localhost:8001/api/credentials/${pendingEdit.id}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(pendingEdit),
            }
          );

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Erreur edition credential");
          }

          const updated = await res.json();
          setCredentials((prev) =>
            prev.map((c) => (c.id === pendingEdit.id ? updated : c))
          );

          // Supprimer les données d'édition en attente
          sessionStorage.removeItem("pendingEdit");

          enqueueSnackbar("Credential modifié avec succès", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
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
      const res = await fetch(
        `http://localhost:8001/api/credentials/${credentialId}/add_tag/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ tag_id: tagId }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du tag");
      }

      const updatedCred = await res.json();

      // Mettre à jour l'état local
      setCredentials((prev) =>
        prev.map((cred) => (cred.id === credentialId ? updatedCred : cred))
      );

      enqueueSnackbar("Tag ajouté avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
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
      const res = await fetch(
        `http://localhost:8001/api/credentials/${credentialId}/remove_tag/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ tag_id: tagId }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression du tag");
      }

      const updatedCred = await res.json();

      // Mettre à jour l'état local
      setCredentials((prev) =>
        prev.map((cred) => (cred.id === credentialId ? updatedCred : cred))
      );

      // Si on filtre actuellement par ce tag, réinitialiser le filtre
      if (activeTagFilter && activeTagFilter.id === tagId) {
        setActiveTagFilter(null);
      }

      enqueueSnackbar("Tag supprimé avec succès", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
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
    fetchCredentials();
  }, []);

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

      {/* Dialog d'ajout */}
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
                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    mt: 2,
                    backgroundColor: "rgba(41, 182, 246, 0.1)",
                    color: "#29b6f6",
                    "& .MuiAlert-icon": {
                      color: "#29b6f6",
                    },
                  }}
                >
                  Toutes vos informations sont chiffrées côté serveur avec des
                  standards de sécurité élevés.
                </Alert>

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

      {/* Gestionnaire de tags */}
      <TagsManager
        open={tagsManagerOpen}
        onClose={() => setTagsManagerOpen(false)}
        onTagsChange={fetchTags}
      />
    </Box>
  );
}
