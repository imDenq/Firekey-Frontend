// src/pages/Login.jsx - Ajout du support 2FA avec UI améliorée et logo personnalisé
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Alert,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { styled, alpha } from "@mui/material/styles";

// Icons
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SecurityIcon from "@mui/icons-material/Security";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Styled components avec thème chaud
const LoginContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#121212",
  position: "relative",
  overflow: "hidden",
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  background:
    "radial-gradient(circle at top right, rgba(255, 152, 67, 0.15) 0%, rgba(255, 87, 34, 0.08) 35%, rgba(13, 17, 23, 0) 70%)",
  zIndex: 0,
}));

const WaveBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "25vh",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ff5722' fill-opacity='0.3' d='M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,106.7C672,139,768,181,864,165.3C960,149,1056,75,1152,74.7C1248,75,1344,149,1392,186.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: 0,
  opacity: 0.8,
}));

const CardWrapper = styled(Box)(({ theme }) => ({
  perspective: "1000px",
  position: "relative",
  zIndex: 1,
  maxWidth: "450px",
  width: "100%",
}));

const CardContainer = styled(Box)(({ isFlipped }) => ({
  position: "relative",
  width: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
}));

const CardSide = styled(Paper)(({ back }) => ({
  padding: 40,
  width: "100%",
  backgroundColor: "#1e1e1e",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  color: "white",
  position: "absolute",
  top: 0,
  left: 0,
  backfaceVisibility: "hidden",
  transform: back ? "rotateY(180deg)" : "rotateY(0deg)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    padding: 2,
    background:
      "linear-gradient(225deg, rgba(255, 152, 67, 0.4) 0%, rgba(255, 87, 34, 0.2) 50%, rgba(30, 30, 30, 0) 100%)",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: 20,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(13, 17, 23, 0.6)",
    borderRadius: 10,
    "& fieldset": {
      borderColor: "rgba(255, 152, 67, 0.3)",
      transition: "border-color 0.2s",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 152, 67, 0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9843",
    },
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#b0b0b0",
    "&.Mui-focused": {
      color: "#ff9843",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.3)",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: 20,
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
  },
  backgroundColor: "rgba(13, 17, 23, 0.6)",
  borderRadius: 10,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 152, 67, 0.3)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 152, 67, 0.6)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ff9843",
  },
  color: "white",
  "& .MuiSelect-icon": {
    color: "#ff9843",
  },
}));

const StyledButton = styled(Button)(({ theme, secondary }) => ({
  marginBottom: secondary ? 0 : 24,
  padding: "12px 0",
  borderRadius: 10,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  transition: "all 0.2s",
  position: "relative",
  overflow: "hidden",
  background: secondary 
    ? "transparent" 
    : "linear-gradient(45deg, #ff5722 30%, #ff9800 90%)",
  color: secondary ? "#ff9843" : "#ffffff",
  border: secondary ? "1px solid rgba(255, 152, 67, 0.6)" : "none",
  "&:hover": {
    background: secondary 
      ? "rgba(255, 152, 67, 0.15)" 
      : "linear-gradient(45deg, #e64a19 30%, #f57c00 90%)",
    boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
    transform: "translateY(-2px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transformOrigin: "0 0",
    transform: "rotate(30deg) translateY(100%) scale(0.5)",
    transition: "transform 0.5s",
    pointerEvents: "none",
  },
  "&:hover::after": {
    transform: "rotate(30deg) translateY(0) scale(0.5)",
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 32,
}));

// Composant pour le logo personnalisé
const CustomLogo = styled("img")(({ theme }) => ({
  width: "100px",
  height: "100px",
  marginBottom: 16,
  filter: "drop-shadow(0 4px 8px rgba(255, 87, 34, 0.3))",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    filter: "drop-shadow(0 6px 12px rgba(255, 87, 34, 0.5))",
  },
}));

// Style pour la boîte de code 2FA avec couleurs chaudes
const CodeInputBox = styled(Box)(({ theme }) => ({
  marginBottom: 24,
  padding: "12px 16px",
  backgroundColor: "rgba(13, 17, 23, 0.8)",
  borderRadius: 10,
  border: "1px solid rgba(255, 152, 67, 0.4)",
  transition: "all 0.2s",
  "&:focus-within": {
    border: "1px solid rgba(255, 152, 67, 0.8)",
    boxShadow: "0 0 0 2px rgba(255, 152, 67, 0.2)",
  },
}));

const TwoFactorDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    color: "white",
    padding: "8px",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid rgba(255, 152, 67, 0.3)",
  },
}));

