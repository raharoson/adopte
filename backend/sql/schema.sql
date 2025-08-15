-- Utilisateurs
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  api_user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Abonnements disponibles (modifiables par l'admin)
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  period_days INT NOT NULL,
  engagement_months INT NOT NULL,
  auto_renew TINYINT(1) DEFAULT 1
);

-- Souscriptions utilisateurs
CREATE TABLE user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT NOT NULL,
  start_date DATE NOT NULL,
  next_payment_date DATE NOT NULL,
  end_engagement_date DATE NOT NULL,
  active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- Transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  external_transaction_id VARCHAR(100) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
