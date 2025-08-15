<?php

namespace App\Repository;

use PDO;

class SubscriptionRepository
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Récupère tous les abonnements depuis la base de données
     */
    public function getAllSubscriptions(): array
    {
        $stmt = $this->pdo->query('
            SELECT 
                id, 
                name, 
                price, 
                period_days, 
                engagement_months, 
                auto_renew 
            FROM subscriptions 
            ORDER BY price ASC
        ');
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Récupère un abonnement par son ID
     */
    public function getSubscriptionById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('
            SELECT 
                id, 
                name, 
                price, 
                period_days, 
                engagement_months, 
                auto_renew 
            FROM subscriptions 
            WHERE id = :id
        ');
        
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result ?: null;
    }

    /**
     * Récupère les abonnements actifs (pour les formulaires publics)
     */
    public function getActiveSubscriptions(): array
    {
        // Pour l'instant, tous les abonnements sont considérés comme actifs
        // On peut ajouter une colonne 'active' plus tard si nécessaire
        return $this->getAllSubscriptions();
    }

    /**
     * Crée ou met à jour un abonnement
     */
    public function saveSubscription(array $data): int
    {
        if (isset($data['id']) && $data['id'] > 0) {
            // Mise à jour
            $stmt = $this->pdo->prepare('
                UPDATE subscriptions 
                SET name = :name, 
                    price = :price, 
                    period_days = :period_days, 
                    engagement_months = :engagement_months, 
                    auto_renew = :auto_renew 
                WHERE id = :id
            ');
            
            $stmt->execute([
                'id' => $data['id'],
                'name' => $data['name'],
                'price' => $data['price'],
                'period_days' => $data['period_days'],
                'engagement_months' => $data['engagement_months'],
                'auto_renew' => $data['auto_renew'] ? 1 : 0
            ]);
            
            return $data['id'];
        } else {
            // Création
            $stmt = $this->pdo->prepare('
                INSERT INTO subscriptions (name, price, period_days, engagement_months, auto_renew) 
                VALUES (:name, :price, :period_days, :engagement_months, :auto_renew)
            ');
            
            $stmt->execute([
                'name' => $data['name'],
                'price' => $data['price'],
                'period_days' => $data['period_days'],
                'engagement_months' => $data['engagement_months'],
                'auto_renew' => $data['auto_renew'] ? 1 : 0
            ]);
            
            return (int) $this->pdo->lastInsertId();
        }
    }
}
