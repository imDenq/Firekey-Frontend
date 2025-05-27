import E2ECryptoService from './E2ECryptoService';

/**
 * Service qui gère l'ancien et le nouveau système
 */
class HybridCredentialService {
    constructor() {
        this.e2eService = new E2ECryptoService();
        this.e2eEnabled = false;
        this.accessToken = localStorage.getItem("accessToken") || "";
    }
    
    /**
     * Initialise le service hybride
     */
    async initialize(userPassword = null) {
        try {
            // Vérifier si E2E est disponible
            const response = await fetch("http://localhost:8001/api/key-derivation/", {
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.derivation_params && userPassword) {
                    this.e2eEnabled = await this.e2eService.initialize(
                        userPassword, 
                        data.derivation_params
                    );
                }
                
                return {
                    e2eAvailable: !!data.derivation_params,
                    e2eEnabled: this.e2eEnabled,
                    isNewUser: data.is_new
                };
            }
        } catch (error) {
            console.warn('E2E non disponible:', error);
        }
        
        return {
            e2eAvailable: false,
            e2eEnabled: false,
            isNewUser: false
        };
    }
    
    /**
     * Sauvegarde un credential (E2E si possible, sinon legacy)
     */
    async saveCredential(credentialData) {
        if (this.e2eEnabled) {
            return await this.saveCredentialE2E(credentialData);
        } else {
            return await this.saveCredentialLegacy(credentialData);
        }
    }
    
    /**
     * Sauvegarde E2E
     */
    async saveCredentialE2E(credentialData) {
        const encryptedData = await this.e2eService.encryptCredential(credentialData);
        
        const response = await fetch("http://localhost:8001/api/credentials-e2e/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(encryptedData)
        });
        
        if (!response.ok) {
            throw new Error("Erreur sauvegarde E2E");
        }
        
        return {
            success: true,
            credential: await response.json(),
            type: 'e2e'
        };
    }
    
    /**
     * Sauvegarde legacy
     */
    async saveCredentialLegacy(credentialData) {
        const response = await fetch("http://localhost:8001/api/credentials/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: credentialData.name,
                website: credentialData.website,
                email: credentialData.email,
                password: credentialData.password,
                note: credentialData.note,
                is_sensitive: credentialData.is_sensitive,
                tag_ids: credentialData.tag_ids || []
            })
        });
        
        if (!response.ok) {
            throw new Error("Erreur sauvegarde legacy");
        }
        
        return {
            success: true,
            credential: await response.json(),
            type: 'legacy'
        };
    }
    
    /**
     * Récupère tous les credentials
     */
    async getAllCredentials() {
        const results = {
            e2e: [],
            legacy: [],
            total: 0
        };
        
        // Credentials legacy
        try {
            const legacyResponse = await fetch("http://localhost:8001/api/credentials/", {
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (legacyResponse.ok) {
                results.legacy = await legacyResponse.json();
            }
        } catch (error) {
            console.warn('Erreur récupération legacy:', error);
        }
        
        // Credentials E2E
        if (this.e2eEnabled) {
            try {
                const e2eResponse = await fetch("http://localhost:8001/api/credentials-e2e/", {
                    headers: {
                        "Authorization": `Bearer ${this.accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                
                if (e2eResponse.ok) {
                    const encryptedCredentials = await e2eResponse.json();
                    
                    for (const encryptedCred of encryptedCredentials) {
                        try {
                            const decrypted = await this.e2eService.decryptCredential(encryptedCred);
                            results.e2e.push(decrypted);
                        } catch (error) {
                            console.warn('Impossible de déchiffrer:', encryptedCred.id, error);
                        }
                    }
                }
            } catch (error) {
                console.warn('Erreur récupération E2E:', error);
            }
        }
        
        results.total = results.legacy.length + results.e2e.length;
        return results;
    }
    
    /**
     * Active E2E pour un utilisateur
     */
    async enableE2E(password) {
        const status = await this.initialize(password);
        return {
            success: status.e2eEnabled,
            message: status.e2eEnabled ? 'E2E activé' : 'Échec activation E2E'
        };
    }
}

export default HybridCredentialService;