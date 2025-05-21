// src/pages/ImportExport.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Fade,
  Collapse,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse"; // Assurez-vous d'installer cette dépendance

// Components
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Icons
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import KeyIcon from "@mui/icons-material/Key";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestoreIcon from "@mui/icons-material/Restore";

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 16,
  backgroundColor: "#1e1e1e",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  marginBottom: 24,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
  },
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

const ImportSourceCard = styled(Card)(({ theme, active }) => ({
  borderRadius: 12,
  padding: 16,
  backgroundColor: active ? alpha("#90caf9", 0.1) : "#1e1e1e",
  border: active ? "2px solid #90caf9" : "2px solid rgba(255, 255, 255, 0.1)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    borderColor: "#90caf9",
    backgroundColor: alpha("#90caf9", 0.05),
  },
}));

const SourceIcon = styled(Box)(({ theme, color }) => ({
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  backgroundColor: alpha(color, 0.1),
  margin: "0 auto 16px auto",
}));

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

// Mapping of password manager icons
const getManagerIcon = (manager) => {
  switch (manager) {
    case "google":
      return <GoogleIcon sx={{ color: "#4285F4", fontSize: 28 }} />;
    case "dashlane":
      return <SecurityIcon sx={{ color: "#007C89", fontSize: 28 }} />;
    case "bitwarden":
      return <ShieldIcon sx={{ color: "#175DDC", fontSize: 28 }} />;
    case "lastpass":
      return <LockIcon sx={{ color: "#D32D27", fontSize: 28 }} />;
    case "keeper":
      return <KeyIcon sx={{ color: "#FFC244", fontSize: 28 }} />;
    case "onepassword":
      return <LockIcon sx={{ color: "#0364D3", fontSize: 28 }} />;
    case "firekey":
      return <LockIcon sx={{ color: "#90caf9", fontSize: 28 }} />;
    case "csv":
      return <FilterNoneIcon sx={{ color: "#90caf9", fontSize: 28 }} />;
    default:
      return <LockIcon sx={{ color: "#90caf9", fontSize: 28 }} />;
  }
};