// Composant pour les entrées de 2FA avec couleurs chaudes
const OtpInput = styled(TextField)(({ theme, active }) => ({
  width: "48px",
  height: "56px",
  margin: "0 4px",
  "& .MuiOutlinedInput-root": {
    height: "100%",
    backgroundColor: active
      ? "rgba(255, 152, 67, 0.15)"
      : "rgba(13, 17, 23, 0.6)",
    borderRadius: 10,
    "& input": {
      textAlign: "center",
      padding: "14px 4px",
      fontSize: "1.5rem",
      fontWeight: "600",
      fontFamily: "monospace",
      caretColor: active ? "#ff9843" : "transparent",
    },
    "& fieldset": {
      borderColor: active
        ? "rgba(255, 152, 67, 0.8)"
        : "rgba(255, 152, 67, 0.3)",
      borderWidth: active ? "2px" : "1px",
      transition: "all 0.2s",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 152, 67, 0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9843",
      borderWidth: "2px",
    },
    color: "#ffffff",
  },
}));

export default function Login() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hashAlgorithm, setHashAlgorithm] = useState("default");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formHeight, setFormHeight] = useState("auto");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la 2FA
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorUsername, setTwoFactorUsername] = useState("");
  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [isTwoFactorSubmitting, setIsTwoFactorSubmitting] = useState(false);

  // État pour le code OTP avec une case par chiffre
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const otpInputRefs = useRef([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
          console.log("Tokens trouvés, vérification de leur validité...");

          // Tester la validité du token en faisant une requête à une API protégée
          const response = await fetch(
            "https://firekey.theokaszak.fr/api/credentials/",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            // Token valide, rediriger vers le dashboard
            console.log("Token valide, redirection vers le dashboard...");
            navigate("/dashboard", { replace: true });
            enqueueSnackbar("Vous êtes déjà connecté, redirection...", {
              variant: "info",
              anchorOrigin: { vertical: "top", horizontal: "right" },
            });
            return;
          } else if (response.status === 401) {
            // Token expiré, essayer de le rafraîchir
            console.log("Token expiré, tentative de rafraîchissement...");

            const refreshResponse = await fetch(
              "https://firekey.theokaszak.fr/auth/token/refresh/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refresh: refreshToken,
                }),
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();

              // Sauvegarder le nouveau token
              localStorage.setItem("accessToken", refreshData.access);
              if (refreshData.refresh) {
                localStorage.setItem("refreshToken", refreshData.refresh);
              }

              console.log(
                "Token rafraîchi avec succès, redirection vers le dashboard..."
              );
              enqueueSnackbar("Session restaurée, redirection...", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" },
              });
              navigate("/dashboard", { replace: true });
              return;
            } else {
              // Impossible de rafraîchir, nettoyer les tokens
              console.log("Impossible de rafraîchir le token, nettoyage...");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }
          }
        } else {
          console.log("Aucun token trouvé, affichage de la page de connexion");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        // En cas d'erreur réseau, nettoyer les tokens potentiellement corrompus
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate, enqueueSnackbar]);

  // Initialisation des refs pour les champs OTP
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

  // Détection de la hauteur du formulaire pour ajuster la card
  useEffect(() => {
    const updateHeight = () => {
      const loginForm = document.getElementById("login-form");
      const registerForm = document.getElementById("register-form");
      if (loginForm && registerForm) {
        const loginHeight = loginForm.offsetHeight;
        const registerHeight = registerForm.offsetHeight;
        setFormHeight(`${Math.max(loginHeight, registerHeight)}px`);
      }
    };

    // Mise à jour initiale
    setTimeout(updateHeight, 100);
    // Mise à jour lors du redimensionnement
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Effet pour mettre le focus sur le champ actif de l'OTP
  useEffect(() => {
    if (twoFactorRequired && otpInputRefs.current[activeOtpIndex]) {
      otpInputRefs.current[activeOtpIndex].focus();
    }
  }, [activeOtpIndex, twoFactorRequired]);

  // Effet pour soumettre automatiquement le code lorsqu'il est complet
  useEffect(() => {
    const isComplete = otpValues.every((val) => val !== "");
    if (isComplete && twoFactorRequired) {
      handleTwoFactorSubmit();
    }
  }, [otpValues]);

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      enqueueSnackbar("Veuillez remplir tous les champs", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Log pour débogage
      console.log("Tentative de connexion pour:", email);

      // Créer le corps de la requête de façon plus explicite pour le débogage
      const requestBody = {
        username: email,
        password: password,
        remember: rememberMe ? "true" : "false",
      };
      console.log("Corps de la requête login:", JSON.stringify(requestBody));

      const response = await fetch("https://firekey.theokaszak.fr/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      // Afficher le statut et l'URL pour débogage
      console.log(
        "Statut de la réponse de login:",
        response.status,
        response.url
      );

      // Récupérer les données de la réponse
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      // Parser la réponse en JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Données de réponse:", data);
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        throw new Error("Format de réponse du serveur invalide");
      }

      // IMPORTANT: Cette condition a été modifiée pour vérifier d'abord si 2FA est requise
      if (data.require_2fa) {
        // 2FA requise
        console.log("Authentification à deux facteurs requise");
        setTwoFactorRequired(true);
        setTwoFactorUsername(data.username || email);
        setTwoFactorPassword(password);
        setOtpValues(["", "", "", "", "", ""]);
        setActiveOtpIndex(0);
      } else if (response.ok) {
        // Vérifier si nous avons bien les tokens dans la réponse
        if (data.access && data.refresh) {
          // Connexion réussie directement (sans 2FA)
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);

          // Vérifier si les tokens ont bien été stockés
          console.log("Tokens stockés:", {
            access: localStorage.getItem("accessToken"),
            refresh: localStorage.getItem("refreshToken"),
          });

          document.cookie = "loginSuccess=true; path=/";

          enqueueSnackbar("Connexion réussie! Redirection...", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          });

          // Augmenter légèrement le délai avant redirection
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          console.error("Aucun token reçu malgré un statut 200:", data);
          throw new Error(
            "Erreur serveur: tokens d'authentification manquants"
          );
        }
      } else {
        // Erreur spécifique renvoyée par le serveur
        const errorMessage = data.detail || data.error || "Erreur de connexion";
        enqueueSnackbar(errorMessage, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      enqueueSnackbar(err.message || "Impossible de se connecter au serveur", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des entrées OTP individuelles
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // N'accepter que les chiffres
    if (/^[0-9]?$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Si une valeur est saisie, passer au champ suivant
      if (value !== "" && index < 5) {
        setActiveOtpIndex(index + 1);
      }
    }
  };

  // Gestion des entrées OTP lors de la suppression
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpValues[index] === "" && index > 0) {
        // Si le champ est vide et que l'utilisateur appuie sur Backspace, passer au champ précédent
        setActiveOtpIndex(index - 1);

        // Optionnel: effacer aussi la valeur du champ précédent
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveOtpIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveOtpIndex(index + 1);
    }
  };

  // Fonction pour gérer le clic sur un champ OTP
  const handleOtpClick = (index) => {
    setActiveOtpIndex(index);
  };

  // Fonction pour gérer le collage du code complet
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Vérifier que les données collées sont des chiffres et ont la bonne longueur
    if (/^\d{1,6}$/.test(pastedData)) {
      // Remplir les champs avec les chiffres collés
      const newOtpValues = [...otpValues];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtpValues[i] = pastedData[i];
      }
      setOtpValues(newOtpValues);

      // Positionner le focus sur le dernier champ rempli ou le suivant
      const nextIndex = Math.min(pastedData.length, 5);
      setActiveOtpIndex(nextIndex);
    }
  };

  const handleTwoFactorSubmit = async (event) => {
    if (event) event.preventDefault();

    // Assembler le code complet à partir des valeurs individuelles
    const completeCode = otpValues.join("");

    if (completeCode.length !== 6) {
      enqueueSnackbar("Veuillez saisir un code à 6 chiffres", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsTwoFactorSubmitting(true);

    try {
      console.log(
        "Soumission du code 2FA:",
        completeCode,
        "pour l'utilisateur:",
        twoFactorUsername
      );

      // Ajouter des logs pour voir le contenu exact de la requête
      const requestBody = {
        username: twoFactorUsername,
        password: twoFactorPassword,
        code: completeCode,
        remember: rememberMe ? "true" : "false",
      };
      console.log("Corps de la requête 2FA:", JSON.stringify(requestBody));

      // Utiliser le nouvel endpoint spécifique pour la 2FA
      const response = await fetch(
        "https://firekey.theokaszak.fr/auth/two-factor-auth/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Afficher le statut et l'URL pour débogage
      console.log("Statut de la réponse 2FA:", response.status, response.url);
      console.log(
        "Headers de la réponse:",
        Object.fromEntries([...response.headers.entries()])
      );

      // Log de la réponse brute pour débogage
      const responseText = await response.text();
      console.log("Réponse brute 2FA:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Données de réponse 2FA:", data);
      } catch (e) {
        console.error("Erreur de parsing JSON:", e);
        throw new Error("Format de réponse du serveur invalide");
      }

      if (response.ok) {
        // Vérifier si nous avons bien reçu les tokens
        if (!data.access || !data.refresh) {
          throw new Error(
            "Les tokens d'authentification sont manquants dans la réponse"
          );
        }

        // Stocker les tokens explicitement
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Vérifier si les tokens ont bien été stockés
        console.log("Tokens stockés:", {
          access: localStorage.getItem("accessToken"),
          refresh: localStorage.getItem("refreshToken"),
        });

        document.cookie = "loginSuccess=true; path=/";

        enqueueSnackbar("Vérification réussie! Redirection...", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        setTwoFactorRequired(false);

        // Redirection automatique
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Afficher l'erreur précise
        const errorMessage =
          data.error || data.detail || "Erreur de vérification";
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification 2FA:", err);
      enqueueSnackbar(err.message || "Erreur de connexion au serveur", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Réinitialiser les champs OTP en cas d'erreur
      setOtpValues(["", "", "", "", "", ""]);
      setActiveOtpIndex(0);
    } finally {
      setIsTwoFactorSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!email || !password || !confirmPassword) {
      enqueueSnackbar("Veuillez remplir tous les champs", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Les mots de passe ne correspondent pas.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://firekey.theokaszak.fr/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          hashAlgorithm: hashAlgorithm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(
          "Compte créé avec succès, vous pouvez vous connecter.",
          {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "right" },
          }
        );
        setIsFlipped(false);
      } else {
        enqueueSnackbar(data.error || "Erreur lors de l'inscription", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (err) {
      console.error("Erreur requête register:", err);
      enqueueSnackbar("Impossible de se connecter au serveur", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formulaire de login
  const loginForm = (
    <Box
      id="login-form"
      component="form"
      noValidate
      onSubmit={handleLoginSubmit}
    >
      <LogoBox>
        <CustomLogo 
          src="/logo.png"
          alt="FireKey Logo"
          onError={(e) => {
            // Fallback vers l'icône par défaut si l'image ne se charge pas
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <LockPersonIcon 
          sx={{ 
            fontSize: 48, 
            color: "#ff9843", 
            mb: 2, 
            display: 'none' // Caché par défaut, affiché si l'image échoue
          }} 
        />
        <Typography
          variant="h4"
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            background: "linear-gradient(45deg, #ff5722 30%, #ff9800 90%)",
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FireKey
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#b0b0b0", textAlign: "center" }}
        >
          Gestionnaire de mots de passe sécurisé
        </Typography>
      </LogoBox>

      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#ffffff", mb: 3 }}
      >
        Connexion
      </Typography>

      <StyledTextField
        fullWidth
        label="Email"
        name="email"
        placeholder="votre@email.com"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: "#ff9843" }} />
            </InputAdornment>
          ),
        }}
        disabled={isSubmitting}
      />

      <StyledTextField
        fullWidth
        label="Mot de passe"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Votre mot de passe"
        variant="outlined"
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: "#ff9843" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: "#b0b0b0" }}
                disabled={isSubmitting}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            sx={{
              color: "#b0b0b0",
              "&.Mui-checked": { color: "#ff9843" },
            }}
            disabled={isSubmitting}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Se souvenir de moi
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "#ffffff" }} />
        ) : (
          "Se connecter"
        )}
      </StyledButton>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#b0b0b0",
            cursor: "pointer",
            "&:hover": { color: "#ff9843" },
          }}
          onClick={handleToggle}
        >
          Vous n'avez pas de compte ?{" "}
          <span style={{ color: "#ff9843", fontWeight: 500 }}>
            Créer un compte
          </span>
        </Typography>
      </Box>
    </Box>
  );

  // Formulaire d'inscription
  const registerForm = (
    <Box
      id="register-form"
      component="form"
      noValidate
      onSubmit={handleRegisterSubmit}
    >
      <LogoBox>
        <CustomLogo 
          src="/logo.png"
          alt="FireKey Logo"
          onError={(e) => {
            // Fallback vers l'icône par défaut si l'image ne se charge pas
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <SecurityIcon 
          sx={{ 
            fontSize: 48, 
            color: "#ff9843", 
            mb: 2, 
            display: 'none' // Caché par défaut, affiché si l'image échoue
          }} 
        />
        <Typography
          variant="h4"
          sx={{ 
            fontWeight: 700, 
            mb: 1, 
            background: "linear-gradient(45deg, #ff5722 30%, #ff9800 90%)",
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FireKey
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#b0b0b0", textAlign: "center" }}
        >
          Protégez vos mots de passe avec FireKey
        </Typography>
      </LogoBox>

      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#ffffff", mb: 3 }}
      >
        Créer un compte
      </Typography>

      <StyledTextField
        fullWidth
        label="Email"
        name="email"
        placeholder="votre@email.com"
        variant="outlined"
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: "#ff9843" }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Mot de passe"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Choisissez un mot de passe fort"
        variant="outlined"
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: "#ff9843" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: "#b0b0b0" }}
                disabled={isSubmitting}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Confirmer le mot de passe"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirmez votre mot de passe"
        variant="outlined"
        disabled={isSubmitting}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: "#ff9843" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
                sx={{ color: "#b0b0b0" }}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Typography variant="body2" sx={{ mb: 1, color: "#b0b0b0" }}>
        Algorithme de Hachage
      </Typography>
      <StyledSelect
        fullWidth
        value={hashAlgorithm}
        onChange={(e) => setHashAlgorithm(e.target.value)}
        displayEmpty
        disabled={isSubmitting}
        renderValue={(value) => {
          const labels = {
            default: "Default - Recommandé",
            bcrypt: "Bcrypt (SHA256)",
            argon2: "Argon2 - Haute sécurité",
            scrypt: "Scrypt",
            pbkdf2: "PBKDF2 (sha256)",
            pbkdf2sha1: "PBKDF2 (sha1)",
          };
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <KeyIcon sx={{ mr: 1, fontSize: 20, color: "#ff9843" }} />
              <Typography>{labels[value] || value}</Typography>
            </Box>
          );
        }}
      >
        <MenuItem value="default">Default - Recommandé</MenuItem>
        <MenuItem value="bcrypt">Bcrypt (SHA256)</MenuItem>
        <MenuItem value="argon2">Argon2 - Haute sécurité</MenuItem>
        <MenuItem value="scrypt">Scrypt</MenuItem>
        <MenuItem value="pbkdf2">PBKDF2 (sha256)</MenuItem>
        <MenuItem value="pbkdf2sha1">PBKDF2 (sha1)</MenuItem>
      </StyledSelect>

      <StyledButton
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "#ffffff" }} />
        ) : (
          "Créer mon compte"
        )}
      </StyledButton>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            color: "#b0b0b0",
            cursor: "pointer",
            "&:hover": { color: "#ff9843" },
          }}
          onClick={handleToggle}
        >
          Vous avez déjà un compte ?{" "}
          <span style={{ color: "#ff9843", fontWeight: 500 }}>
            Se connecter
          </span>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <LoginContainer>
      <GradientBackground />
      <WaveBox />

      <CardWrapper>
        <CardContainer isFlipped={isFlipped} style={{ height: formHeight }}>
          <CardSide>{loginForm}</CardSide>

          <CardSide back>{registerForm}</CardSide>
        </CardContainer>
      </CardWrapper>

      {/* Dialog de 2FA avec couleurs chaudes */}
      <TwoFactorDialog
        open={twoFactorRequired}
        onClose={() => !isTwoFactorSubmitting && setTwoFactorRequired(false)}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown={isTwoFactorSubmitting}
      >
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <VerifiedUserIcon sx={{ color: "#ff9843" }} />
          Authentification à deux facteurs
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3, mt: 1 }}>
            Veuillez saisir le code à 6 chiffres généré par votre application
            d'authentification.
          </Typography>

          {/* Composant de saisie OTP avec couleurs chaudes */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
            onPaste={handleOtpPaste}
          >
            {otpValues.map((value, index) => (
              <OtpInput
                key={index}
                inputRef={(el) => (otpInputRefs.current[index] = el)}
                active={index === activeOtpIndex}
                value={value}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                onClick={() => handleOtpClick(index)}
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  autoComplete: "off",
                }}
                disabled={isTwoFactorSubmitting}
                variant="outlined"
              />
            ))}
          </Box>

          <Alert
            severity="info"
            sx={{
              backgroundColor: "rgba(255, 152, 67, 0.1)",
              color: "#ff9843",
              "& .MuiAlert-icon": {
                color: "#ff9843",
              },
            }}
          >
            Si vous n'avez pas accès à votre application d'authentification,
            contactez le support.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setTwoFactorRequired(false)}
            color="inherit"
            sx={{
              textTransform: "none",
              color: "#b0b0b0",
            }}
            disabled={isTwoFactorSubmitting}
          >
            Annuler
          </Button>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleTwoFactorSubmit}
            sx={{ mb: 0 }}
            disabled={isTwoFactorSubmitting || otpValues.includes("")}
          >
            {isTwoFactorSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            ) : (
              "Vérifier"
            )}
          </StyledButton>
        </DialogActions>
      </TwoFactorDialog>
    </LoginContainer>
  );
}