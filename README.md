# FireKey Frontend 🔐

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.14.0-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**FireKey** est une application web moderne de gestion de mots de passe conçue pour offrir une sécurité maximale avec une expérience utilisateur exceptionnelle. Cette application React propose un chiffrement côté serveur, une authentification à deux facteurs, et une interface utilisateur intuitive et responsive.

## ✨ Fonctionnalités Principales

### 🔒 Sécurité Avancée
- **Chiffrement E2E** : Tous les mots de passe sont chiffrés côté serveur avec des standards militaires
- **Authentification 2FA** : Protection supplémentaire avec codes temporaires
- **Credentials Sensibles** : Protection renforcée pour les données critiques
- **Audit de Sécurité** : Analyse automatique de la force des mots de passe
- **Détection de Fuites** : Surveillance proactive des violations de données

### 💼 Gestion Intelligente
- **Générateur de Mots de Passe** : Création de mots de passe sécurisés personnalisables
- **Système de Tags** : Organisation flexible avec étiquettes colorées
- **Partage Sécurisé** : Liens de partage temporaires avec expiration automatique
- **Import/Export** : Compatible avec les principaux gestionnaires (Bitwarden, LastPass, 1Password, etc.)
- **Recherche Avancée** : Filtrage et tri intelligents

### 🎨 Interface Moderne
- **Design Dark Mode** : Interface élégante optimisée pour les yeux
- **Responsive Design** : Parfaitement adapté à tous les appareils
- **Animations Fluides** : Transitions et micro-interactions polies
- **Accessibilité** : Conforme aux standards WCAG 2.1
- **PWA Ready** : Installation possible comme application native

## 🚀 Technologies Utilisées

### Frontend Core
- **React 18** - Framework JavaScript moderne avec Hooks
- **Vite** - Build tool ultra-rapide pour le développement
- **React Router** - Navigation SPA avec protection de routes
- **Material-UI v5** - Composants UI de qualité entreprise

### Gestion d'État & API
- **React Hooks** - Gestion d'état locale optimisée
- **Fetch API** - Communications HTTP sécurisées
- **JWT Authentication** - Authentification stateless
- **Axios** - Client HTTP avec intercepteurs

### UI/UX
- **Material-UI** - Design system cohérent
- **Styled Components** - CSS-in-JS avec thématisation
- **React Transition Group** - Animations et transitions
- **Notistack** - Notifications toast élégantes

### Sécurité & Performance
- **Protected Routes** - Contrôle d'accès granulaire
- **Token Refresh** - Gestion automatique des sessions
- **Lazy Loading** - Chargement optimisé des composants
- **Error Boundaries** - Gestion robuste des erreurs

## 📦 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- Backend FireKey en cours d'exécution

### Installation Rapide
```bash
# Cloner le repository
git clone https://github.com/imDenq/firekey-frontend.git
cd firekey-frontend

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Démarrage en développement
npm run dev
```

### Variables d'Environnement
```env
VITE_API_URL=http://localhost:8001
VITE_APP_NAME=FireKey
VITE_APP_VERSION=1.0.0
```

## 🛠️ Scripts Disponibles

```bash
# Développement avec hot reload
npm run dev

# Build de production optimisé
npm run build

# Prévisualisation du build
npm run preview

# Linting et formatage
npm run lint
npm run lint:fix

# Tests (si configurés)
npm run test
npm run test:coverage
```

## 🏗️ Architecture

```
src/
├── components/           # Composants réutilisables
│   ├── Credentials/     # Gestion des mots de passe
│   ├── Shares/          # Partage sécurisé
│   └── UI/              # Composants d'interface
├── pages/               # Pages principales
│   ├── Login.jsx        # Authentification
│   ├── Dashboard.jsx    # Tableau de bord
│   ├── Credentials.jsx  # Gestion des credentials
│   └── Profile.jsx      # Paramètres utilisateur
├── services/            # Services API et logique métier
├── hooks/               # Hooks React personnalisés
├── utils/               # Utilitaires et helpers
└── styles/              # Styles globaux et thèmes
```

