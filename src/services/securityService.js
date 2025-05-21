// src/services/securityService.js
/**
 * Service pour les fonctionnalités de sécurité et d'audit
 */

const API_URL = 'http://localhost:8001';

/**
 * Récupère les données pour le tableau de bord de sécurité
 * @returns {Promise} Données du tableau de bord
 */
export const fetchDashboardData = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_URL}/api/security/dashboard/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Erreur ${response.status}: ${response.statusText}`;
      console.error('Réponse d\'erreur complète:', errorData);
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchDashboardData:', error);
    throw error;
  }
};

/**
 * Lance un audit de sécurité
 * @returns {Promise} Résultats de l'audit
 */
export const runSecurityAudit = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_URL}/api/security/run_audit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Erreur ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur runSecurityAudit:', error);
    throw error;
  }
};

/**
 * Récupère l'historique des audits de sécurité
 * @returns {Promise} Historique des audits
 */
export const fetchAuditHistory = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_URL}/api/security/audit_history/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Erreur ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchAuditHistory:', error);
    throw error;
  }
};

/**
 * Récupère le journal d'activité de l'utilisateur
 * @returns {Promise} Journal d'activité
 */
export const fetchAuditLog = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_URL}/api/security/audit_log/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Erreur ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchAuditLog:', error);
    throw error;
  }
};

/**
 * Évalue la force d'un mot de passe
 * @param {string} credentialId - ID du credential à évaluer
 * @returns {Promise} Informations sur la force du mot de passe
 */
export const evaluatePasswordStrength = async (credentialId) => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_URL}/api/security/credential_strength/${credentialId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Erreur ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur evaluatePasswordStrength:', error);
    throw error;
  }
};

export default {
  fetchDashboardData,
  runSecurityAudit,
  fetchAuditHistory,
  fetchAuditLog,
  evaluatePasswordStrength
};