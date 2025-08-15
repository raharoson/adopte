-- Script d'initialisation de la base de données pour l'application de gestion d'abonnements
-- Usage: mysql -u root -p microservice < sql/init_database.sql

-- ===========================================
-- CRÉATION DES TABLES
-- ===========================================

-- Suppression des tables existantes (si elles existent)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS user_subscriptions;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  api_user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL
);

-- Table des types d'abonnements disponibles
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  period_days INT NOT NULL,           -- Fréquence de paiement (ex: 30 jours)
  engagement_months INT NOT NULL,     -- Durée minimale d'engagement
  auto_renew TINYINT(1) DEFAULT 1     -- Reconduction tacite (0=non, 1=oui)
);

-- Table des abonnements des utilisateurs
CREATE TABLE user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT NOT NULL,
  start_date DATE NOT NULL,
  next_payment_date DATE NOT NULL,
  end_engagement_date DATE NOT NULL,
  active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- Table de l'historique des transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  external_transaction_id VARCHAR(100) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===========================================
-- DONNÉES D'INITIALISATION
-- ===========================================

-- Types d'abonnements
INSERT INTO subscriptions (name, price, period_days, engagement_months, auto_renew) VALUES
('Basique', 9.99, 30, 1, 1),   -- 1 mois d'engagement, paiement mensuel
('Premium', 19.99, 30, 3, 1),  -- 3 mois d'engagement, paiement mensuel
('VIP', 39.99, 30, 6, 1);      -- 6 mois d'engagement, paiement mensuel

-- Utilisateurs de test
INSERT INTO users (name, email, api_user_id, created_at) VALUES
('John Doe', 'john.doe@example.com', 1001, NOW()),
('Marie Durand', 'marie.durand@example.com', 1002, NOW()),
('Pierre Martin', 'pierre.martin@example.com', 1003, NOW());

-- Abonnements de test
INSERT INTO user_subscriptions (user_id, subscription_id, start_date, next_payment_date, end_engagement_date, active) VALUES
(1, 2, '2024-01-15', '2024-02-15', '2024-04-15', 1),  -- John avec Premium (3 mois)
(2, 1, '2024-02-01', '2024-03-01', '2024-03-01', 1),  -- Marie avec Basique (1 mois)
(3, 3, '2024-01-01', '2024-02-01', '2024-07-01', 1);  -- Pierre avec VIP (6 mois)

-- Transactions de test
INSERT INTO transactions (user_id, amount, external_transaction_id, date) VALUES
(1, 19.99, 'txn_premium_001', '2024-01-15 10:30:00'),
(2, 9.99, 'txn_basic_001', '2024-02-01 14:15:00'),
(3, 39.99, 'txn_vip_001', '2024-01-01 09:45:00');

-- ===========================================
-- VÉRIFICATION
-- ===========================================

-- Affichage du résumé de l'initialisation
SELECT 'Base de données initialisée avec succès !' as status;
SELECT CONCAT('Utilisateurs créés: ', COUNT(*)) as users_count FROM users;
SELECT CONCAT('Types d\'abonnements: ', COUNT(*)) as subscriptions_count FROM subscriptions;
SELECT CONCAT('Abonnements actifs: ', COUNT(*)) as active_subscriptions FROM user_subscriptions WHERE active = 1;
SELECT CONCAT('Transactions: ', COUNT(*)) as transactions_count FROM transactions;
