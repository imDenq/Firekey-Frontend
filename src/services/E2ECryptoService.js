/**
 * Service de chiffrement E2E côté client - VERSION CORRIGÉE
 * ATTENTION: Ce fichier ne doit PAS importer HybridCredentialService !
 */
class E2ECryptoService {
  constructor() {
    this.masterKey = null;
    this.derivationParams = null;
    this.isInitialized = false;
  }

  /**
   * Initialise le service avec les paramètres utilisateur
   */
  async initialize(password, derivationParams) {
    try {
      console.log("🔐 Initialisation E2ECryptoService...");
      this.derivationParams = derivationParams;
      this.masterKey = await this.deriveMasterKey(password, derivationParams);
      this.isInitialized = this.masterKey !== null;

      console.log(
        this.isInitialized
          ? "✅ E2ECryptoService initialisé"
          : "❌ Échec initialisation E2ECryptoService"
      );

      return {
        success: this.isInitialized,
        masterKey: this.masterKey,
        error: this.isInitialized ? null : "Échec dérivation clé maître",
      };
    } catch (error) {
      console.error("❌ Erreur initialisation E2E:", error);
      return {
        success: false,
        masterKey: null,
        error: error.message,
      };
    }
  }

  /**
   * Configure le chiffrement utilisateur (pour l'activation E2E)
   */
  async setupUserEncryption(password) {
    try {
      console.log("🔧 Configuration du chiffrement utilisateur...");

      const salt = window.crypto.getRandomValues(new Uint8Array(32));
      const searchSalt = window.crypto.getRandomValues(new Uint8Array(32));

      const derivationParams = {
        salt: this.arrayBufferToBase64(salt),
        search_salt: this.arrayBufferToBase64(searchSalt),
        iterations: 100000,
        algorithm: "PBKDF2-SHA256",
      };

      const masterKey = await this.deriveMasterKey(password, derivationParams);

      if (masterKey) {
        return {
          success: true,
          derivationParams: derivationParams,
        };
      } else {
        return {
          success: false,
          error: "Impossible de dériver la clé maître",
        };
      }
    } catch (error) {
      console.error("❌ Erreur configuration chiffrement:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Dérive la clé maître à partir du mot de passe
   */
  async deriveMasterKey(password, params) {
    try {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
      );

      const salt = this.base64ToArrayBuffer(params.salt);

      return await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: params.iterations,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    } catch (error) {
      console.error("❌ Erreur dérivation clé maître:", error);
      return null;
    }
  }

  /**
   * Chiffre des données - CORRIGÉ pour AES-GCM
   */
  async encryptData(plaintext) {
    if (!this.isInitialized) {
      throw new Error("Service E2E non initialisé");
    }

    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes pour GCM

    console.log("🔒 Chiffrement avec AES-GCM...");
    console.log("🔑 IV length:", iv.length);
    console.log("📝 Plaintext:", plaintext || "(vide)");

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128, // 16 bytes
      },
      this.masterKey,
      encoder.encode(plaintext || "")
    );

    // CORRIGÉ: En AES-GCM, le tag est automatiquement ajouté à la fin du ciphertext
    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, -16); // Tout sauf les 16 derniers bytes (tag)
    const tag = encryptedArray.slice(-16); // Les 16 derniers bytes (tag)

    console.log("✅ Chiffrement terminé");
    console.log(
      "📊 Tailles - Ciphertext:",
      ciphertext.length,
      "Tag:",
      tag.length,
      "IV:",
      iv.length
    );

