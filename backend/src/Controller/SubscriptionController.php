<?php

namespace App\Controller;

use App\Service\Subscription\UserSubscriptionService;
use App\Service\SubscriptionConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SubscriptionController extends AbstractController
{
    private UserSubscriptionService $subscriptionService;
    private SubscriptionConfigService $subscriptionConfig;

    public function __construct(UserSubscriptionService $subscriptionService, SubscriptionConfigService $subscriptionConfig)
    {
        $this->subscriptionService = $subscriptionService;
        $this->subscriptionConfig = $subscriptionConfig;
    }

    #[Route('/subscribe', name: 'subscribe', methods: ['GET', 'POST'])]
    public function subscribe(Request $request): Response
    {
        $subscriptions = $this->subscriptionConfig->getSubscriptions();

        if ($request->isMethod('POST')) {
            $subscriptionId = $request->request->get('subscription_id');
            $cardNumber = $request->request->get('card_number');
            $cvv = $request->request->get('cvv');
            $name = $request->request->get('name');
            $email = $request->request->get('email');

            if (empty($name) || empty($email) || empty($subscriptionId) || empty($cardNumber) || empty($cvv)) {
                $this->addFlash('error', 'Tous les champs sont requis.');
                return $this->redirectToRoute('subscribe');
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->addFlash('error', 'Adresse email invalide.');
                return $this->redirectToRoute('subscribe');
            }

            $subscription = $this->subscriptionConfig->getSubscriptionById((int)$subscriptionId);

            if (!$subscription) {
                $this->addFlash('error', 'Abonnement invalide.');
                return $this->redirectToRoute('subscribe');
            }

            try {
                $this->subscriptionService->subscribeUser(
                    $name, 
                    $email, 
                    (int)$subscriptionId, 
                    $cardNumber, 
                    (int)$cvv, 
                    $subscription['price']
                );
                $this->addFlash('success', 'Abonnement souscrit avec succès ! Un email de confirmation sera envoyé à ' . $email);
            } catch (\Exception $e) {
                $this->addFlash('error', 'Erreur : ' . $e->getMessage());
            }

            return $this->redirectToRoute('subscribe');
        }

        return $this->render('subscribe/index.html.twig', [
            'subscriptions' => $subscriptions
        ]);
    }
}

