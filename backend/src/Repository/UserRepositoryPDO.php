<?php

namespace App\Repository;

use PDO;

class UserRepositoryPDO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function saveUser(string $name, string $email, int $apiUserId): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO users (name, email, api_user_id) VALUES (:name, :email, :api_user_id)');
        $stmt->execute([
            'name' => $name,
            'email' => $email,
            'api_user_id' => $apiUserId
        ]);
        
        return (int) $this->pdo->lastInsertId();
    }

    public function saveTransaction(int $userId, float $amount, string $externalId): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO transactions (user_id, amount, external_transaction_id) VALUES (:user_id, :amount, :ext_id)');
        $stmt->execute([
            'user_id' => $userId,
            'amount' => $amount,
            'ext_id' => $externalId
        ]);
    }

    public function getAllUsers(): array
    {
        $stmt = $this->pdo->query('
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.api_user_id, 
                u.created_at,
                us.subscription_id,
                us.start_date as subscription_start_date,
                us.next_payment_date,
                us.end_engagement_date
            FROM users u
            LEFT JOIN user_subscriptions us ON u.id = us.user_id
            ORDER BY u.created_at DESC
        ');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function saveUserSubscription(int $userId, int $subscriptionId, string $startDate, string $nextPaymentDate, string $endEngagementDate): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_subscriptions (user_id, subscription_id, start_date, next_payment_date, end_engagement_date) 
             VALUES (:user_id, :subscription_id, :start_date, :next_payment_date, :end_engagement_date)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'subscription_id' => $subscriptionId,
            'start_date' => $startDate,
            'next_payment_date' => $nextPaymentDate,
            'end_engagement_date' => $endEngagementDate
        ]);
        
        return (int) $this->pdo->lastInsertId();
    }

    public function getUserById(int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, name, email, api_user_id, created_at FROM users WHERE id = :id');
        $stmt->execute(['id' => $userId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result ?: null;
    }

    public function getUserByEmail(string $email): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, name, email, api_user_id, created_at, updated_at FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result ?: null;
    }

    /**
     * Calcule le chiffre d'affaires total pour une période donnée
     */
    public function getRevenueByDateRange(string $startDate, string $endDate): array
    {
        $stmt = $this->pdo->prepare('
            SELECT 
                COUNT(*) as total_transactions,
                SUM(amount) as total_revenue,
                AVG(amount) as average_transaction,
                MIN(amount) as min_transaction,
                MAX(amount) as max_transaction
            FROM transactions 
            WHERE DATE(date) BETWEEN :start_date AND :end_date
        ');
        
        $stmt->execute([
            'start_date' => $startDate,
            'end_date' => $endDate
        ]);
        
        $totals = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Récupérer les données par jour
        $stmt = $this->pdo->prepare('
            SELECT 
                DATE(date) as date,
                COUNT(*) as transactions_count,
                SUM(amount) as daily_revenue
            FROM transactions 
            WHERE DATE(date) BETWEEN :start_date AND :end_date
            GROUP BY DATE(date)
            ORDER BY DATE(date) ASC
        ');
        
        $stmt->execute([
            'start_date' => $startDate,
            'end_date' => $endDate
        ]);
        
        $dailyData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return [
            'totals' => $totals,
            'daily_data' => $dailyData,
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ]
        ];
    }

    /**
     * Récupère les transactions détaillées pour une période donnée
     */
    public function getTransactionsByDateRange(string $startDate, string $endDate): array
    {
        $stmt = $this->pdo->prepare('
            SELECT 
                t.id,
                t.amount,
                t.external_transaction_id,
                t.date as created_at,
                u.name as user_name,
                u.email as user_email,
                us.subscription_id
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN user_subscriptions us ON u.id = us.user_id
            WHERE DATE(t.date) BETWEEN :start_date AND :end_date
            ORDER BY t.date DESC
        ');
        
        $stmt->execute([
            'start_date' => $startDate,
            'end_date' => $endDate
        ]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupère les abonnements d'un utilisateur
     */
    public function getUserSubscriptions(int $userId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT 
                us.*,
                s.name as subscription_name,
                s.price,
                s.period_days,
                s.engagement_months,
                s.auto_renew
            FROM user_subscriptions us
            JOIN subscriptions s ON us.subscription_id = s.id
            WHERE us.user_id = :user_id
            ORDER BY us.id DESC
        ');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Met à jour le timestamp de dernière modification d'un utilisateur
     */
    public function updateUserTimestamp(int $userId): void
    {
        $stmt = $this->pdo->prepare('
            UPDATE users 
            SET updated_at = NOW() 
            WHERE id = :id
        ');
        $stmt->execute(['id' => $userId]);
    }
}
