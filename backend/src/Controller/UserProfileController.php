<?php

namespace App\Controller;

use App\Repository\UserRepositoryPDO;
use App\Service\Payment\PaymentInterface;
use App\Service\SubscriptionConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserProfileController extends AbstractController
{
    private UserRepositoryPDO $userRepo;
    private PaymentInterface $paymentService;
    private SubscriptionConfigService $subscriptionConfig;

    public function __construct(
        UserRepositoryPDO $userRepo, 
        PaymentInterface $paymentService,
        SubscriptionConfigService $subscriptionConfig
    ) {
        $this->userRepo = $userRepo;
        $this->paymentService = $paymentService;
        $this->subscriptionConfig = $subscriptionConfig;
    }

    #[Route('/profile', name: 'user_profile', methods: ['GET', 'POST'])]
    public function profile(Request $request): Response
    {
        $email = $request->query->get('email', $request->request->get('email'));
        $user = null;
        $userSubscriptions = [];

        if ($email) {
            $user = $this->getUserByEmail($email);
            if ($user) {
                $userSubscriptions = $this->getUserSubscriptions($user['id']);
            }
        }

        if ($request->isMethod('POST') && $user) {
            return $this->handlePaymentUpdate($request, $user);
        }

        $subscriptionTypes = $this->subscriptionConfig->getSubscriptionTypes();

        return $this->render('profile/index.html.twig', [
            'user' => $user,
            'user_subscriptions' => $userSubscriptions,
            'subscription_types' => $subscriptionTypes,
            'search_email' => $email
        ]);
    }

    #[Route('/profile/search', name: 'user_profile_search', methods: ['POST'])]
    public function searchUser(Request $request): Response
    {
        $email = $request->request->get('search_email');
        
        return $this->redirectToRoute('user_profile', [
            'email' => $email
        ]);
    }

    private function getUserByEmail(string $email): ?array
    {
        return $this->userRepo->getUserByEmail($email);
    }

    private function getUserSubscriptions(int $userId): array
    {
        return $this->userRepo->getUserSubscriptions($userId);
    }

    private function handlePaymentUpdate(Request $request, array $user): Response
    {
        $cardNumber = $request->request->get('card_number');
        $cvv = $request->request->get('cvv');
        $holderName = $request->request->get('holder_name');

        if (empty($cardNumber) || empty($cvv)) {
            $this->addFlash('error', 'Le numéro de carte et le CVV sont requis.');
            return $this->redirectToRoute('user_profile', ['email' => $user['email']]);
        }

        if (!preg_match('/^\d{16}$/', str_replace(' ', '', $cardNumber))) {
            $this->addFlash('error', 'Le numéro de carte doit contenir exactement 16 chiffres.');
            return $this->redirectToRoute('user_profile', ['email' => $user['email']]);
        }

        if (!preg_match('/^\d{3,4}$/', $cvv)) {
            $this->addFlash('error', 'Le CVV doit contenir 3 ou 4 chiffres.');
            return $this->redirectToRoute('user_profile', ['email' => $user['email']]);
        }

        try {
            $this->paymentService->updatePaymentMethod(
                $user['api_user_id'], 
                $cardNumber, 
                (int)$cvv,
                $holderName ?: $user['name']
            );

            $this->logPaymentMethodUpdate($user['id']);

            $this->addFlash('success', 'Vos informations de paiement ont été mises à jour avec succès.');
        } catch (\Exception $e) {
            $this->addFlash('error', 'Erreur lors de la mise à jour : ' . $e->getMessage());
        }

        return $this->redirectToRoute('user_profile', ['email' => $user['email']]);
    }

    private function logPaymentMethodUpdate(int $userId): void
    {
        // Enregistrer dans une table de logs ou simplement mettre à jour updated_at
        $this->userRepo->updateUserTimestamp($userId);
    }
}
