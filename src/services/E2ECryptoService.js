/**
 * Service de chiffrement E2E côté client
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
            this.derivationParams = derivationParams;
            this.masterKey = await this.deriveMasterKey(password, derivationParams);
            this.isInitialized = this.masterKey !== null;
            return this.isInitialized;
        } catch (error) {
            console.error('Erreur initialisation E2E:', error);
            return false;
        }
    }
    
    /**
     * Dérive la clé maître à partir du mot de passe
     */
    async deriveMasterKey(password, params) {
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );
        
        const salt = this.base64ToArrayBuffer(params.salt);
        
        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: params.iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }
    
    /**
     * Chiffre des données
     */
    async encryptData(plaintext) {
        if (!this.isInitialized) {
            throw new Error('Service E2E non initialisé');
        }
        
        const encoder = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            this.masterKey,
            encoder.encode(plaintext || '')
        );
        
        const encryptedArray = new Uint8Array(encrypted);
        const ciphertext = encryptedArray.slice(0, -16);
        const tag = encryptedArray.slice(-16);
        
        return {
            ciphertext: this.arrayBufferToBase64(ciphertext),
            iv: this.arrayBufferToBase64(iv),
            tag: this.arrayBufferToBase64(tag),
            algorithm: 'AES-256-GCM',
            version: '1.0'
        };
    }
    
    /**
     * Déchiffre des données
     */
    async decryptData(encryptedData) {
        if (!this.isInitialized) {
            throw new Error('Service E2E non initialisé');
        }
        
        const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);
        const iv = this.base64ToArrayBuffer(encryptedData.iv);
        const tag = this.base64ToArrayBuffer(encryptedData.tag);
        
        const encryptedWithTag = new Uint8Array(ciphertext.length + tag.length);
        encryptedWithTag.set(ciphertext);
        encryptedWithTag.set(tag, ciphertext.length);
        
        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            this.masterKey,
            encryptedWithTag
        );
        
        return new TextDecoder().decode(decrypted);
    }
    
    /**
     * Génère un hash de recherche
     */
    async generateSearchHash(term) {
        if (!term || !this.derivationParams) return '';
        
        const normalized = term.toLowerCase().trim();
        const combined = normalized + this.derivationParams.search_salt;
        
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(combined));
        return this.arrayBufferToHex(hashBuffer).substring(0, 32);
    }
    
    /**
     * Chiffre un credential complet
     */
    async encryptCredential(credentialData) {
        const encrypted = {};
        const searchHashes = {};
        
        if (credentialData.name) {
            encrypted.encrypted_name = await this.encryptData(credentialData.name);
            searchHashes.name = await this.generateSearchHash(credentialData.name);
        }
        
        if (credentialData.website) {
            encrypted.encrypted_website = await this.encryptData(credentialData.website);
            searchHashes.website = await this.generateSearchHash(credentialData.website);
        }
        
        if (credentialData.email) {
            encrypted.encrypted_email = await this.encryptData(credentialData.email);
            searchHashes.email = await this.generateSearchHash(credentialData.email);
        }
        
        if (credentialData.password) {
            encrypted.encrypted_password = await this.encryptData(credentialData.password);
        }
        
        if (credentialData.note) {
            encrypted.encrypted_notes = await this.encryptData(credentialData.note);
        }
        
        return {
            ...encrypted,
            search_hashes: searchHashes,
            is_sensitive: credentialData.is_sensitive || false
        };
    }
    
    /**
     * Déchiffre un credential complet
     */
    async decryptCredential(encryptedCredential) {
        const decrypted = {};
        
        if (encryptedCredential.encrypted_name) {
            const nameData = typeof encryptedCredential.encrypted_name === 'string' 
                ? JSON.parse(encryptedCredential.encrypted_name) 
                : encryptedCredential.encrypted_name;
            decrypted.name = await this.decryptData(nameData);
        }
        
        if (encryptedCredential.encrypted_website) {
            const websiteData = typeof encryptedCredential.encrypted_website === 'string' 
                ? JSON.parse(encryptedCredential.encrypted_website) 
                : encryptedCredential.encrypted_website;
            decrypted.website = await this.decryptData(websiteData);
        }
        
        if (encryptedCredential.encrypted_email) {
            const emailData = typeof encryptedCredential.encrypted_email === 'string' 
                ? JSON.parse(encryptedCredential.encrypted_email) 
                : encryptedCredential.encrypted_email;
            decrypted.email = await this.decryptData(emailData);
        }
        
        if (encryptedCredential.encrypted_password) {
            const passwordData = typeof encryptedCredential.encrypted_password === 'string' 
                ? JSON.parse(encryptedCredential.encrypted_password) 
                : encryptedCredential.encrypted_password;
            decrypted.password = await this.decryptData(passwordData);
        }
        
        if (encryptedCredential.encrypted_notes) {
            const notesData = typeof encryptedCredential.encrypted_notes === 'string' 
                ? JSON.parse(encryptedCredential.encrypted_notes) 
                : encryptedCredential.encrypted_notes;
            decrypted.notes = await this.decryptData(notesData);
        }
        
        return {
            ...decrypted,
            id: encryptedCredential.id,
            is_sensitive: encryptedCredential.is_sensitive,
            created_at: encryptedCredential.created_at,
            updated_at: encryptedCredential.updated_at,
            _isE2E: true
        };
    }
    
    // Utilitaires
    arrayBufferToBase64(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }
    
    base64ToArrayBuffer(base64) {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
    }
    
    arrayBufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}

export default E2ECryptoService;