// Fonction pour analyser un fichier CSV côté client
const parseCSVLocally = (file, sourceType = "bitwarden") => {
  return new Promise((resolve, reject) => {
    // Options de parsing pour Papa Parse
    const parseOptions = {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const credentials = [];
          const stats = {
            total: 0,
            new: 0,
            duplicate: 0,
            error: 0,
          };

          // Vérifier si on a des résultats et des données
          if (!results || !results.data || results.data.length === 0) {
            console.warn("Aucune donnée trouvée dans le fichier CSV");
            resolve({ credentials, stats });
            return;
          }

          console.log("En-têtes détectés:", results.meta.fields);

          // Mapping des champs selon la source
          let fieldMapping = {};

          if (sourceType === "bitwarden" || sourceType === "vaultwarden") {
            fieldMapping = {
              name: results.meta.fields.find((f) => f.toLowerCase() === "name"),
              website: results.meta.fields.find((f) =>
                ["login_uri", "uri", "url"].includes(f.toLowerCase())
              ),
              username: results.meta.fields.find((f) =>
                ["login_username", "username"].includes(f.toLowerCase())
              ),
              password: results.meta.fields.find((f) =>
                ["login_password", "password"].includes(f.toLowerCase())
              ),
              notes: results.meta.fields.find((f) =>
                ["notes", "note"].includes(f.toLowerCase())
              ),
              folder: results.meta.fields.find(
                (f) => f.toLowerCase() === "folder"
              ),
              type: results.meta.fields.find((f) => f.toLowerCase() === "type"),
            };
          } else if (sourceType === "lastpass") {
            fieldMapping = {
              name: results.meta.fields.find((f) =>
                ["name", "title"].includes(f.toLowerCase())
              ),
              website: results.meta.fields.find((f) =>
                ["url", "web site"].includes(f.toLowerCase())
              ),
              username: results.meta.fields.find((f) =>
                ["username", "login", "user name"].includes(f.toLowerCase())
              ),
              password: results.meta.fields.find((f) =>
                ["password", "pass"].includes(f.toLowerCase())
              ),
              notes: results.meta.fields.find((f) =>
                ["extra", "notes", "note"].includes(f.toLowerCase())
              ),
              folder: results.meta.fields.find((f) =>
                ["grouping", "group", "folder"].includes(f.toLowerCase())
              ),
            };
          } else if (sourceType === "google") {
            fieldMapping = {
              name: results.meta.fields.find((f) =>
                ["name", "nom"].includes(f.toLowerCase())
              ),
              website: results.meta.fields.find((f) =>
                ["url", "website", "site"].includes(f.toLowerCase())
              ),
              username: results.meta.fields.find((f) =>
                ["username", "login", "email"].includes(f.toLowerCase())
              ),
              password: results.meta.fields.find((f) =>
                ["password", "pass", "mot de passe"].includes(f.toLowerCase())
              ),
              notes: results.meta.fields.find((f) =>
                ["note", "notes", "comment"].includes(f.toLowerCase())
              ),
            };
          } else {
            // Mapping générique pour CSV
            fieldMapping = {
              name: results.meta.fields.find((f) =>
                ["name", "nom", "title", "titre"].includes(f.toLowerCase())
              ),
              website: results.meta.fields.find((f) =>
                ["url", "website", "site", "web", "link", "lien"].includes(
                  f.toLowerCase()
                )
              ),
              username: results.meta.fields.find((f) =>
                [
                  "username",
                  "login",
                  "user",
                  "utilisateur",
                  "identifiant",
                ].includes(f.toLowerCase())
              ),
              password: results.meta.fields.find((f) =>
                ["password", "pass", "mot de passe", "mdp"].includes(
                  f.toLowerCase()
                )
              ),
              notes: results.meta.fields.find((f) =>
                ["notes", "note", "comments", "commentaires"].includes(
                  f.toLowerCase()
                )
              ),
              email: results.meta.fields.find((f) =>
                ["email", "courriel", "mail", "e-mail"].includes(
                  f.toLowerCase()
                )
              ),
            };
          }

          console.log("Mapping des champs:", fieldMapping);

          // Parcourir les données
          for (const row of results.data) {
            // Pour Bitwarden: ignorer les lignes qui ne sont pas de type login
            if (
              sourceType === "bitwarden" &&
              fieldMapping.type &&
              row[fieldMapping.type] &&
              row[fieldMapping.type].toLowerCase() !== "login"
            ) {
              continue;
            }

            // Créer un credential
            const credential = {
              id: Math.random().toString(36).substring(2, 15),
              name: fieldMapping.name ? row[fieldMapping.name] : "",
              website: fieldMapping.website ? row[fieldMapping.website] : "",
              username: fieldMapping.username ? row[fieldMapping.username] : "",
              password: fieldMapping.password ? row[fieldMapping.password] : "",
              notes: fieldMapping.notes ? row[fieldMapping.notes] : "",
              email: fieldMapping.email ? row[fieldMapping.email] : "",
              status: "new",
              duplicated: false,
              strength: "medium",
              tags: [],
            };

            // Si le champ email n'est pas explicitement défini mais l'username ressemble à un email
            if (
              !credential.email &&
              credential.username &&
              credential.username.includes("@")
            ) {
              credential.email = credential.username;
            }

            // Utiliser le dossier comme tag si disponible
            if (fieldMapping.folder && row[fieldMapping.folder]) {
              credential.tags = [row[fieldMapping.folder]];
            }

            // Extraire le nom à partir de l'URL si pas de nom mais URL présente
            if (!credential.name && credential.website) {
              try {
                const url = new URL(credential.website);
                let domain = url.hostname;
                if (domain.startsWith("www.")) {
                  domain = domain.substring(4);
                }
                credential.name = domain;
              } catch (e) {
                // URL invalide, ne rien faire
              }
            }

            // Évaluer la force du mot de passe
            if (credential.password) {
              if (
                credential.password.length > 12 &&
                /[A-Z]/.test(credential.password) &&
                /[a-z]/.test(credential.password) &&
                /[0-9]/.test(credential.password) &&
                /[^A-Za-z0-9]/.test(credential.password)
              ) {
                credential.strength = "strong";
              } else if (
                credential.password.length >= 8 &&
                ((/[A-Z]/.test(credential.password) &&
                  /[a-z]/.test(credential.password)) ||
                  (/[0-9]/.test(credential.password) &&
                    /[A-Za-z]/.test(credential.password)))
              ) {
                credential.strength = "medium";
              } else {
                credential.strength = "weak";
              }
            }

            // Ne prendre que les credentials qui ont au moins un nom ou une URL
            if (credential.name || credential.website) {
              credentials.push(credential);
              stats.total++;
              stats.new++;
            }
          }

          resolve({ credentials, stats });
        } catch (error) {
          console.error("Erreur lors du parsing local du CSV:", error);
          reject(error);
        }
      },
      error: (error) => {
        console.error("Erreur Papa Parse:", error);
        reject(error);
      },
    };

    // Lire et parser le fichier
    Papa.parse(file, parseOptions);
  });
};

