// src/pages/Login.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function AuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hashAlgorithm, setHashAlgorithm] = useState("default"); // <-- Pour le register
  const [rememberMe, setRememberMe] = useState(false); // <-- Pour le login
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  // Soumission du formulaire de Login
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // On envoie "remember" en plus, selon la checkbox
      const response = await fetch("http://localhost:8001/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
          remember: rememberMe ? "true" : "false",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // data contient { access, refresh } si on utilise le TokenObtainPairView custom
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        document.cookie = "loginSuccess=true; path=/";
        navigate("/dashboard");
      } else {
        enqueueSnackbar(data.detail || data.error || "Erreur de connexion", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Erreur requête login:", err);
      enqueueSnackbar("Impossible de se connecter au serveur", {
        variant: "error",
      });
    }
  };

  // Soumission du formulaire d'inscription
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      enqueueSnackbar("Les mots de passe ne correspondent pas.", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          hashAlgorithm: hashAlgorithm, // <-- On envoie l’algo choisi
        }),
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(
          "Compte créé avec succès, vous pouvez vous connecter.",
          { variant: "success" }
        );
        setIsFlipped(false);
      } else {
        enqueueSnackbar(data.error || "Erreur lors de l’inscription", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Erreur requête register:", err);
      enqueueSnackbar("Impossible de se connecter au serveur", {
        variant: "error",
      });
    }
  };

  // Formulaire de login
  const loginForm = (
    <Box component="form" noValidate onSubmit={handleLoginSubmit}>
      <Typography variant="h5" align="center" sx={{ color: "white", mb: 3 }}>
        Connexion
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Email
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="email"
        placeholder="votre@email.com"
        sx={textFieldStyle}
      />
      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Password
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="password"
        type="password"
        placeholder="••••••••••••••••"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ width: 24 }} />
            </InputAdornment>
          ),
        }}
        sx={textFieldStyle}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            sx={{
              color: "#8b949e",
              "&.Mui-checked": { color: "#58a6ff" },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: "#8b949e" }}>
            Remember me
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      <Button type="submit" fullWidth variant="contained" sx={buttonStyle}>
        Sign in
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ color: "#8b949e", cursor: "pointer" }}
        onClick={handleToggle}
      >
        Don't have an account? Sign up
      </Typography>
    </Box>
  );

  // Formulaire d'inscription
  const registerForm = (
    <Box component="form" noValidate onSubmit={handleRegisterSubmit}>
      <Typography variant="h5" align="center" sx={{ color: "white", mb: 3 }}>
        Create Account
      </Typography>

      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Email
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="email"
        placeholder="votre@email.com"
        sx={textFieldStyle}
      />

      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Password
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="password"
        type="password"
        placeholder="••••••••••••••••"
        sx={textFieldStyle}
      />

      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Confirm Password
      </Typography>
      <TextField
        fullWidth
        size="small"
        name="confirmPassword"
        type="password"
        placeholder="••••••••••••••••"
        sx={{ ...textFieldStyle, mb: 2 }}
      />

      {/* Sélecteur de l’algorithme de hachage */}
      <Typography variant="body2" sx={{ mb: 1, color: "#8b949e" }}>
        Hash Algorithm
      </Typography>
      <Select
        fullWidth
        size="small"
        value={hashAlgorithm}
        onChange={(e) => setHashAlgorithm(e.target.value)}
        sx={{ ...textFieldStyle, mb: 2 }}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="bcrypt">Bcrypt (SHA256)</MenuItem>
        <MenuItem value="argon2">Argon2</MenuItem>
        <MenuItem value="scrypt">Scrypt</MenuItem>
        <MenuItem value="pbkdf2">PBKDF2 (sha256)</MenuItem>
        <MenuItem value="pbkdf2sha1">PBKDF2 (sha1)</MenuItem>
      </Select>

      <Button type="submit" fullWidth variant="contained" sx={buttonStyle}>
        Register
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 3, color: "#8b949e", cursor: "pointer" }}
        onClick={handleToggle}
      >
        Already have an account? Sign in
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d1117",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "1100px",
          height: "900px",
          backgroundColor: "rgba(88,166,255,0.06)",
          borderRadius: "55%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box sx={{ perspective: "1000px", position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            position: "relative",
            width: "500px",
            minHeight: "450px",
            transformStyle: "preserve-3d",
            transition: "transform 0.8s",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(22,27,34,0.85)",
              borderRadius: "8px",
              color: "white",
              position: "absolute",
              top: 0,
              left: 0,
              backfaceVisibility: "hidden",
            }}
          >
            {loginForm}
          </Paper>

          <Paper
            sx={{
              p: 4,
              width: "100%",
              // Retirer "height: '100%'" ici aussi
              backgroundColor: "rgba(22,27,34,0.85)",
              borderRadius: "8px",
              color: "white",
              position: "absolute",
              top: 0,
              left: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {registerForm}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

// Styles factices
const textFieldStyle = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#30363d" },
    "&:hover fieldset": { borderColor: "#8b949e" },
    "&.Mui-focused fieldset": { borderColor: "#58a6ff" },
    backgroundColor: "#0d1117",
    color: "white",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#4d5566",
  },
};

const buttonStyle = {
  mb: 1,
  backgroundColor: "white",
  color: "black",
  textTransform: "none",
  "&:hover": { backgroundColor: "#f0f0f0" },
};