### Patterns de Développement
- **Component-Based Architecture** : Composants réutilisables et modulaires
- **Custom Hooks** : Logique partagée encapsulée
- **Styled Components** : Styles maintenables et thématisés
- **Error Boundaries** : Gestion d'erreurs gracieuse
- **Protected Routes** : Sécurité au niveau navigation

## 🔧 Configuration

### Personnalisation du Thème
```javascript
// src/theme/index.js
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#58a6ff' },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
  },
});
```

### Configuration API
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
```

## 📱 Fonctionnalités Détaillées

### Dashboard Intelligent
- Aperçu de la santé des mots de passe
- Statistiques de sécurité en temps réel
- Alertes proactives sur les risques
- Historique d'activité détaillé

### Générateur de Mots de Passe
- Algorithmes cryptographiques robustes
- Personnalisation avancée (longueur, caractères, exclusions)
- Estimation du temps de crack
- Prévisualisation de la force en temps réel

### Système de Partage
- Liens temporaires sécurisés
- Contrôle d'accès granulaire
- Limitation du nombre d'utilisations
- Expiration automatique configurable

### Import/Export Universel
- Support multi-format (CSV, JSON, formats propriétaires)
- Mapping intelligent des champs
- Détection et résolution des doublons
- Chiffrement des exports

## 🚦 Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Vérification du build
npm run preview
```

### Déploiement Automatisé
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install & Build
        run: |
          npm ci
          npm run build
      - name: Deploy
        # Configuration spécifique à votre plateforme
```

### Plateformes Supportées
- **Vercel** : Déploiement instantané avec git
- **Netlify** : Intégration continue automatique  
- **AWS S3 + CloudFront** : Hébergement scalable
- **Docker** : Containerisation pour tous environnements

## 🔒 Sécurité

### Mesures Implémentées
- **CSP Headers** : Protection contre XSS
- **HTTPS Enforcement** : Chiffrement en transit
- **Token Rotation** : Renouvellement automatique des sessions
- **Input Sanitization** : Validation côté client
- **Secure Storage** : Stockage sécurisé des tokens

### Audit de Sécurité
```bash
# Audit des dépendances
npm audit
npm audit fix

# Analyse de sécurité avancée
npx retire --path .
```

## 🤝 Contribution

### Guide de Contribution
1. **Fork** le projet
2. Créer une **branche feature** : `git checkout -b feature/ma-fonctionnalite`
3. **Commit** les changements : `git commit -m 'Ajout fonctionnalité X'`
4. **Push** vers la branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une **Pull Request**

### Standards de Code
- **ESLint** : Respect des conventions JavaScript
- **Prettier** : Formatage automatique du code
- **Conventional Commits** : Messages de commit structurés
- **JSDoc** : Documentation des fonctions importantes

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

### Obtenir de l'Aide
- 📚 **Documentation** : [Wiki du projet](../../wiki)
- 🐛 **Bugs** : [Issues GitHub](../../issues)
- 💡 **Suggestions** : [Discussions GitHub](../../discussions)
- 📧 **Contact** : support@firekey.app

### FAQ
**Q: Comment configurer l'authentification 2FA ?**
A: Rendez-vous dans Profil > Sécurité et suivez l'assistant de configuration.

**Q: Mes données sont-elles vraiment sécurisées ?**
A: Oui, toutes les données sensibles sont chiffrées avec AES-256 côté serveur.

**Q: Puis-je importer depuis mon gestionnaire actuel ?**
A: Oui, nous supportons 15+ formats incluant tous les gestionnaires populaires.

---

<div align="center">

**[⭐ Star ce projet](../../stargazers)** • **[🍴 Fork](../../fork)** • **[📋 Issues](../../issues)**

Fait avec ❤️ par denq :)

</div>