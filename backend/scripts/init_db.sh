#!/bin/bash

# Script d'initialisation de la base de données pour l'application de gestion d'abonnements
# Usage: ./scripts/init_db.sh [nom_base] [utilisateur_mysql] [mot_de_passe]

set -e  # Arrêter le script en cas d'erreur

# Configuration par défaut (depuis .env)
DB_NAME=${1:-microservice}
DB_USER=${2:-root}
DB_PASSWORD=${3:-""}

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Initialisation de la base de données${NC}"
echo "=========================================="
echo -e "Base de données: ${YELLOW}$DB_NAME${NC}"
echo -e "Utilisateur MySQL: ${YELLOW}$DB_USER${NC}"
echo ""

# Vérifier si MySQL est accessible
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ Erreur: MySQL n'est pas installé ou accessible${NC}"
    echo "Veuillez installer MySQL ou utiliser Docker:"
    echo "  docker-compose up -d mysql"
    exit 1
fi

# Fonction pour exécuter une commande MySQL
run_mysql() {
    if [ -n "$DB_PASSWORD" ]; then
        mysql -u "$DB_USER" -p"$DB_PASSWORD" "$@"
    else
        mysql -u "$DB_USER" "$@"
    fi
}

# 1. Créer la base de données si elle n'existe pas
echo -e "${YELLOW}📦 Création de la base de données...${NC}"
if [ -n "$DB_PASSWORD" ]; then
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
else
    mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de données '$DB_NAME' créée/vérifiée${NC}"
else
    echo -e "${RED}❌ Erreur lors de la création de la base de données${NC}"
    exit 1
fi

# 2. Exécuter le script d'initialisation
echo -e "${YELLOW}🔧 Initialisation des tables et données...${NC}"
if run_mysql "$DB_NAME" < "sql/init_database.sql" 2>/dev/null; then
    echo -e "${GREEN}✅ Tables et données initialisées avec succès${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'initialisation${NC}"
    exit 1
fi

# 3. Afficher un résumé
echo ""
echo -e "${GREEN}🎉 Initialisation terminée avec succès !${NC}"
echo "=========================================="
echo -e "${BLUE}📋 Informations de connexion:${NC}"
echo "  Host: 127.0.0.1"
echo "  Port: 3306"
echo "  Database: $DB_NAME"
echo "  User: user / Password: password"
echo ""
echo -e "${BLUE}🌐 Accès à l'application:${NC}"
echo "  http://localhost:8000/subscribe   - Page de souscription"
echo "  http://localhost:8000/profile     - Gestion du profil"
echo "  http://localhost:8000/admin/users - Administration"
echo ""
echo -e "${YELLOW}💡 Utilisateurs de test créés:${NC}"
echo "  john.doe@example.com"
echo "  marie.durand@example.com"
echo "  pierre.martin@example.com"
