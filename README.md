# Adopte - Application de Rencontres

Application full-stack moderne composée d'un backend PHP (microservices) et d'un frontend React avec TypeScript.

## 🏗️ Architecture du Projet

```
adopte/
├── backend/          # API PHP avec Symfony et Docker
├── frontend/         # Application React + TypeScript + Vite
└── README.md         # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis
- **Docker** et **Docker Compose** (pour le backend)
- **Node.js** 18+ et **npm** (pour le frontend)
- **Make** (optionnel, pour les raccourcis backend)

### Installation Complète

1. **Cloner le projet**
```bash
git clone <repository-url>
cd adopte
```

2. **Démarrer le backend (API)**
```bash
cd backend
make build && make up
# ou
docker-compose build && docker-compose up -d
```

3. **Démarrer le frontend**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Vérifier que tout fonctionne**
```bash
# Backend API
curl http://localhost:8080/api/health

# Frontend (ouvrir dans le navigateur)
http://localhost:5173
```

## 🌐 URLs d'Accès

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8080/api/
- **Health Check** : http://localhost:8080/api/health

## 📁 Structure des Services

### Backend (Port 8080)
- **Framework** : Symfony 6.4
- **PHP** : 8.1 avec PDO natif (sans ORM)
- **Base de données** : MySQL 8.0
- **Serveur** : Nginx
- **Containerisé** avec Docker

### Frontend (Port 5173)
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **HTTP Client** : Axios avec intercepteurs

## 🛠️ Développement

### Backend
```bash
cd backend
make help              # Voir toutes les commandes
make logs              # Logs en temps réel
make bash              # Accès au container PHP
make mysql-cli         # Accès à MySQL
```

### Frontend
```bash
cd frontend
npm run dev            # Mode développement
npm run build          # Build production
npm run preview        # Aperçu du build
npm run lint           # Linter ESLint
```

## 📋 APIs Disponibles

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir le token

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/search` - Rechercher des utilisateurs
- `GET /api/users/{id}` - Profil utilisateur
- `PUT /api/users/{id}` - Mettre à jour le profil

### Matches & Swipes
- `POST /api/swipes` - Swiper sur un utilisateur
- `GET /api/matches` - Liste des matches
- `GET /api/matches/{id}` - Détails d'un match

## 🧪 Tests

### Backend
```bash
cd backend
make test              # Tests PHPUnit (quand configurés)
```

### Frontend
```bash
cd frontend
npm run test           # Tests (à configurer)
```

## 🔧 Configuration

### Variables d'Environnement

**Backend** (`.env`) :
```env
MYSQL_DATABASE=microservice
MYSQL_ROOT_PASSWORD=root
DATABASE_URL=mysql://user:password@mysql:3306/microservice
```

**Frontend** (`.env`) :
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🚨 Dépannage

### Backend ne démarre pas
```bash
cd backend
make clean && make rebuild
```

### Frontend ne démarre pas
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problèmes de CORS
Vérifiez la configuration CORS dans le backend pour permettre les requêtes depuis `http://localhost:5173`.

## 📚 Documentation Détaillée

- [Documentation Backend](./backend/README.md)
- [Documentation Frontend](./frontend/README.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
