<?php

namespace App\Service;

use App\Repository\SubscriptionRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class SubscriptionConfigService
{
    private ParameterBagInterface $params;
    private SubscriptionRepository $subscriptionRepo;

    public function __construct(ParameterBagInterface $params, SubscriptionRepository $subscriptionRepo)
    {
        $this->params = $params;
        $this->subscriptionRepo = $subscriptionRepo;
    }

    /**
     * Retourne tous les types d'abonnement depuis la base de données
     */
    public function getSubscriptions(): array
    {
        return $this->subscriptionRepo->getActiveSubscriptions();
    }

    /**
     * Retourne un abonnement spécifique par son ID
     */
    public function getSubscriptionById(int $id): ?array
    {
        return $this->subscriptionRepo->getSubscriptionById($id);
    }

    /**
     * Retourne un mapping ID => nom des abonnements
     */
    public function getSubscriptionTypes(): array
    {
        $subscriptions = $this->getSubscriptions();
        $types = [];
        
        foreach ($subscriptions as $subscription) {
            $types[$subscription['id']] = $subscription['name'];
        }
        
        return $types;
    }

    /**
     * Retourne un mapping ID => prix des abonnements
     */
    public function getSubscriptionPrices(): array
    {
        $subscriptions = $this->getSubscriptions();
        $prices = [];
        
        foreach ($subscriptions as $subscription) {
            $prices[$subscription['id']] = $subscription['price'];
        }
        
        return $prices;
    }
}
