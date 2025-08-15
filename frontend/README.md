# Frontend - Adopte App

Application React moderne avec TypeScript, Vite, et Tailwind CSS pour l'application de rencontres Adopte.

## 🛠️ Technologies Utilisées

- **React** 18 - Framework UI avec hooks
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide avec HMR
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP avec intercepteurs
- **ESLint** - Linter pour la qualité du code

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Ouvrir dans le navigateur
http://localhost:5173
```

## 📋 Scripts Disponibles

```bash
npm run dev          # Mode développement avec HMR
npm run build        # Build pour la production
npm run preview      # Aperçu du build de production
npm run lint         # Linter ESLint
```

## 🏗️ Structure du Projet

```
src/
├── api/              # Clients API et services
│   ├── client.ts     # Configuration Axios
│   ├── auth.ts       # Service authentification
│   ├── users.ts      # Service utilisateurs
│   └── matches.ts    # Service matches/swipes
├── components/       # Composants React réutilisables
│   ├── Header.tsx    # En-tête de l'application
│   ├── Footer.tsx    # Pied de page
│   ├── ApiDebug.tsx  # Composant de debug API
│   └── SimpleUsersPage.tsx # Page liste utilisateurs
├── types/            # Types TypeScript
│   └── api.ts        # Types pour les APIs
├── App.tsx           # Composant principal
├── main.tsx          # Point d'entrée
└── index.css         # Styles globaux avec Tailwind
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Configuration Tailwind

Le projet utilise Tailwind CSS avec configuration personnalisée dans :
- `tailwind.config.js` - Configuration Tailwind
- `postcss.config.js` - Configuration PostCSS

## 🌐 Client API

### Configuration Axios

Le client API (`src/api/client.ts`) inclut :
- Base URL automatique
- Intercepteurs pour l'authentification
- Gestion globale des erreurs
- Types TypeScript complets

### Services Disponibles

**AuthService** (`src/api/auth.ts`) :
```typescript
- login(credentials) - Connexion
- register(userData) - Inscription
- logout() - Déconnexion
- refresh() - Rafraîchir le token
```

**UsersService** (`src/api/users.ts`) :
```typescript
- getUsers() - Liste des utilisateurs
- searchUsers(params) - Rechercher
- getUserProfile(id) - Profil utilisateur
- updateProfile(id, data) - Mise à jour
```

**MatchesService** (`src/api/matches.ts`) :
```typescript
- swipeUser(data) - Swiper
- getMatches() - Liste des matches
- getMatchDetails(id) - Détails match
```

## 🧪 Développement

### Debugging API

Utiliser le composant `ApiDebug` pour tester les appels API :
```typescript
import ApiDebug from './components/ApiDebug'

// Dans votre composant
<ApiDebug />
```

### Types TypeScript

Tous les types API sont définis dans `src/types/api.ts` :
```typescript
- User - Utilisateur
- AuthRequest/Response - Authentification
- SearchParams - Paramètres de recherche
- Match - Match entre utilisateurs
```

### Gestion d'État

Le projet utilise les hooks React natifs :
- `useState` - État local des composants
- `useEffect` - Effets de bord
- Context API (à ajouter si nécessaire)

## 🎨 Styling

### Tailwind CSS

Utilisation des classes utilitaires Tailwind :
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Bouton stylé
</div>
```

### Responsive Design

Classes responsive intégrées :
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Layout responsive
</div>
```

## 🚨 Dépannage

### Problèmes courants

**Erreurs CORS** :
Vérifiez que le backend autorise les requêtes depuis `http://localhost:5173`.

**Erreurs TypeScript** :
```bash
# Redémarrer le serveur TypeScript
npm run dev
```

**Problèmes de dépendances** :
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation Utile

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
