# Microservice Symfony avec Docker

Un microservice léger basé sur Symfony 6.4 avec Docker (Nginx, PHP 8.1, MySQL 8.0).
**Sans ORM** : Utilise PDO natif pour les opérations de base de données.

## 🚀 Démarrage rapide

### Prérequis
- Docker
- Docker Compose
- Make (optionnel, pour les raccourcis)

### Installation

1. **Cloner le projet** (si applicable)
```bash
git clone <repository-url>
cd backend
```

2. **Construire les images Docker**
```bash
make build
# ou
docker-compose build
```

3. **Démarrer les services**
```bash
make up
# ou
docker-compose up -d
```

4. **Vérifier que tout fonctionne**
```bash
curl http://localhost:8080/api/
curl http://localhost:8080/api/health
```

## 🐳 Services Docker

- **Nginx** : Port 8080 → Serveur web
- **PHP 8.1-FPM** : Application Symfony
- **MySQL 8.0** : Port 3306 → Base de données

## 📋 Commandes utiles

### Avec Make (recommandé)
```bash
make help              # Voir toutes les commandes
make build              # Construire les images
make up                 # Démarrer les containers
make down               # Arrêter les containers
make logs               # Voir les logs
make bash               # Accéder au container PHP
make mysql-cli          # Accéder à MySQL
make cache-clear        # Vider le cache Symfony
make composer-install   # Installer les dépendances
```

### Avec Docker Compose
```bash
docker-compose build
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose exec app bash
docker-compose exec mysql mysql -u root -p
```

## 🌐 URLs d'accès

- **API principale** : http://localhost:8080/api/
- **Health check** : http://localhost:8080/api/health
- **Test base de données** : http://localhost:8080/api/database
- **Exemple PDO (users)** : http://localhost:8080/api/users

## 📁 Structure du projet

```
.
├── docker/
│   ├── nginx/
│   │   └── default.conf    # Configuration Nginx
│   └── php/
│       ├── Dockerfile      # Image PHP 8.1
│       └── php.ini         # Configuration PHP
├── src/
│   └── Controller/
│       └── ApiController.php
├── docker-compose.yaml     # Configuration Docker
├── Makefile               # Raccourcis de commandes
└── README.md
```

## 🔧 Configuration

### Variables d'environnement (.env)
```
MYSQL_DATABASE=microservice
MYSQL_ROOT_PASSWORD=root
MYSQL_USER=user
MYSQL_PASSWORD=password
DATABASE_URL=mysql://user:password@mysql:3306/microservice
```

### Ports utilisés
- **8080** : Nginx (HTTP)
- **3306** : MySQL

## 🛠️ Développement

### Ajouter des dépendances
```bash
make bash
composer require <package-name>
```

### Vider le cache
```bash
make cache-clear
```

### Accéder aux logs
```bash
make logs-app     # Logs PHP
make logs-nginx   # Logs Nginx
make logs-mysql   # Logs MySQL
```

## 🧪 Tests

Pour les tests (quand configurés) :
```bash
make test
```

## 🗃️ Base de données

### Accéder à MySQL
```bash
make mysql-cli
# Mot de passe : root
```

### Connexion depuis l'extérieur
- **Host** : localhost
- **Port** : 3306
- **User** : user
- **Password** : password
- **Database** : microservice

### Architecture sans ORM

Ce microservice **n'utilise pas Doctrine ORM** mais PDO natif pour une approche plus légère et performante :

#### Avantages :
- ✅ Performance optimale
- ✅ Contrôle total des requêtes SQL
- ✅ Empreinte mémoire réduite
- ✅ Pas de mapping objet-relationnel complexe
- ✅ Idéal pour les microservices

### Utilisation de PDO

Le microservice inclut une classe `DatabaseService` pour les opérations PDO :

```php
use App\Service\DatabaseService;

$db = new DatabaseService();

// Test de connexion
$isConnected = $db->testConnection();

// Exécuter une requête SELECT
$users = $db->query('SELECT * FROM users WHERE active = ?', [1]);

// Exécuter une requête INSERT/UPDATE/DELETE
$success = $db->execute('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
```

**Endpoints disponibles :**

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir le token JWT

### Utilisateurs
- `GET /api/users` - Liste paginée des utilisateurs
- `GET /api/users/search` - Rechercher des utilisateurs avec filtres
- `GET /api/users/{id}` - Récupérer le profil d'un utilisateur
- `PUT /api/users/{id}` - Mettre à jour le profil utilisateur

### Matches & Swipes
- `POST /api/swipes` - Swiper sur un utilisateur (like/dislike)
- `GET /api/matches` - Liste des matches de l'utilisateur connecté
- `GET /api/matches/{id}` - Détails d'un match spécifique

### Utilitaires
- `GET /api/health` - Vérification de l'état de l'API
- `GET /api/database` - Test de connexion à MySQL

## 🧹 Nettoyage

```bash
make clean    # Nettoyer containers et volumes
make rebuild  # Reconstruire tout à zéro
```

## 🚨 Dépannage

### Les containers ne démarrent pas
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Vérifier les logs
```bash
make logs
```

### Problème de permissions
```bash
sudo chown -R $(id -u):$(id -g) ./
```
