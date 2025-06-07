// src/services/HybridCredentialService.js - Version complète et corrigée

import E2ECryptoService from "./E2ECryptoService";

class HybridCredentialService {
  constructor() {
    this.e2eService = new E2ECryptoService();
    this.accessToken = localStorage.getItem("accessToken") || "";

    // État local de session (pas persisté)
    this.sessionState = {
      masterKey: null,
      derivationParams: null,
      e2eUnlocked: false,
      lastStatusCheck: null,
      statusCache: null,
      unlockPromise: null, // NOUVEAU: Pour éviter les doubles modals
    };
  }

  /**
   * Met à jour le token d'accès
   */
  updateAccessToken() {
    this.accessToken = localStorage.getItem("accessToken") || "";
  }

  /**
   * Récupère le statut E2E depuis le backend avec cache
   */
  async getE2EStatus(forceRefresh = false) {
    try {
      // Cache de 30 secondes pour éviter trop de requêtes
      const now = Date.now();
      if (
        !forceRefresh &&
        this.sessionState.statusCache &&
        this.sessionState.lastStatusCheck &&
        now - this.sessionState.lastStatusCheck < 30000
      ) {
        console.log("🎯 Utilisation du cache pour le statut E2E");
        return this.sessionState.statusCache;
      }

      this.updateAccessToken();

      const response = await fetch(
        "https://firekey.theokaszak.fr/auth/users/e2e_status/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("⚠️ Token expiré, nettoyage de la session");
          this.clearSession();
          throw new Error("Token expiré");
        }
        throw new Error("Erreur récupération statut E2E");
      }

      const data = await response.json();
      console.log("🎯 Statut E2E depuis le backend:", data.e2e_status);

      // Mettre en cache
      this.sessionState.statusCache = data.e2e_status;
      this.sessionState.lastStatusCheck = now;

      return data.e2e_status;
    } catch (error) {
      console.error("❌ Erreur récupération statut E2E:", error);
      return {
        available: false,
        enabled: false,
        setup_completed: false,
        activated_at: null,
      };
    }
  }

  /**
   * Récupère les paramètres de dérivation de clé
   */
  async getDerivationParams() {
    try {
      this.updateAccessToken();

      const response = await fetch(
        "https://firekey.theokaszak.fr/api/key-derivation/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur récupération paramètres de dérivation");
      }

      const data = await response.json();
      console.log("🔑 Paramètres de dérivation récupérés:", data);

      return data.derivation_params;
    } catch (error) {
      console.error("❌ Erreur récupération paramètres de dérivation:", error);
      return null;
    }
  }

  /**
   * Initialise le service - VERSION COMPLÈTE
   */
  async initialize(userPassword = null) {
    try {
      console.log("🚀 Initialisation HybridCredentialService...");

      // 1. Récupérer le statut depuis le backend
      const backendStatus = await this.getE2EStatus(true); // Force refresh lors de l'init

      const result = {
        e2eAvailable: backendStatus.available,
        e2eEnabled: backendStatus.enabled,
        e2eUnlocked: false,
        setupCompleted: backendStatus.setup_completed,
        activatedAt: backendStatus.activated_at,
        isNewUser: !backendStatus.setup_completed && !backendStatus.enabled,
      };

      // 2. Si E2E est activé et qu'on a un mot de passe, essayer de débloquer
      if (backendStatus.enabled && userPassword) {
        try {
          console.log(
            "🔑 Tentative de déverrouillage E2E avec mot de passe..."
          );

          // Récupérer les paramètres de dérivation
          const derivationParams = await this.getDerivationParams();

          if (derivationParams) {
            this.sessionState.derivationParams = derivationParams;

            // Initialiser la clé maître pour cette session
            const initResult = await this.e2eService.initialize(
              userPassword,
              this.sessionState.derivationParams
            );

            if (initResult.success) {
              this.sessionState.masterKey = initResult.masterKey;
              this.sessionState.e2eUnlocked = true;
              result.e2eUnlocked = true;
              console.log("✅ E2E débloqué pour cette session");
            } else {
              console.warn("⚠️ Échec déverrouillage E2E:", initResult.error);
            }
          }
        } catch (error) {
          console.error("❌ Erreur déverrouillage E2E:", error);
        }
      }

      // 3. Si E2E est activé mais pas débloqué, récupérer quand même les paramètres
      if (
        backendStatus.enabled &&
        !result.e2eUnlocked &&
        !this.sessionState.derivationParams
      ) {
        try {
          const derivationParams = await this.getDerivationParams();
          if (derivationParams) {
            this.sessionState.derivationParams = derivationParams;
          }
        } catch (error) {
          console.warn(
            "⚠️ Impossible de récupérer les paramètres de dérivation:",
            error
          );
        }
      }

      console.log("🎯 État final après initialisation:", result);
      return result;
    } catch (error) {
      console.error("❌ Erreur initialisation:", error);
      return {
        e2eAvailable: false,
        e2eEnabled: false,
        e2eUnlocked: false,
        setupCompleted: false,
        activatedAt: null,
        isNewUser: false,
      };
    }
  }

  /**
   * Active E2E côté backend
   */
  async activateE2E(userPassword) {
    try {
      console.log("🔐 Activation E2E côté backend...");
      console.log("🔑 Mot de passe fourni:", userPassword ? "OUI" : "NON");

      this.updateAccessToken();

      const payload = {
        user_password: userPassword,
      };

      console.log("📡 Envoi de la requête d'activation E2E...");
      console.log(
        "🎯 URL:",
        "https://firekey.theokaszak.fr/api/credentials-e2e/activate_e2e/"
      );

      const response = await fetch(
        "https://firekey.theokaszak.fr/api/credentials-e2e/activate_e2e/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📨 Réponse reçue, status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Erreur de l'API:", error);
        throw new Error(error.error || error.detail || "Erreur activation E2E");
      }

      const data = await response.json();
      console.log("✅ E2E activé côté backend:", data);

      // Mettre à jour l'état de session
      if (data.derivation_params) {
        this.sessionState.derivationParams = data.derivation_params;

        // Initialiser la clé maître pour cette session
        const initResult = await this.e2eService.initialize(
          userPassword,
          this.sessionState.derivationParams
        );

        if (initResult.success) {
          this.sessionState.masterKey = initResult.masterKey;
          this.sessionState.e2eUnlocked = true;
          console.log("🔓 E2E débloqué pour cette session");
        } else {
          console.warn(
            "⚠️ Impossible de débloquer E2E pour cette session:",
            initResult.error
          );
        }
      }

      // Vider le cache du statut pour forcer un refresh
      this.sessionState.statusCache = null;
      this.sessionState.lastStatusCheck = null;

      console.log("✅ E2E activé avec succès");
      return { success: true, e2eStatus: data.e2e_status, data: data };
    } catch (error) {
      console.error("❌ Erreur activation E2E:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Désactive E2E côté backend
   */
  async deactivateE2E(userPassword) {
    try {
      console.log("🔓 Désactivation E2E côté backend...");

      this.updateAccessToken();

      const response = await fetch(
        "https://firekey.theokaszak.fr/api/credentials-e2e/deactivate_e2e/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            user_password: userPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur désactivation E2E");
      }

      const data = await response.json();

      // Nettoyer l'état de session
      this.clearSession();

      console.log("✅ E2E désactivé avec succès");
      return { success: true, e2eStatus: data.e2e_status };
    } catch (error) {
      console.error("❌ Erreur désactivation E2E:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Nettoie l'état de session
   */
  clearSession() {
    this.sessionState = {
      masterKey: null,
      derivationParams: null,
      e2eUnlocked: false,
      lastStatusCheck: null,
      statusCache: null,
      unlockPromise: null,
    };
  }

  /**
   * Vérifie si E2E est débloqué pour cette session
   */
  isE2EUnlocked() {
    return this.sessionState.e2eUnlocked;
  }

  /**
   * Vérifie si E2E est prêt pour la création de credentials
   */
  isE2EReadyForCreation() {
    return (
      this.sessionState.e2eUnlocked &&
      this.sessionState.masterKey &&
      this.sessionState.derivationParams &&
      this.e2eService.isReady()
    );
  }

  /**
   * Demande le mot de passe pour débloquer E2E dans cette session
   * MODIFIÉ pour éviter les doubles modals
   */
  async unlockE2EForSession() {
    // Si une demande de déverrouillage est déjà en cours, attendre son résultat
    if (this.sessionState.unlockPromise) {
      console.log("🔄 Demande de déverrouillage déjà en cours, attente...");
      return this.sessionState.unlockPromise;
    }

    // Créer une nouvelle promesse de déverrouillage
    this.sessionState.unlockPromise = new Promise((resolve) => {
      console.log("🔓 Ouverture de la modal de déverrouillage E2E");

      // Modal pour demander le mot de passe
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div style="
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background: rgba(0,0,0,0.8); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            background: #1e1e1e; 
            padding: 24px; 
            border-radius: 12px; 
            color: white; 
            max-width: 400px; 
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
          ">
            <h3 style="margin: 0 0 8px 0; color: #90caf9; font-size: 18px; font-weight: 600;">
              🔐 Débloquer E2E
            </h3>
            <p style="margin: 0 0 16px 0; color: #b0b0b0; font-size: 14px; line-height: 1.4;">
              Entrez votre mot de passe pour accéder aux credentials chiffrés de bout en bout.
            </p>
            <input 
              type="password" 
              placeholder="Mot de passe" 
              id="e2e-password-input"
              style="
                width: 100%; 
                padding: 12px; 
                border: 1px solid #444; 
                border-radius: 6px; 
                background: #2a2a2a; 
                color: white; 
                font-size: 16px;
                box-sizing: border-box;
                margin-bottom: 4px;
                outline: none;
                transition: border-color 0.2s;
              "
            />
            <div id="error-message" style="
              color: #f44336; 
              font-size: 12px; 
              margin-bottom: 16px; 
              min-height: 16px;
            "></div>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button 
                id="e2e-cancel-btn"
                style="
                  padding: 8px 16px; 
                  border: 1px solid #666; 
                  border-radius: 6px; 
                  background: transparent; 
                  color: #b0b0b0; 
                  cursor: pointer;
                  font-size: 14px;
                  transition: all 0.2s;
                "
              >
                Annuler
              </button>
              <button 
                id="e2e-unlock-btn"
                style="
                  padding: 8px 16px; 
                  border: none; 
                  border-radius: 6px; 
                  background: #90caf9; 
                  color: #121212; 
                  cursor: pointer; 
                  font-weight: 500;
                  font-size: 14px;
                  transition: all 0.2s;
                "
              >
                Débloquer
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const passwordInput = modal.querySelector("#e2e-password-input");
      const unlockBtn = modal.querySelector("#e2e-unlock-btn");
      const cancelBtn = modal.querySelector("#e2e-cancel-btn");
      const errorMessage = modal.querySelector("#error-message");

      // Styles hover
      unlockBtn.addEventListener("mouseenter", () => {
        unlockBtn.style.background = "#64b5f6";
      });
      unlockBtn.addEventListener("mouseleave", () => {
        unlockBtn.style.background = "#90caf9";
      });

      cancelBtn.addEventListener("mouseenter", () => {
        cancelBtn.style.borderColor = "#888";
        cancelBtn.style.color = "#fff";
      });
      cancelBtn.addEventListener("mouseleave", () => {
        cancelBtn.style.borderColor = "#666";
        cancelBtn.style.color = "#b0b0b0";
      });

      passwordInput.addEventListener("focus", () => {
        passwordInput.style.borderColor = "#90caf9";
      });
      passwordInput.addEventListener("blur", () => {
        passwordInput.style.borderColor = "#444";
      });

      const cleanup = () => {
        document.body.removeChild(modal);
        // IMPORTANT: Réinitialiser la promesse après nettoyage
        this.sessionState.unlockPromise = null;
      };

      const showError = (message) => {
        errorMessage.textContent = message;
        passwordInput.style.borderColor = "#f44336";
      };

      const clearError = () => {
        errorMessage.textContent = "";
        passwordInput.style.borderColor = "#444";
      };

      const handleUnlock = async () => {
        const password = passwordInput.value.trim();
        if (!password) {
          showError("Veuillez entrer votre mot de passe");
          return;
        }

        clearError();
        unlockBtn.textContent = "Déverrouillage...";
        unlockBtn.disabled = true;

        try {
          // Initialiser la clé maître pour cette session
          const initResult = await this.e2eService.initialize(
            password,
            this.sessionState.derivationParams
          );

          if (initResult.success) {
            this.sessionState.masterKey = initResult.masterKey;
            this.sessionState.e2eUnlocked = true;
            console.log("✅ E2E débloqué avec succès");
            cleanup();
            resolve({ success: true });
          } else {
            showError("Mot de passe incorrect");
            unlockBtn.textContent = "Débloquer";
            unlockBtn.disabled = false;
            passwordInput.focus();
          }
        } catch (error) {
          console.error("Erreur déverrouillage:", error);
          showError("Erreur lors du déverrouillage");
          unlockBtn.textContent = "Débloquer";
          unlockBtn.disabled = false;
          passwordInput.focus();
        }
      };

      const handleCancel = () => {
        console.log("❌ Déverrouillage E2E annulé");
        cleanup();
        resolve({ success: false, cancelled: true });
      };

      unlockBtn.addEventListener("click", handleUnlock);
      cancelBtn.addEventListener("click", handleCancel);

      passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          handleUnlock();
        }
      });

      // Focus et sélection
      passwordInput.focus();
    });

    return this.sessionState.unlockPromise;
  }

  /**
   * Récupère tous les credentials (E2E + Legacy)
   * MODIFIÉ pour éviter les doubles appels
   */
  async getAllCredentials() {
    const results = {
      e2e: [],
      legacy: [],
    };

    try {
      this.updateAccessToken();

      console.log("📥 Récupération des credentials...");

      // 1. Toujours récupérer les credentials legacy
      try {
        const legacyResponse = await fetch(
          "https://firekey.theokaszak.fr/api/credentials/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (legacyResponse.ok) {
          results.legacy = await legacyResponse.json();
          console.log(
            `📦 ${results.legacy.length} credentials legacy récupérés`
          );
        } else if (legacyResponse.status !== 401) {
          console.warn(
            "⚠️ Erreur récupération credentials legacy:",
            legacyResponse.status
          );
        }
      } catch (error) {
        console.warn("⚠️ Erreur récupération credentials legacy:", error);
      }

      // 2. Récupérer le statut E2E
      const e2eStatus = await this.getE2EStatus();

      if (e2eStatus.enabled) {
        console.log("🔐 E2E activé, vérification du déverrouillage...");

        // S'assurer qu'on a les paramètres de dérivation
        if (!this.sessionState.derivationParams) {
          const derivationParams = await this.getDerivationParams();
          if (derivationParams) {
            this.sessionState.derivationParams = derivationParams;
          } else {
            console.error(
              "❌ Impossible de récupérer les paramètres de dérivation"
            );
            return results;
          }
        }

        // Si E2E n'est pas débloqué pour cette session, demander le mot de passe
        // MODIFIÉ: Vérifier aussi si une promesse est en cours
        if (
          !this.sessionState.e2eUnlocked &&
          !this.sessionState.unlockPromise
        ) {
          console.log("🔑 E2E non débloqué, demande du mot de passe...");

          const unlockResult = await this.unlockE2EForSession();
          if (!unlockResult.success) {
            console.log("❌ Déverrouillage E2E annulé ou échoué");
            return results;
          }
        }

        // Si E2E est débloqué, récupérer les credentials E2E
        if (this.sessionState.e2eUnlocked) {
          try {
            const e2eResponse = await fetch(
              "https://firekey.theokaszak.fr/api/credentials-e2e/",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.accessToken}`,
                },
              }
            );

            if (e2eResponse.ok) {
              const encryptedCredentials = await e2eResponse.json();
              console.log(
                `🔐 ${encryptedCredentials.length} credentials E2E récupérés`
              );

              // Déchiffrer les credentials E2E
              results.e2e = await Promise.all(
                encryptedCredentials.map(async (cred) => {
                  try {
                    const decrypted = await this.e2eService.decryptCredential(
                      cred
                    );
                    return {
                      ...decrypted,
                      id: cred.id,
                      created_at: cred.created_at,
                      updated_at: cred.updated_at,
                      is_sensitive: cred.is_sensitive,
                      unlocked: true, // Les credentials E2E sont déjà déchiffrés
                    };
                  } catch (error) {
                    console.error(
                      `❌ Erreur déchiffrement credential E2E ${cred.id}:`,
                      error
                    );
                    return {
                      id: cred.id,
                      name: "❌ Erreur de déchiffrement",
                      website: "",
                      email: "",
                      password: "",
                      note: "Ce credential n'a pas pu être déchiffré. Vérifiez votre mot de passe.",
                      is_sensitive: false,
                      created_at: cred.created_at,
                      updated_at: cred.updated_at,
                      unlocked: false,
                      tags: [],
                    };
                  }
                })
              );
            } else if (e2eResponse.status === 403) {
              const errorData = await e2eResponse.json();
              console.warn("⚠️ E2E non autorisé:", errorData);
            } else {
              console.warn(
                "⚠️ Erreur récupération credentials E2E:",
                e2eResponse.status
              );
            }
          } catch (error) {
            console.error("❌ Erreur récupération credentials E2E:", error);
          }
        }
      }

      console.log(
        `✅ Total récupéré: ${results.legacy.length} legacy + ${results.e2e.length} E2E`
      );
      return results;
    } catch (error) {
      console.error("❌ Erreur générale récupération credentials:", error);
      return results;
    }
  }

  /**
   * Sauvegarde un credential en mode E2E avec vérifications
   */
  async saveCredentialE2E(credentialData) {
    console.log("💾 Tentative de sauvegarde E2E...");
    console.log("🔐 État de la session:", {
      e2eUnlocked: this.sessionState.e2eUnlocked,
      hasMasterKey: !!this.sessionState.masterKey,
      hasDerivationParams: !!this.sessionState.derivationParams,
      serviceReady: this.e2eService.isReady(),
    });

    // Si E2E n'est pas débloqué, essayer de le débloquer
    if (!this.sessionState.e2eUnlocked) {
      console.log("🔑 E2E non débloqué, tentative de déverrouillage...");

      // S'assurer qu'on a les paramètres de dérivation
      if (!this.sessionState.derivationParams) {
        const derivationParams = await this.getDerivationParams();
        if (derivationParams) {
          this.sessionState.derivationParams = derivationParams;
        } else {
          throw new Error(
            "Impossible de récupérer les paramètres de dérivation E2E"
          );
        }
      }

      // Demander le déverrouillage
      const unlockResult = await this.unlockE2EForSession();
      if (!unlockResult.success) {
        throw new Error("Déverrouillage E2E annulé ou échoué");
      }
    }

    // Vérifier que E2E est maintenant prêt
    if (!this.isE2EReadyForCreation()) {
      console.error("❌ E2E non prêt après tentative de déverrouillage");
      throw new Error("E2E non prêt pour la création. Veuillez réessayer.");
    }

    try {
      console.log("🔒 Chiffrement du credential côté client...");

      // Chiffrer le credential côté client
      const encrypted = await this.e2eService.encryptCredential(credentialData);
      console.log("✅ Credential chiffré côté client");

      this.updateAccessToken();

      const response = await fetch(
        "https://firekey.theokaszak.fr/api/credentials-e2e/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify(encrypted),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Erreur API:", error);
        throw new Error(error.detail || error.error || "Erreur sauvegarde E2E");
      }

      const savedCredential = await response.json();
      console.log("✅ Credential E2E sauvegardé:", savedCredential.id);

      return { success: true, type: "e2e", data: savedCredential };
    } catch (error) {
      console.error("❌ Erreur sauvegarde E2E:", error);
      throw error;
    }
  }

  /**
   * Sauvegarde un credential en mode Legacy
   */
  async saveCredentialLegacy(credentialData) {
    try {
      console.log("💾 Sauvegarde credential Legacy...");

      this.updateAccessToken();

      const response = await fetch("https://firekey.theokaszak.fr/api/credentials/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(credentialData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.detail || error.error || "Erreur sauvegarde Legacy"
        );
      }

      const savedCredential = await response.json();
      console.log("✅ Credential Legacy sauvegardé:", savedCredential.id);

      return { success: true, type: "legacy", data: savedCredential };
    } catch (error) {
      console.error("❌ Erreur sauvegarde Legacy:", error);
      throw error;
    }
  }

  /**
   * Met à jour un credential (détecte automatiquement le type)
   */
  async updateCredential(credentialId, credentialData, isE2E = false) {
    try {
      console.log(
        `🔄 Mise à jour credential ${isE2E ? "E2E" : "Legacy"}:`,
        credentialId
      );

      this.updateAccessToken();

      let endpoint, body;

      if (isE2E) {
        if (!this.sessionState.e2eUnlocked) {
          throw new Error("E2E non débloqué pour cette session");
        }

        // Pour E2E, chiffrer les données si nécessaire
        if (
          credentialData.password ||
          credentialData.name ||
          credentialData.website
        ) {
          body = await this.e2eService.encryptCredential(credentialData);
        } else {
          body = credentialData;
        }

        endpoint = `https://firekey.theokaszak.fr/api/credentials-e2e/${credentialId}/`;
      } else {
        endpoint = `https://firekey.theokaszak.fr/api/credentials/${credentialId}/`;
        body = credentialData;
      }

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || "Erreur mise à jour");
      }

      const updatedCredential = await response.json();
      console.log("✅ Credential mis à jour:", updatedCredential.id);

      return {
        success: true,
        type: isE2E ? "e2e" : "legacy",
        data: updatedCredential,
      };
    } catch (error) {
      console.error("❌ Erreur mise à jour credential:", error);
      throw error;
    }
  }

  /**
   * Supprime un credential (détecte automatiquement le type)
   */
  async deleteCredential(credentialId, isE2E = false) {
    try {
      console.log(
        `🗑️ Suppression credential ${isE2E ? "E2E" : "Legacy"}:`,
        credentialId
      );

      this.updateAccessToken();

      const endpoint = isE2E
        ? `https://firekey.theokaszak.fr/api/credentials-e2e/${credentialId}/`
        : `https://firekey.theokaszak.fr/api/credentials/${credentialId}/`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || "Erreur suppression");
      }

      console.log("✅ Credential supprimé:", credentialId);
      return { success: true, type: isE2E ? "e2e" : "legacy" };
    } catch (error) {
      console.error("❌ Erreur suppression credential:", error);
      throw error;
    }
  }

  /**
   * Recherche dans les credentials E2E (recherche chiffrée)
   */
  async searchE2ECredentials(query) {
    if (!this.sessionState.e2eUnlocked) {
      throw new Error("E2E non débloqué pour cette session");
    }

    try {
      this.updateAccessToken();

      const response = await fetch(
        `https://firekey.theokaszak.fr/api/credentials-e2e/search/?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || "Erreur recherche E2E");
      }

      const data = await response.json();

      // Déchiffrer les résultats
      const decryptedResults = await Promise.all(
        data.results.map(async (cred) => {
          try {
            const decrypted = await this.e2eService.decryptCredential(cred);
            return {
              ...decrypted,
              id: cred.id,
              created_at: cred.created_at,
              updated_at: cred.updated_at,
              is_sensitive: cred.is_sensitive,
            };
          } catch (error) {
            console.error("Erreur déchiffrement résultat de recherche:", error);
            return null;
          }
        })
      );

      return decryptedResults.filter((result) => result !== null);
    } catch (error) {
      console.error("❌ Erreur recherche E2E:", error);
      throw error;
    }
  }

  /**
   * Migre un credential legacy vers E2E
   */
  async migrateCredentialToE2E(legacyCredentialId, credentialData) {
    if (!this.sessionState.e2eUnlocked) {
      throw new Error("E2E non débloqué pour cette session");
    }

    try {
      console.log("🔄 Migration credential vers E2E:", legacyCredentialId);

      // Chiffrer les données
      const encryptedData = await this.e2eService.encryptCredential(
        credentialData
      );

      this.updateAccessToken();

      const response = await fetch(
        "https://firekey.theokaszak.fr/api/credentials-e2e/migrate_from_legacy/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: JSON.stringify({
            legacy_credential_id: legacyCredentialId,
            encrypted_data: encryptedData.encrypted_data,
            search_hashes: encryptedData.search_hashes,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || "Erreur migration E2E");
      }

      const result = await response.json();
      console.log("✅ Migration réussie:", result);

      return { success: true, e2eCredential: result.e2e_credential };
    } catch (error) {
      console.error("❌ Erreur migration E2E:", error);
      throw error;
    }
  }

  /**
   * Obtient les statistiques de credentials
   */
  async getCredentialStats() {
    try {
      const allCredentials = await this.getAllCredentials();

      const stats = {
        total: allCredentials.e2e.length + allCredentials.legacy.length,
        e2eCount: allCredentials.e2e.length,
        legacyCount: allCredentials.legacy.length,
        e2ePercentage: 0,
      };

      if (stats.total > 0) {
        stats.e2ePercentage = Math.round((stats.e2eCount / stats.total) * 100);
      }

      return stats;
    } catch (error) {
      console.error("❌ Erreur récupération statistiques:", error);
      return {
        total: 0,
        e2eCount: 0,
        legacyCount: 0,
        e2ePercentage: 0,
      };
    }
  }

  /**
   * Utilitaire pour déterminer si un credential est E2E
   */
  isE2ECredential(credential) {
    return (
      credential._source === "e2e" ||
      credential.encrypted_name !== undefined ||
      credential.algorithm !== undefined
    );
  }

  /**
   * Nettoie complètement le service (logout)
   */
  destroy() {
    console.log("🧹 Nettoyage HybridCredentialService...");
    this.clearSession();
    this.accessToken = "";
    if (this.e2eService && typeof this.e2eService.destroy === "function") {
      this.e2eService.destroy();
    }
  }
}

export default HybridCredentialService;
