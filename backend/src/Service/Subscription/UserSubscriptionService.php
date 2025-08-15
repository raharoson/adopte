<?php

namespace App\Service\Subscription;

use App\Service\Payment\PaymentInterface;
use App\Repository\UserRepositoryPDO;
use App\Repository\SubscriptionRepository;

class UserSubscriptionService
{
    private PaymentInterface $payment;
    private UserRepositoryPDO $userRepo;
    private SubscriptionRepository $subscriptionRepo;

    public function __construct(PaymentInterface $payment, UserRepositoryPDO $userRepo, SubscriptionRepository $subscriptionRepo)
    {
        $this->payment = $payment;
        $this->userRepo = $userRepo;
        $this->subscriptionRepo = $subscriptionRepo;
    }

    public function subscribeUser(string $name, string $email, int $subscriptionId, string $cardNumber, int $cvv, float $amount): array
    {
        $apiUserId = $this->generateApiUserId();

        $this->payment->createUser($apiUserId, $cardNumber, $cvv);
        
        $transactionId = $this->payment->createTransaction($apiUserId, $amount);

        $userId = $this->userRepo->saveUser($name, $email, $apiUserId);
        
        // Récupérer les informations de l'abonnement depuis la BDD
        $subscription = $this->subscriptionRepo->getSubscriptionById($subscriptionId);
        if (!$subscription) {
            throw new \Exception('Abonnement introuvable');
        }
        
        $startDate = date('Y-m-d');
        $nextPaymentDate = date('Y-m-d', strtotime('+' . $subscription['period_days'] . ' days'));
        $endEngagementDate = date('Y-m-d', strtotime('+' . $subscription['engagement_months'] . ' months'));
        
        $userSubscriptionId = $this->userRepo->saveUserSubscription(
            $userId, 
            $subscriptionId, 
            $startDate, 
            $nextPaymentDate, 
            $endEngagementDate
        );
        
        $this->userRepo->saveTransaction($userId, $amount, $transactionId);
        
        return [
            'user_id' => $userId,
            'api_user_id' => $apiUserId,
            'subscription_id' => $userSubscriptionId,
            'transaction_id' => $transactionId
        ];
    }

    /**
     * Generate a unique API user ID for external payment system
     * This is different from the database auto-incremented ID
     */
    private function generateApiUserId(): int
    {
        // Use timestamp + random number to ensure uniqueness
        $timestamp = (int) (microtime(true) * 1000); // milliseconds
        $random = random_int(100, 999);
        
        // Combine to create a unique ID (keeping it reasonable in size)
        return (int) substr($timestamp . $random, -9); // Keep last 9 digits
    }
}
