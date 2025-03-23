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
} from "@mui/material";
import { useSnackbar } from "notistack";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CredentialItem from "../components/Credentials/CredentialItem";
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
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function Credentials() {
  const drawerWidth = 240;
  const { enqueueSnackbar } = useSnackbar();
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'sensitive', 'normal'
  const accessToken = localStorage.getItem("accessToken") || "";

  // États pour les menus
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const openFilterMenu = Boolean(filterAnchorEl);
  const openSortMenu = Boolean(sortAnchorEl);

  // States pour la vérification du mot de passe
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
  const [showNewPassword, setShowNewPassword] = useState(false);

  // States pour l'édition d'un credential
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editIsSensitive, setEditIsSensitive] = useState(false);

  // States pour la suppression d'un credential
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  // Chargement initial
  useEffect(() => {
    fetchCredentials();
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

    // Appliquer la recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (cred) =>
          cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cred.website &&
            cred.website.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (cred.email &&
            cred.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCredentials(filtered);
  }, [searchQuery, credentials, activeFilter]);

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

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    handleFilterMenuClose();
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
    }

    setCredentials(sortedCreds);
    handleSortMenuClose();
  };

  // ---------------------------------------
  // 1) Récupérer la liste
  // ---------------------------------------
  const fetchCredentials = async () => {
    try {
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
      const data = await res.json();
      setCredentials(data);
      setFilteredCredentials(data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Impossible de récupérer la liste des credentials", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  // ---------------------------------------
  // 2) Ajout d'un credential
  // ---------------------------------------
  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setNewName("");
    setNewWebsite("");
    setNewEmail("");
    setNewPassword("");
    setNewNote("");
    setNewIsSensitive(false);
    setShowNewPassword(false);
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
    // IMPORTANT: utiliser la propriété is_sensitive
    setEditIsSensitive(cred.is_sensitive);
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
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      enqueueSnackbar("Le champ Nom est requis", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }
    try {
      const body = {
        name: editName.trim(),
        website: editWebsite.trim(),
        email: editEmail.trim(),
        note: editNote.trim(),
        // IMPORTANT: is_sensitive, pas isSensitive
        is_sensitive: editIsSensitive,
      };
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
      const updated = await res.json();
      setCredentials((prev) =>
        prev.map((c) => (c.id === editId ? updated : c))
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
        // On PATCH is_sensitive = false
        await patchIsSensitive(verifyModalCred, false);
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
          {activeFilter !== "all" && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mr: 1 }}>
                Filtre actif:
              </Typography>
              <Chip
                label={
                  activeFilter === "sensitive"
                    ? "Credentials sensibles"
                    : "Credentials standards"
                }
                color="primary"
                onDelete={() => setActiveFilter("all")}
                size="small"
                sx={{ borderRadius: "4px" }}
              />
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
                {activeFilter !== "all" || searchQuery
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ajouter un Credential</DialogTitle>
        <DialogContent>
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
                  Exige une vérification supplémentaire pour afficher le mot de
                  passe
                </Typography>
              </Box>
            }
          />
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modifier un Credential</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ ...textFieldStyle, mb: 3, mt: 2 }}
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
                  Exige une vérification supplémentaire pour afficher le mot de
                  passe
                </Typography>
              </Box>
            }
          />
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

      {/* Dialog de confirmation de suppression */}
      <StyledDialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Supprimer ce credential ?</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(244, 67, 54, 0.1)",
                mb: 2,
                width: 60,
                height: 60,
              }}
            >
              <DeleteIcon sx={{ color: "#f44336", fontSize: 30 }} />
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
              Êtes-vous sûr de vouloir supprimer « {deleteName} » ?
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", textAlign: "center" }}
            >
              Cette action est irréversible et toutes les données associées
              seront définitivement effacées.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseDeleteModal} color="inherit">
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Supprimer
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
    </Box>
  );
}