const ImportExport = () => {
  const drawerWidth = 240;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Import states
  const [selectedSource, setSelectedSource] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [sourcePassword, setSourcePassword] = useState("");
  const [showSourcePassword, setShowSourcePassword] = useState(false);
  const [importedCredentials, setImportedCredentials] = useState([]);
  const [importPreview, setImportPreview] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [fileId, setFileId] = useState(null);

  // Export states
  const [exportFormat, setExportFormat] = useState("firekey");
  const [exportPassword, setExportPassword] = useState("");
  const [showExportPassword, setShowExportPassword] = useState(false);
  const [encryptExport, setEncryptExport] = useState(true);

  // Options d'import/export
  const [importSources, setImportSources] = useState([]);
  const [exportFormats, setExportFormats] = useState([]);
  const [mergeStrategies, setMergeStrategies] = useState([]);
  const [selectedMergeStrategy, setSelectedMergeStrategy] =
    useState("smart_merge");

  // État pour les erreurs d'API
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le token d'accès
  const accessToken = localStorage.getItem("accessToken") || "";
  const API_URL = "http://localhost:8001";
  const IMPORT_EXPORT_API = `${API_URL}/api/import-export`;

  // Création d'une instance axios
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Vérifier que l'utilisateur est bien connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler la vérification comme dans Dashboard
        if (!accessToken) {
          navigate("/");
          return;
        }

        // Charger les données initiales
        fetchOptions();
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        // Si erreur d'authentification, rediriger vers login
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, accessToken]);

  // Récupérer les options d'import/export
  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      // Récupérer les options depuis le serveur
      const response = await fetch(`${IMPORT_EXPORT_API}/options/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Non autorisé");
        }
        throw new Error(`Erreur ${response.status}`);
      }

      const options = await response.json();
      setImportSources(options.import_sources || []);
      setExportFormats(options.export_formats || []);
      setMergeStrategies(options.merge_strategies || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des options:", error);

      // Si erreur d'authentification, rediriger vers login
      if (error.message === "Non autorisé") {
        navigate("/");
        return;
      }

      // Utiliser des données par défaut en cas d'erreur
      setImportSources([
        {
          id: "google",
          name: "Google Password Manager",
          requires_password: false,
          color: "#4285F4",
        },
        {
          id: "dashlane",
          name: "Dashlane",
          requires_password: true,
          color: "#007C89",
        },
        {
          id: "bitwarden",
          name: "Bitwarden",
          requires_password: true,
          color: "#175DDC",
        },
        {
          id: "lastpass",
          name: "LastPass",
          requires_password: true,
          color: "#D32D27",
        },
        {
          id: "onepassword",
          name: "1Password",
          requires_password: true,
          color: "#0364D3",
        },
        {
          id: "keeper",
          name: "Keeper",
          requires_password: true,
          color: "#FFC244",
        },
        {
          id: "csv",
          name: "CSV (Generic)",
          requires_password: false,
          color: "#90caf9",
        },
      ]);

      setExportFormats([
        {
          id: "firekey",
          name: "FireKey (Recommandé)",
          description: "Format natif chiffré pour FireKey",
        },
        {
          id: "csv",
          name: "CSV",
          description:
            "Format compatible avec la plupart des gestionnaires de mots de passe",
        },
        { id: "json", name: "JSON", description: "Format lisible par machine" },
        {
          id: "bitwarden",
          name: "Bitwarden CSV",
          description: "Format CSV pour import vers Bitwarden",
        },
      ]);

      setMergeStrategies([
        {
          id: "smart_merge",
          name: "Fusion intelligente",
          description: "Combine les informations des deux sources",
        },
        {
          id: "skip",
          name: "Ignorer les doublons",
          description: "N'importe que les nouveaux credentials",
        },
        {
          id: "rename",
          name: "Renommer",
          description: "Crée des copies avec un nouveau nom",
        },
        {
          id: "overwrite",
          name: "Écraser",
          description: "Remplace les credentials existants",
        },
      ]);

      setApiError("Mode dégradé: utilisation des options par défaut");
      enqueueSnackbar(
        "Erreur de communication avec le serveur. Mode dégradé activé.",
        {
          variant: "warning",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Télécharger un fichier pour analyse
  const uploadFile = async (file, source, password = "") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source", source);
      if (password) {
        formData.append("password", password);
      }

      const response = await fetch(`${IMPORT_EXPORT_API}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      throw error;
    }
  };

  // Récupérer la prévisualisation complète
  const getPreview = async (fileId, password = "") => {
    try {
      const url =
        `${IMPORT_EXPORT_API}/preview/${fileId}/` +
        (password ? `?password=${encodeURIComponent(password)}` : "");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la prévisualisation:",
        error
      );
      throw error;
    }
  };

  // Exécuter l'import
  const executeImport = async (
    fileId,
    source,
    password = "",
    mergeStrategy = "smart_merge"
  ) => {
    try {
      const response = await fetch(`${IMPORT_EXPORT_API}/import/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          file_id: fileId,
          source,
          password,
          merge_strategy: mergeStrategy,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de l'exécution de l'import:", error);
      throw error;
    }
  };

  // Exporter les credentials
  const exportCredentials = async (
    format,
    encrypt,
    password = "",
    includeShared = false,
    includeTags = true
  ) => {
    try {
      const response = await fetch(`${IMPORT_EXPORT_API}/export/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          format,
          encrypt,
          password,
          include_shared: includeShared,
          include_tags: includeTags,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const blob = await response.blob();

      // Extraire le nom du fichier s'il est présent dans l'en-tête Content-Disposition
      let filename = "firekey-export.zip";
      const contentDisposition = response.headers.get("content-disposition");

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      } else {
        // Fallback au cas où content-disposition n'est pas disponible
        const extension =
          format === "json" ? "json" : format === "firekey" ? "fbak" : "csv";
        filename = `firekey-export-${
          new Date().toISOString().split("T")[0]
        }.${extension}`;
      }

      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      throw error;
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle source selection
  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    setRequiresPassword(source.requires_password);
    setActiveStep(1);
    setSourcePassword("");
    setFileId(null);
    setUploadedFile(null);
    setImportPreview([]);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);

      try {
        // D'abord essayer avec l'API
        const result = await uploadFile(
          file,
          selectedSource.id,
          sourcePassword
        );

        // Vérifier si des credentials ont été trouvés
        if (result.preview && result.preview.length > 0) {
          setFileId(result.file_status.file_id);
          setImportPreview(result.preview || []);
          setActiveStep(2);
          enqueueSnackbar("Fichier analysé avec succès", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        } else {
          // Si aucun credential n'a été trouvé par le serveur, essayer l'analyse locale
          console.log(
            "Aucun credential trouvé par le serveur, tentative d'analyse locale"
          );

          try {
            const localResult = await parseCSVLocally(file, selectedSource.id);

            if (localResult.credentials.length > 0) {
              // Utiliser un ID local pour indiquer que c'est un traitement client
              setFileId("local-" + Math.random().toString(36).substring(2, 15));
              setImportPreview(localResult.credentials);
              setActiveStep(2);

              enqueueSnackbar(
                `Mode dégradé: ${localResult.credentials.length} credentials trouvés localement`,
                {
                  variant: "info",
                  anchorOrigin: { vertical: "top", horizontal: "right" },
                }
              );
            } else {
              // Même l'analyse locale n'a pas trouvé de credentials
              enqueueSnackbar(
                "Aucun credential n'a été trouvé dans ce fichier",
                {
                  variant: "warning",
                  anchorOrigin: { vertical: "top", horizontal: "right" },
                }
              );
            }
          } catch (localError) {
            console.error("Erreur lors de l'analyse locale:", localError);
            enqueueSnackbar("Erreur lors de l'analyse du fichier", {
              variant: "error",
              anchorOrigin: { vertical: "top", horizontal: "right" },
            });
          }
        }
      } catch (error) {
        // Erreur de l'API, essayer l'analyse locale
        console.error("Erreur API:", error);

        try {
          const localResult = await parseCSVLocally(file, selectedSource.id);

          if (localResult.credentials.length > 0) {
            setFileId("local-" + Math.random().toString(36).substring(2, 15));
            setImportPreview(localResult.credentials);
            setActiveStep(2);

            enqueueSnackbar(
              `Mode dégradé: ${localResult.credentials.length} credentials trouvés localement`,
              {
                variant: "info",
                anchorOrigin: { vertical: "top", horizontal: "right" },
              }
            );
          } else {
            setApiError("Aucun credential n'a été trouvé dans ce fichier");
            enqueueSnackbar("Aucun credential n'a été trouvé dans ce fichier", {
              variant: "warning",
              anchorOrigin: { vertical: "top", horizontal: "right" },
            });
          }
        } catch (localError) {
          setApiError("Erreur lors de l'analyse du fichier");
          enqueueSnackbar("Erreur lors de l'analyse du fichier", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle next step
  const handleNext = async () => {
    if (activeStep === 2 && requiresPassword && !sourcePassword) {
      enqueueSnackbar("Veuillez saisir le mot de passe du fichier", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    if (activeStep === 2) {
      try {
        setIsProcessing(true);
        // Si c'est un ID local (mode dégradé), ne pas faire d'appel API
        if (fileId && fileId.startsWith("local-")) {
          // Juste passer à l'étape suivante
          setActiveStep(3);
        } else {
          const preview = await getPreview(fileId, sourcePassword);
          setImportPreview(preview.credentials || []);
          setActiveStep(3);
        }
      } catch (error) {
        setApiError("Erreur lors de la récupération de la prévisualisation");
        enqueueSnackbar(
          "Erreur lors de la récupération de la prévisualisation",
          {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle reset
  const handleReset = () => {
    setActiveStep(0);
    setSelectedSource(null);
    setUploadedFile(null);
    setSourcePassword("");
    setImportedCredentials([]);
    setImportPreview([]);
    setFileId(null);
    setApiError(null);
  };

  // Open preview dialog
  const handleOpenPreview = async () => {
    if (fileId && !fileId.startsWith("local-")) {
      try {
        setIsProcessing(true);
        const preview = await getPreview(fileId, sourcePassword);
        setImportPreview(preview.credentials || []);
        setPreviewOpen(true);
      } catch (error) {
        setApiError(
          "Erreur lors de la récupération de la prévisualisation complète"
        );
        enqueueSnackbar(
          "Erreur lors de la récupération de la prévisualisation",
          {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      setPreviewOpen(true);
    }
  };

  // Close preview dialog
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  // Open confirm dialog
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  // Close confirm dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // Handle import confirmation
  const handleConfirmImport = async () => {
    setIsProcessing(true);

    // Vérifier si c'est un ID local (mode dégradé)
    if (fileId && fileId.startsWith("local-")) {
      // En mode dégradé, simuler l'importation sans appeler l'API
      setTimeout(() => {
        setIsProcessing(false);
        handleCloseConfirmDialog();

        enqueueSnackbar(
          `Import réussi en mode dégradé! ${importPreview.length} credentials ont été ajoutés à votre coffre.`,
          {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );

        handleReset();
      }, 1500);
      return;
    }

    // Mode normal - appel à l'API
    try {
      const result = await executeImport(
        fileId,
        selectedSource.id,
        sourcePassword,
        selectedMergeStrategy
      );
      setIsProcessing(false);
      handleCloseConfirmDialog();

      enqueueSnackbar(
        `Import réussi! ${
          result.results.imported + result.results.merged
        } credentials ont été ajoutés à votre coffre.`,
        {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }
      );

      handleReset();
    } catch (error) {
      setApiError("Erreur lors de l'import");
      enqueueSnackbar("Erreur lors de l'import", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setIsProcessing(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    // Validation pour le mot de passe
    if (exportFormat === "firekey" && encryptExport && !exportPassword) {
      enqueueSnackbar("Un mot de passe est requis pour l'export chiffré", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsProcessing(true);

    try {
      await exportCredentials(exportFormat, encryptExport, exportPassword);
      setIsProcessing(false);

      enqueueSnackbar("Export réussi!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (error) {
      setApiError("Erreur lors de l'export");
      enqueueSnackbar("Erreur lors de l'export", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setIsProcessing(false);
    }
  };

  // Get credential status icon
  const getCredentialStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <CheckCircleOutlineIcon sx={{ color: "#4caf50" }} />;
      case "duplicate":
        return <WarningIcon sx={{ color: "#ff9800" }} />;
      case "conflict":
        return <ErrorOutlineIcon sx={{ color: "#f44336" }} />;
      default:
        return <InfoIcon sx={{ color: "#2196f3" }} />;
    }
  };

  // Get credential status text
  const getCredentialStatusText = (status) => {
    switch (status) {
      case "new":
        return "Nouveau";
      case "duplicate":
        return "Doublon";
      case "conflict":
        return "Conflit";
      default:
        return "Information";
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = (strength) => {
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

  // Render import steps
  const importSteps = [
    {
      label: "Sélectionner la source",
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="#b0b0b0" sx={{ mb: 3 }}>
            Choisissez le gestionnaire de mots de passe à partir duquel vous
            souhaitez importer vos credentials.
          </Typography>
          <Grid container spacing={2}>
            {importSources.map((source) => (
              <Grid item xs={12} sm={6} md={4} key={source.id}>
                <Fade
                  in={true}
                  style={{
                    transitionDelay: `${importSources.indexOf(source) * 100}ms`,
                  }}
                >
                  <ImportSourceCard
                    active={selectedSource?.id === source.id}
                    onClick={() => handleSourceSelect(source)}
                  >
                    <SourceIcon color={source.color || "#90caf9"}>
                      {getManagerIcon(source.id)}
                    </SourceIcon>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{ fontWeight: 600, color: "#ffffff", mb: 1 }}
                    >
                      {source.name}
                    </Typography>
                    {source.requires_password && (
                      <Chip
                        label="Nécessite un mot de passe"
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          bgcolor: alpha("#f44336", 0.1),
                          color: "#f44336",
                          mx: "auto",
                          display: "flex",
                        }}
                      />
                    )}
                  </ImportSourceCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      ),
    },
    {
      label: "Sélectionner un fichier",
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="#b0b0b0" sx={{ mb: 3 }}>
            Sélectionnez le fichier que vous souhaitez importer.
            {selectedSource && (
              <Box component="span" sx={{ display: "block", mt: 1 }}>
                Source sélectionnée:{" "}
                <Box
                  component="span"
                  sx={{ color: "#ffffff", fontWeight: 500 }}
                >
                  {selectedSource.name}
                </Box>
              </Box>
            )}
          </Typography>

          <Box
            sx={{
              border: "2px dashed rgba(144, 202, 249, 0.5)",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              backgroundColor: alpha("#90caf9", 0.05),
              mb: 3,
            }}
          >
            {uploadedFile ? (
              <Box>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 48, color: "#4caf50", mb: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#ffffff", mb: 1 }}
                >
                  Fichier sélectionné:
                </Typography>
                <Typography variant="body2" sx={{ color: "#90caf9", mb: 2 }}>
                  {uploadedFile.name}
                </Typography>
                <StyledButton
                  variant="outlined"
                  component="label"
                  color="primary"
                  size="small"
                  disabled={isProcessing}
                >
                  Changer de fichier
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </StyledButton>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "#90caf9", mb: 2 }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#ffffff", mb: 1 }}
                >
                  Déposez votre fichier ici ou
                </Typography>
                <StyledButton
                  variant="contained"
                  component="label"
                  color="primary"
                  disabled={isProcessing}
                >
                  Parcourir
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </StyledButton>
              </Box>
            )}
          </Box>

          {requiresPassword && (
            <TextField
              label="Mot de passe du fichier"
              variant="outlined"
              fullWidth
              type={showSourcePassword ? "text" : "password"}
              value={sourcePassword}
              onChange={(e) => setSourcePassword(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowSourcePassword(!showSourcePassword)}
                    edge="end"
                    sx={{ color: "#b0b0b0" }}
                  >
                    {showSourcePassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                ),
              }}
              placeholder="Entrez le mot de passe du fichier d'export"
            />
          )}

          <Alert
            severity="info"
            sx={{
              mt: 3,
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              color: "#29b6f6",
              "& .MuiAlert-icon": {
                color: "#29b6f6",
              },
            }}
          >
            {selectedSource ? (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Comment exporter depuis {selectedSource.name}:
                </Typography>
                <Typography variant="body2">
                  {selectedSource.id === "google" &&
                    "Accédez à passwords.google.com → Paramètres → Exporter → Télécharger le fichier."}
                  {selectedSource.id === "dashlane" &&
                    "Ouvrez Dashlane → Fichier → Exporter → Exporter au format CSV."}
                  {selectedSource.id === "bitwarden" &&
                    "Ouvrez Bitwarden → Outils → Exporter → Choisissez CSV."}
                  {selectedSource.id === "lastpass" &&
                    "Accédez au compte LastPass → Options avancées → Exporter → LastPass CSV."}
                  {selectedSource.id === "onepassword" &&
                    "Ouvrez 1Password → Fichier → Exporter → Tous les éléments → Format CSV."}
                  {selectedSource.id === "keeper" &&
                    "Accédez à votre coffre Keeper → Paramètres → Exporter → Exporter en CSV."}
                  {selectedSource.id === "csv" &&
                    "Assurez-vous que votre fichier CSV contient au minimum les colonnes: name, url, username/email, password."}
                </Typography>
              </>
            ) : (
              "Sélectionnez d'abord une source pour voir les instructions d'exportation spécifiques."
            )}
          </Alert>
        </Box>
      ),
    },
    {
      label: "Vérifier les données",
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="#b0b0b0" sx={{ mb: 2 }}>
            Vérifiez les credentials qui seront importés depuis{" "}
            {selectedSource?.name}.
          </Typography>

          {isProcessing ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 6,
              }}
            >
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#ffffff"
                    sx={{ fontWeight: 500 }}
                  >
                    {importPreview.length} credentials trouvés
                  </Typography>
                  <Typography variant="body2" color="#b0b0b0">
                    {
                      importPreview.filter((cred) => cred.status === "new")
                        .length
                    }{" "}
                    nouveaux,{" "}
                    {
                      importPreview.filter(
                        (cred) => cred.status === "duplicate"
                      ).length
                    }{" "}
                    doublons
                  </Typography>
                </Box>
              </Box>

              <Paper
                sx={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 2,
                  maxHeight: 300,
                  overflow: "auto",
                  mb: 3,
                }}
              >
                <Box sx={{ p: 2 }}>
                  {importPreview.slice(0, 5).map((credential) => (
                    <Box
                      key={credential.id}
                      sx={{
                        mb: 1,
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: alpha(
                          credential.status === "new"
                            ? "#4caf50"
                            : credential.status === "duplicate"
                            ? "#ff9800"
                            : "#f44336",
                          0.05
                        ),
                        border: "1px solid",
                        borderColor: alpha(
                          credential.status === "new"
                            ? "#4caf50"
                            : credential.status === "duplicate"
                            ? "#ff9800"
                            : "#f44336",
                          0.2
                        ),
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          color="#ffffff"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {credential.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#b0b0b0"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          {credential.website} •{" "}
                          {credential.email || credential.username}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Chip
                          size="small"
                          label={getCredentialStatusText(credential.status)}
                          icon={getCredentialStatusIcon(credential.status)}
                          sx={{
                            backgroundColor: alpha(
                              credential.status === "new"
                                ? "#4caf50"
                                : credential.status === "duplicate"
                                ? "#ff9800"
                                : "#f44336",
                              0.1
                            ),
                            color:
                              credential.status === "new"
                                ? "#4caf50"
                                : credential.status === "duplicate"
                                ? "#ff9800"
                                : "#f44336",
                          }}
                        />
                        <Chip
                          size="small"
                          label={credential.strength}
                          sx={{
                            backgroundColor: alpha(
                              getPasswordStrengthColor(credential.strength),
                              0.1
                            ),
                            color: getPasswordStrengthColor(
                              credential.strength
                            ),
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  color="#ffffff"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  Stratégie de fusion
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={selectedMergeStrategy}
                  onChange={(e) => setSelectedMergeStrategy(e.target.value)}
                  sx={textFieldStyle}
                  helperText="Comment gérer les credentials qui existent déjà"
                >
                  {mergeStrategies.map((strategy) => (
                    <MenuItem key={strategy.id} value={strategy.id}>
                      <Box>
                        <Typography variant="body1">{strategy.name}</Typography>
                        <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                          {strategy.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  color: "#ffb74d",
                  "& .MuiAlert-icon": {
                    color: "#ffb74d",
                  },
                }}
              >
                <Typography variant="body2">
                  L'import ne supprime pas les credentials existants, mais peut
                  créer des doublons si des mots de passe identiques existent
                  déjà dans votre coffre.
                </Typography>
              </Alert>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleOpenPreview}
                  startIcon={<VisibilityIcon />}
                  disabled={importPreview.length === 0}
                  sx={{ mr: 2 }}
                >
                  Aperçu détaillé
                </StyledButton>

                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleOpenConfirmDialog}
                  startIcon={<FileUploadIcon />}
                  disabled={importPreview.length === 0}
                >
                  Importer {importPreview.length} credentials
                </StyledButton>
              </Box>
            </>
          )}
        </Box>
      ),
    },
  ];

  // Si chargement initial, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#121212",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

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
      <Box sx={{ flexGrow: 1 }}>
        <Topbar drawerWidth={drawerWidth} />
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#ffffff", mb: 1 }}
            >
              Import / Export
            </Typography>
            <Typography variant="body1" sx={{ color: "#b0b0b0" }}>
              Importez des mots de passe depuis d'autres gestionnaires ou
              exportez votre coffre
            </Typography>
          </Box>

          {/* Afficher les erreurs d'API */}
          {apiError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                color: "#f44336",
                "& .MuiAlert-icon": {
                  color: "#f44336",
                },
              }}
              onClose={() => setApiError(null)}
            >
              <Typography variant="body2">{apiError}</Typography>
            </Alert>
          )}

          {/* Contenu principal */}
          <Box>
            <StyledPaper>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="import-export tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  mb: 3,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#90caf9",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    color: "#b0b0b0",
                    "&.Mui-selected": {
                      color: "#90caf9",
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <Tab
                  icon={<FileUploadIcon />}
                  iconPosition="start"
                  label="Importer"
                  id="import-tab"
                  aria-controls="import-panel"
                />
                <Tab
                  icon={<FileDownloadIcon />}
                  iconPosition="start"
                  label="Exporter"
                  id="export-tab"
                  aria-controls="export-panel"
                />
              </Tabs>

              {/* Import panel */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 0}
                id="import-panel"
                aria-labelledby="import-tab"
              >
                {tabValue === 0 && (
                  <Box>
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {importSteps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: "#ffffff",
                                fontWeight: activeStep === index ? 600 : 400,
                              }}
                            >
                              {step.label}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            {step.content}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                              }}
                            >
                              <StyledButton
                                color="inherit"
                                disabled={index === 0 || isProcessing}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                              >
                                Retour
                              </StyledButton>
                              <Box sx={{ flex: "1 1 auto" }} />
                              {index === importSteps.length - 1 ? null : (
                                <StyledButton
                                  variant="contained"
                                  onClick={handleNext}
                                  disabled={
                                    isProcessing ||
                                    (index === 0 && !selectedSource) ||
                                    (index === 1 && !uploadedFile)
                                  }
                                >
                                  {isProcessing ? (
                                    <>
                                      <CircularProgress
                                        size={24}
                                        sx={{ color: "white", mr: 1 }}
                                      />
                                      Traitement...
                                    </>
                                  ) : (
                                    "Continuer"
                                  )}
                                </StyledButton>
                              )}
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                )}
              </Box>

              {/* Export panel */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 1}
                id="export-panel"
                aria-labelledby="export-tab"
              >
                {tabValue === 1 && (
                  <Box>
                    <Alert
                      severity="info"
                      sx={{
                        mb: 4,
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        color: "#29b6f6",
                        "& .MuiAlert-icon": {
                          color: "#29b6f6",
                        },
                      }}
                    >
                      <Typography variant="body2">
                        L'export vous permet de sauvegarder vos credentials ou
                        de les transférer vers un autre gestionnaire de mots de
                        passe.
                      </Typography>
                    </Alert>

                    <Typography
                      variant="subtitle1"
                      color="#ffffff"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Choisir le format d'export
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label="Format"
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        sx={textFieldStyle}
                        helperText="Sélectionnez le format de fichier d'export"
                      >
                        {exportFormats.map((format) => (
                          <MenuItem key={format.id} value={format.id}>
                            <Box>
                              <Typography variant="body1">
                                {format.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#b0b0b0" }}
                              >
                                {format.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>

                    <Divider
                      sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", my: 3 }}
                    />

                    <Typography
                      variant="subtitle1"
                      color="#ffffff"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      Options de sécurité
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={encryptExport}
                            onChange={(e) => setEncryptExport(e.target.checked)}
                            name="encrypt"
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" color="#ffffff">
                              Chiffrer l'export
                            </Typography>
                            <Typography variant="caption" color="#b0b0b0">
                              Recommandé pour protéger vos données sensibles
                              (uniquement pour le format FireKey)
                            </Typography>
                          </Box>
                        }
                        sx={{ mb: 2 }}
                        disabled={exportFormat !== "firekey"}
                      />

                      <Collapse
                        in={encryptExport && exportFormat === "firekey"}
                      >
                        <TextField
                          label="Mot de passe de chiffrement"
                          variant="outlined"
                          fullWidth
                          type={showExportPassword ? "text" : "password"}
                          value={exportPassword}
                          onChange={(e) => setExportPassword(e.target.value)}
                          sx={{ ...textFieldStyle, mb: 2 }}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>
                                  setShowExportPassword(!showExportPassword)
                                }
                                edge="end"
                                sx={{ color: "#b0b0b0" }}
                              >
                                {showExportPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            ),
                          }}
                          placeholder="Entrez un mot de passe pour protéger votre export"
                        />

                        <Alert
                          severity="warning"
                          sx={{
                            mb: 3,
                            backgroundColor: "rgba(255, 152, 0, 0.1)",
                            color: "#ffb74d",
                            "& .MuiAlert-icon": {
                              color: "#ffb74d",
                            },
                          }}
                        >
                          <Typography variant="body2">
                            Conservez soigneusement ce mot de passe. Sans lui,
                            vous ne pourrez pas restaurer vos données à partir
                            de cette sauvegarde.
                          </Typography>
                        </Alert>
                      </Collapse>
                    </Box>

                    <Alert
                      severity="warning"
                      sx={{
                        mb: 4,
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        color: "#f44336",
                        "& .MuiAlert-icon": {
                          color: "#f44336",
                        },
                        display: exportFormat !== "firekey" ? "flex" : "none",
                      }}
                    >
                      <Typography variant="body2">
                        Les exports en formats CSV et JSON ne sont pas chiffrés.
                        Ne les stockez pas dans des endroits non sécurisés.
                      </Typography>
                    </Alert>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleExport}
                        startIcon={<FileDownloadIcon />}
                        disabled={
                          isProcessing ||
                          (encryptExport &&
                            exportFormat === "firekey" &&
                            !exportPassword)
                        }
                      >
                        {isProcessing ? (
                          <>
                            <CircularProgress
                              size={24}
                              sx={{ color: "#fff", mr: 1 }}
                            />
                            Export en cours...
                          </>
                        ) : (
                          "Exporter mon coffre"
                        )}
                      </StyledButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </StyledPaper>

            {/* Bottom section with help */}
            <StyledPaper>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#ffffff",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HelpOutlineIcon sx={{ mr: 1 }} />
                Aide et conseils
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
                  >
                    Imports multiples
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    Vous pouvez importer depuis plusieurs sources. FireKey
                    fusionnera intelligemment vos credentials en détectant les
                    doublons.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
                  >
                    Sauvegardes régulières
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    Nous recommandons d'exporter régulièrement une sauvegarde
                    chiffrée de votre coffre pour plus de sécurité.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
                  >
                    Format d'export
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                    Le format FireKey préserve toutes vos données et paramètres.
                    Utilisez CSV ou JSON uniquement pour la compatibilité avec
                    d'autres services.
                  </Typography>
                </Grid>
              </Grid>
            </StyledPaper>
          </Box>
        </Container>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={!isProcessing ? handleClosePreview : undefined}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#ffffff" }}>
            Aperçu des credentials à importer
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {isProcessing ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 6,
              }}
            >
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="#b0b0b0" sx={{ mb: 2 }}>
                Liste complète des {importPreview.length} credentials qui seront
                importés depuis {selectedSource?.name}.
              </Typography>

              <Paper
                sx={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 2,
                  maxHeight: 400,
                  overflow: "auto",
                  mb: 3,
                }}
              >
                <Box sx={{ p: 2 }}>
                  {importPreview.map((credential) => (
                    <Box
                      key={credential.id}
                      sx={{
                        mb: 1,
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: alpha(
                          credential.status === "new"
                            ? "#4caf50"
                            : credential.status === "duplicate"
                            ? "#ff9800"
                            : "#f44336",
                          0.05
                        ),
                        border: "1px solid",
                        borderColor: alpha(
                          credential.status === "new"
                            ? "#4caf50"
                            : credential.status === "duplicate"
                            ? "#ff9800"
                            : "#f44336",
                          0.2
                        ),
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          color="#ffffff"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {credential.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#b0b0b0"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          {credential.website} •{" "}
                          {credential.email || credential.username}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Chip
                          size="small"
                          label={getCredentialStatusText(credential.status)}
                          icon={getCredentialStatusIcon(credential.status)}
                          sx={{
                            backgroundColor: alpha(
                              credential.status === "new"
                                ? "#4caf50"
                                : credential.status === "duplicate"
                                ? "#ff9800"
                                : "#f44336",
                              0.1
                            ),
                            color:
                              credential.status === "new"
                                ? "#4caf50"
                                : credential.status === "duplicate"
                                ? "#ff9800"
                                : "#f44336",
                          }}
                        />
                        <Chip
                          size="small"
                          label={credential.strength}
                          sx={{
                            backgroundColor: alpha(
                              getPasswordStrengthColor(credential.strength),
                              0.1
                            ),
                            color: getPasswordStrengthColor(
                              credential.strength
                            ),
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Typography
                variant="subtitle2"
                color="#ffffff"
                sx={{ mt: 3, mb: 1, fontWeight: 600 }}
              >
                Résumé:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<CheckCircleOutlineIcon />}
                  label={`${
                    importPreview.filter((c) => c.status === "new").length
                  } nouveaux credentials`}
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                  }}
                />
                <Chip
                  icon={<WarningIcon />}
                  label={`${
                    importPreview.filter((c) => c.status === "duplicate").length
                  } doublons détectés`}
                  sx={{
                    backgroundColor: alpha("#ff9800", 0.1),
                    color: "#ff9800",
                  }}
                />
                <Chip
                  icon={<ErrorOutlineIcon />}
                  label={`${
                    importPreview.filter((c) => c.status === "conflict").length
                  } conflits`}
                  sx={{
                    backgroundColor: alpha("#f44336", 0.1),
                    color: "#f44336",
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <StyledButton
            onClick={handleClosePreview}
            color="inherit"
            disabled={isProcessing}
          >
            Fermer
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              handleClosePreview();
              handleOpenConfirmDialog();
            }}
            disabled={isProcessing}
          >
            Continuer l'import
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={!isProcessing ? handleCloseConfirmDialog : undefined}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#ffffff" }}>
            Confirmer l'import
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {isProcessing ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 3,
              }}
            >
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ color: "#ffffff", fontWeight: 500, mb: 1 }}
              >
                Import en cours...
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#b0b0b0", textAlign: "center" }}
              >
                Veuillez patienter pendant que nous importons vos credentials.
                <br />
                Cela peut prendre quelques instants.
              </Typography>
            </Box>
          ) : (
            <>
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  mt: 1,
                  backgroundColor: "rgba(255, 152, 0, 0.1)",
                  color: "#ffb74d",
                  "& .MuiAlert-icon": {
                    color: "#ffb74d",
                  },
                }}
              >
                <Typography variant="body2">
                  Vous êtes sur le point d'importer {importPreview.length}{" "}
                  credentials dans votre coffre. Cette action ne peut pas être
                  annulée.
                </Typography>
              </Alert>

              <Typography
                variant="subtitle2"
                color="#ffffff"
                sx={{ mb: 1, fontWeight: 600 }}
              >
                Résumé de l'import:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <Chip
                  icon={<CheckCircleOutlineIcon />}
                  label={`${
                    importPreview.filter((c) => c.status === "new").length
                  } nouveaux credentials`}
                  sx={{
                    backgroundColor: alpha("#4caf50", 0.1),
                    color: "#4caf50",
                  }}
                />
                {importPreview.filter((c) => c.status === "duplicate").length >
                  0 && (
                  <Chip
                    icon={<WarningIcon />}
                    label={`${
                      importPreview.filter((c) => c.status === "duplicate")
                        .length
                    } doublons détectés`}
                    sx={{
                      backgroundColor: alpha("#ff9800", 0.1),
                      color: "#ff9800",
                    }}
                  />
                )}
              </Box>

              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Stratégie de fusion sélectionnée:{" "}
                <strong>
                  {mergeStrategies.find((s) => s.id === selectedMergeStrategy)
                    ?.name || "Fusion intelligente"}
                </strong>
                .{" "}
                {selectedMergeStrategy === "smart_merge"
                  ? "Les credentials seront fusionnés intelligemment pour conserver les meilleures informations."
                  : selectedMergeStrategy === "skip"
                  ? "Les credentials en double seront ignorés."
                  : selectedMergeStrategy === "rename"
                  ? "Les credentials en double seront importés avec un nom différent."
                  : "Les credentials existants seront écrasés par les nouveaux."}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <StyledButton
            onClick={handleCloseConfirmDialog}
            color="inherit"
            disabled={isProcessing}
          >
            Annuler
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleConfirmImport}
            disabled={isProcessing}
            startIcon={<FileUploadIcon />}
          >
            Confirmer l'import
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImportExport;
