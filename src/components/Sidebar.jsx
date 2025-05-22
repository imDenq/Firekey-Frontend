// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
  useTheme,
  alpha,
  ListItemButton,
} from "@mui/material";
import {
  Password as PasswordIcon,
  History as HistoryIcon,
  Category as CategoryIcon,
  Share as ShareIcon,
  Lock as LockIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Fingerprint as FingerprintIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Styled components
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  marginBottom: 4,
  padding: "10px 16px",
  borderRadius: 8,
  marginLeft: 8,
  marginRight: 8,
  position: "relative",
  backgroundColor: active ? alpha("#90caf9", 0.15) : "transparent",
  "&:hover": {
    backgroundColor: alpha("#90caf9", 0.08),
  },
  "&::before": active
    ? {
        content: '""',
        position: "absolute",
        left: -8,
        top: "50%",
        transform: "translateY(-50%)",
        height: "60%",
        width: 4,
        backgroundColor: "#90caf9",
        borderRadius: "0 4px 4px 0",
      }
    : {},
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 40,
  color: "#b0b0b0",
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 5,
    top: 5,
    border: "2px solid #121212", // Correction ici: guillemets autour de la couleur
    padding: "0 4px",
  },
}));

export default function Sidebar({ drawerWidth = 240 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openTools, setOpenTools] = useState(false);
  const [credentialsCount, setCredentialsCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("/default_profile.png");

  // Charger le nombre de credentials au chargement du composant
  useEffect(() => {
    fetchCredentialsCount();
    fetchUserInfo();
  }, []);

  // Récupérer le nombre de credentials
  const fetchCredentialsCount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await fetch("http://localhost:8001/api/credentials/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Impossible de récupérer les credentials");
      }

      const data = await res.json();
      setCredentialsCount(data.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des credentials:", error);
    }
  };

  // Récupérer les informations de l'utilisateur
  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const res = await fetch("http://localhost:8001/auth/users/me/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Impossible de récupérer les informations utilisateur");
      }

      const data = await res.json();

      // Mettre à jour le nom d'utilisateur (utiliser fullName s'il existe, sinon username)
      setUserName(data.profile?.fullName || data.username || "Utilisateur");

      // Mettre à jour la photo de profil si elle existe
      if (data.profile?.profile_pic) {
        setProfilePic(data.profile.profile_pic);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
    }
  };

  const handleToggleTools = () => {
    setOpenTools(!openTools);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Check if menu item is active based on current location
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#121212",
          color: "white",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          padding: "20px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "white",
              fontWeight: 800,
              background: "linear-gradient(45deg,rgb(202, 25, 25) 17%,rgb(201, 122, 57) 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            FireKey™
          </Typography>
          
          <Typography
            variant="caption"
            fontWeight={100}
            sx={{ color: "#b0b0b0", letterSpacing: "0.3px" }}
          >
            GESTIONNAIRE DE MOTS DE PASSE
          </Typography>
        </Box>
      </Toolbar>

      {/* User profile summary */}
      <Box sx={{ padding: "16px", display: "flex", alignItems: "center" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          color="success"
        >
          <Avatar alt="User" src={profilePic} sx={{ width: 40, height: 40 }} />
        </StyledBadge>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
            Plan Gratuit
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", mx: 2, my: 1 }}
      />

      {/* Navigation List */}
      <Box sx={{ overflow: "auto", px: 1, py: 1, flexGrow: 1 }}>
        <List component="nav" disablePadding>
          <StyledListItemButton
            active={isActive("/dashboard") ? 1 : 0}
            onClick={() => handleNavigation("/dashboard")}
          >
            <StyledListItemIcon>
              <DashboardIcon
                sx={{ color: isActive("/dashboard") ? "#90caf9" : "#b0b0b0" }}
              />
            </StyledListItemIcon>
            <ListItemText
              primary="Tableau de bord"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive("/dashboard") ? 600 : 400,
                color: isActive("/dashboard") ? "#ffffff" : "#e0e0e0",
              }}
            />
          </StyledListItemButton>

          <StyledListItemButton
            active={isActive("/credentials") ? 1 : 0}
            onClick={() => handleNavigation("/credentials")}
          >
            <StyledListItemIcon>
              <LockIcon
                sx={{ color: isActive("/credentials") ? "#90caf9" : "#b0b0b0" }}
              />
            </StyledListItemIcon>
            <ListItemText
              primary="Credentials"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive("/credentials") ? 600 : 400,
                color: isActive("/credentials") ? "#ffffff" : "#e0e0e0",
              }}
            />
            {credentialsCount > 0 && (
              <StyledBadge
                badgeContent={credentialsCount}
                color="primary"
                sx={{ ml: 2, mb: 1.5 }}
              />
            )}
          </StyledListItemButton>

          <StyledListItemButton
            active={isActive("/shares") ? 1 : 0}
            onClick={() => handleNavigation("/shares")}
          >
            <StyledListItemIcon>
              <ShareIcon
                sx={{ color: isActive("/shares") ? "#90caf9" : "#b0b0b0" }}
              />
            </StyledListItemIcon>
            <ListItemText
              primary="Partages"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive("/shares") ? 600 : 400,
                color: isActive("/shares") ? "#ffffff" : "#e0e0e0",
              }}
            />
          </StyledListItemButton>

          <StyledListItemButton
            active={isActive("/notifications") ? 1 : 0}
            onClick={() => handleNavigation("/notifications")}
          >
            <StyledListItemIcon>
              <CategoryIcon
                sx={{ color: isActive("/notifications") ? "#90caf9" : "#b0b0b0" }}
              />
            </StyledListItemIcon>
            <ListItemText
              primary="Notifications"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive("/notifications") ? 600 : 400,
                color: isActive("/notifications") ? "#ffffff" : "#e0e0e0",
              }}
            />
          </StyledListItemButton>

          {/* Tools section collapsible */}
          <StyledListItemButton onClick={handleToggleTools}>
            <StyledListItemIcon>
              <SecurityIcon sx={{ color: openTools ? "#90caf9" : "#b0b0b0" }} />
            </StyledListItemIcon>
            <ListItemText
              primary="Outils de sécurité"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: openTools ? 600 : 400,
                color: openTools ? "#ffffff" : "#e0e0e0",
              }}
            />
            {openTools ? (
              <ExpandLessIcon sx={{ color: "#b0b0b0" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "#b0b0b0" }} />
            )}
          </StyledListItemButton>

          <Collapse in={openTools} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <StyledListItemButton
                active={isActive("/audit") ? 1 : 0}
                onClick={() => handleNavigation("/audit")}
                sx={{ pl: 5 }}
              >
                <StyledListItemIcon sx={{ minWidth: 32 }}>
                  <HistoryIcon
                    sx={{
                      color: isActive("/audit") ? "#90caf9" : "#b0b0b0",
                      fontSize: 20,
                    }}
                  />
                </StyledListItemIcon>
                <ListItemText
                  primary="Audit & Historique"
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isActive("/audit") ? 600 : 400,
                    color: isActive("/audit") ? "#ffffff" : "#e0e0e0",
                  }}
                />
              </StyledListItemButton>

              <StyledListItemButton
                active={isActive("/import-export") ? 1 : 0}
                onClick={() => handleNavigation("/import-export")}
                sx={{ pl: 5 }}
              >
                <StyledListItemIcon sx={{ minWidth: 32 }}>
                  <ExitToAppIcon
                    sx={{
                      color: isActive("/import-export") ? "#90caf9" : "#b0b0b0",
                      fontSize: 20,
                    }}
                  />
                </StyledListItemIcon>
                <ListItemText
                  primary="Import/Export"
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isActive("/import-export") ? 600 : 400,
                    color: isActive("/import-export") ? "#ffffff" : "#e0e0e0",
                  }}
                />
              </StyledListItemButton>

              <StyledListItemButton
                active={isActive("/password-health") ? 1 : 0}
                onClick={() => handleNavigation("/password-health")}
                sx={{ pl: 5 }}
              >
                <StyledListItemIcon sx={{ minWidth: 32 }}>
                  <FingerprintIcon
                    sx={{
                      color: isActive("/password-health")
                        ? "#90caf9"
                        : "#b0b0b0",
                      fontSize: 20,
                    }}
                  />
                </StyledListItemIcon>
                <ListItemText
                  primary="Santé des mots de passe"
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: isActive("/password-health") ? 600 : 400,
                    color: isActive("/password-health") ? "#ffffff" : "#e0e0e0",
                  }}
                />
              </StyledListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Bottom section with account and settings */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <StyledListItemButton
          active={isActive("/profile") ? 1 : 0}
          onClick={() => handleNavigation("/profile")}
        >
          <StyledListItemIcon>
            <PersonOutlineIcon
              sx={{ color: isActive("/profile") ? "#90caf9" : "#b0b0b0" }}
            />
          </StyledListItemIcon>
          <ListItemText
            primary="Mon Compte"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive("/profile") ? 600 : 400,
              color: isActive("/profile") ? "#ffffff" : "#e0e0e0",
            }}
          />
        </StyledListItemButton>

        <StyledListItemButton
          active={isActive("/settings") ? 1 : 0}
          onClick={() => handleNavigation("/profile")}
        >
          <StyledListItemIcon>
            <SettingsIcon
              sx={{ color: isActive("/settings") ? "#90caf9" : "#b0b0b0" }}
            />
          </StyledListItemIcon>
          <ListItemText
            primary="Paramètres"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive("/settings") ? 600 : 400,
              color: isActive("/settings") ? "#ffffff" : "#e0e0e0",
            }}
          />
        </StyledListItemButton>
      </Box>
    </Drawer>
  );
}