    return {
      ciphertext: this.arrayBufferToBase64(ciphertext),
      iv: this.arrayBufferToBase64(iv),
      tag: this.arrayBufferToBase64(tag),
      algorithm: "AES-256-GCM",
      version: "1.0",
    };
  }

  /**
   * Déchiffre des données - CORRIGÉ pour AES-GCM
   */
  async decryptData(encryptedData) {
    if (!this.isInitialized) {
      throw new Error("Service E2E non initialisé");
    }

    console.log("🔓 Début déchiffrement AES-GCM...");
    console.log("📊 Données reçues:", {
      hasCiphertext: !!encryptedData.ciphertext,
      hasIv: !!encryptedData.iv,
      hasTag: !!encryptedData.tag,
      algorithm: encryptedData.algorithm,
      version: encryptedData.version,
    });

    try {
      const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const tag = this.base64ToArrayBuffer(encryptedData.tag);

      console.log(
        "📏 Tailles après décodage - Ciphertext:",
        ciphertext.byteLength,
        "IV:",
        iv.byteLength,
        "Tag:",
        tag.byteLength
      );

      // CORRIGÉ: Reconstituer le format attendu par WebCrypto (ciphertext + tag)
      const encryptedWithTag = new Uint8Array(
        ciphertext.byteLength + tag.byteLength
      );
      encryptedWithTag.set(new Uint8Array(ciphertext));
      encryptedWithTag.set(new Uint8Array(tag), ciphertext.byteLength);

      console.log("🔄 Tentative de déchiffrement...");

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv),
          tagLength: 128,
        },
        this.masterKey,
        encryptedWithTag
      );

      const result = new TextDecoder().decode(decrypted);
      console.log("✅ Déchiffrement réussi, longueur:", result.length);

      return result;
    } catch (error) {
      console.error("❌ Erreur déchiffrement détaillée:", error);
      console.error("🔍 Type d'erreur:", error.name);
      console.error("🔍 Message:", error.message);
      throw new Error(`Échec du déchiffrement: ${error.message}`);
    }
  }

  /**
   * Génère un hash de recherche
   */
  async generateSearchHash(term) {
    if (!term || !this.derivationParams) return "";

    const normalized = term.toLowerCase().trim();
    const combined = normalized + this.derivationParams.search_salt;

    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(combined)
    );
    return this.arrayBufferToHex(hashBuffer).substring(0, 32);
  }

  /**
   * Chiffre un credential complet
   */
  async encryptCredential(credentialData) {
    console.log("🔐 Début chiffrement credential complet...");

    const encrypted = {};
    const searchHashes = {};

    try {
      if (credentialData.name) {
        console.log("🔒 Chiffrement du nom...");
        encrypted.encrypted_name = await this.encryptData(credentialData.name);
        searchHashes.name = await this.generateSearchHash(credentialData.name);
      }

      if (credentialData.website) {
        console.log("🔒 Chiffrement du site web...");
        encrypted.encrypted_website = await this.encryptData(
          credentialData.website
        );
        searchHashes.website = await this.generateSearchHash(
          credentialData.website
        );
      }

      if (credentialData.email) {
        console.log("🔒 Chiffrement de l'email...");
        encrypted.encrypted_email = await this.encryptData(
          credentialData.email
        );
        searchHashes.email = await this.generateSearchHash(
          credentialData.email
        );
      }

      if (credentialData.password) {
        console.log("🔒 Chiffrement du mot de passe...");
        encrypted.encrypted_password = await this.encryptData(
          credentialData.password
        );
      }

      if (credentialData.note || credentialData.notes) {
        console.log("🔒 Chiffrement des notes...");
        encrypted.encrypted_notes = await this.encryptData(
          credentialData.note || credentialData.notes
        );
      }

      console.log("✅ Chiffrement credential terminé");

      return {
        ...encrypted,
        search_hashes: searchHashes,
        is_sensitive: credentialData.is_sensitive || false,
      };
    } catch (error) {
      console.error("❌ Erreur chiffrement credential:", error);
      throw error;
    }
  }

  /**
   * Parse les données chiffrées qui peuvent être soit des objets JSON soit des chaînes JSON
   */
  parseEncryptedData(encryptedData) {
    if (!encryptedData) {
      console.warn("⚠️ Données chiffrées vides ou undefined");
      return null;
    }

    try {
      let parsed = null;

      // Si c'est déjà un objet, le récupérer directement
      if (typeof encryptedData === "object" && encryptedData !== null) {
        console.log("📦 Données déjà en format objet");
        parsed = encryptedData;
      } else if (typeof encryptedData === "string") {
        // Si c'est une chaîne vide, retourner null
        if (encryptedData.trim() === "") {
          console.log("📄 Chaîne vide détectée");
          return null;
        }

        console.log("📄 Parsing de la chaîne JSON...");
        parsed = JSON.parse(encryptedData);
        console.log("✅ Parsing réussi:", parsed);
      } else {
        console.error("❌ Type de données non supporté:", typeof encryptedData);
        return null;
      }

      // Vérifier que l'objet parsé contient les champs requis avec des valeurs non vides
      if (
        !parsed ||
        !parsed.ciphertext ||
        !parsed.iv ||
        !parsed.tag ||
        parsed.ciphertext.trim() === "" ||
        parsed.iv.trim() === "" ||
        parsed.tag.trim() === ""
      ) {
        console.warn(
          "⚠️ Objet parsé invalide ou avec des champs vides:",
          parsed
        );
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("❌ Erreur parsing des données chiffrées:", error);
      console.log("📄 Données brutes:", encryptedData);
      return null;
    }
  }

  /**
   * Déchiffre un credential complet - CORRIGÉ pour gérer les données JSON
   */
  async decryptCredential(encryptedCredential) {
    console.log("🔓 Début déchiffrement credential complet...");
    console.log("📦 Credential reçu:", encryptedCredential);

    const decrypted = {};

    try {
      if (encryptedCredential.encrypted_name) {
        console.log("🔓 Déchiffrement du nom...");
        const nameData = this.parseEncryptedData(
          encryptedCredential.encrypted_name
        );
        if (nameData) {
          decrypted.name = await this.decryptData(nameData);
        } else {
          console.log("⚠️ Nom: données chiffrées invalides, ignoré");
        }
      }

      if (encryptedCredential.encrypted_website) {
        console.log("🔓 Déchiffrement du site web...");
        const websiteData = this.parseEncryptedData(
          encryptedCredential.encrypted_website
        );
        if (websiteData) {
          decrypted.website = await this.decryptData(websiteData);
        } else {
          console.log("⚠️ Site web: données chiffrées invalides, ignoré");
          decrypted.website = ""; // Valeur par défaut
        }
      }

      if (encryptedCredential.encrypted_email) {
        console.log("🔓 Déchiffrement de l'email...");
        const emailData = this.parseEncryptedData(
          encryptedCredential.encrypted_email
        );
        if (emailData) {
          decrypted.email = await this.decryptData(emailData);
        } else {
          console.log("⚠️ Email: données chiffrées invalides, ignoré");
          decrypted.email = ""; // Valeur par défaut
        }
      }

      if (encryptedCredential.encrypted_password) {
        console.log("🔓 Déchiffrement du mot de passe...");
        const passwordData = this.parseEncryptedData(
          encryptedCredential.encrypted_password
        );
        if (passwordData) {
          decrypted.password = await this.decryptData(passwordData);
        } else {
          console.log("⚠️ Mot de passe: données chiffrées invalides, ignoré");
          decrypted.password = ""; // Valeur par défaut
        }
      }

      if (encryptedCredential.encrypted_notes) {
        console.log("🔓 Déchiffrement des notes...");
        const notesData = this.parseEncryptedData(
          encryptedCredential.encrypted_notes
        );
        if (notesData) {
          decrypted.note = await this.decryptData(notesData);
        } else {
          console.log("⚠️ Notes: données chiffrées invalides, ignoré");
          decrypted.note = ""; // Valeur par défaut
        }
      }

      console.log("✅ Déchiffrement credential terminé");

      return {
        ...decrypted,
        id: encryptedCredential.id,
        is_sensitive: encryptedCredential.is_sensitive,
        created_at: encryptedCredential.created_at,
        updated_at: encryptedCredential.updated_at,
        tags: encryptedCredential.tags || [],
        _isE2E: true,
      };
    } catch (error) {
      console.error("❌ Erreur déchiffrement credential:", error);
      throw error;
    }
  }

  /**
   * Méthode de nettoyage
   */
  destroy() {
    console.log("🧹 Nettoyage E2ECryptoService...");
    this.masterKey = null;
    this.derivationParams = null;
    this.isInitialized = false;
  }

  /**
   * Vérifie si le service est initialisé
   */
  isReady() {
    return this.isInitialized && this.masterKey !== null;
  }

  /**
   * Réinitialise le service
   */
  reset() {
    this.destroy();
  }

  // Utilitaires améliorés
  arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  base64ToArrayBuffer(base64) {
    try {
      // Vérifier que base64 n'est pas undefined ou null
      if (!base64) {
        throw new Error(`Base64 vide ou undefined: ${base64}`);
      }

      // Nettoyer le base64
      let cleanBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");

      // Ajouter du padding si nécessaire
      while (cleanBase64.length % 4) {
        cleanBase64 += "=";
      }

      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error("❌ Erreur décodage Base64:", base64, error);
      throw new Error(`Impossible de décoder le Base64: ${base64}`);
    }
  }

  arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}

export default E2ECryptoService;
