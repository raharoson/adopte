<?php

namespace App\Controller;

use App\Repository\UserRepositoryPDO;
use App\Service\SubscriptionConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/admin/users', name: 'admin_users')]
    public function listUsers(UserRepositoryPDO $userRepo, SubscriptionConfigService $subscriptionConfig): Response
    {
        $users = $userRepo->getAllUsers();
        
        // Mapping des types d'abonnement depuis le service
        $subscriptionTypes = $subscriptionConfig->getSubscriptionTypes();
        
        // Enrichir les données utilisateur avec le nom de l'abonnement
        foreach ($users as &$user) {
            if ($user['subscription_id']) {
                $user['subscription_name'] = $subscriptionTypes[$user['subscription_id']] ?? 'Inconnu';
                $user['subscription_status'] = 'Actif';
            } else {
                $user['subscription_name'] = 'Aucun';
                $user['subscription_status'] = 'Inactif';
            }
        }
        
        return $this->render('admin/users.html.twig', [
            'users' => $users
        ]);
    }

    #[Route('/admin/revenue', name: 'admin_revenue', methods: ['GET', 'POST'])]
    public function calculateRevenue(Request $request, UserRepositoryPDO $userRepo, SubscriptionConfigService $subscriptionConfig): Response
    {
        $revenueData = null;
        $transactions = [];
        $subscriptionTypes = $subscriptionConfig->getSubscriptionTypes();
        
        $defaultStartDate = date('Y-m-d', strtotime('-7 days'));
        
        $startDate = $request->isMethod('POST') ? 
            $request->request->get('start_date', $defaultStartDate) : 
            $request->query->get('start_date', $defaultStartDate);
        $endDate = $request->isMethod('POST') ? 
            $request->request->get('end_date') : 
            $request->query->get('end_date');
        
        if ($request->isMethod('POST') || $request->query->get('auto') === '1') {
            if (empty($startDate) || empty($endDate)) {
                $this->addFlash('error', 'Les dates de début et de fin sont requises.');
            } elseif (strtotime($startDate) > strtotime($endDate)) {
                $this->addFlash('error', 'La date de début ne peut pas être postérieure à la date de fin.');
            } else {
                try {
                    $revenueData = $userRepo->getRevenueByDateRange($startDate, $endDate);
                    $transactions = $userRepo->getTransactionsByDateRange($startDate, $endDate);
                    
                    foreach ($transactions as &$transaction) {
                        $transaction['subscription_name'] = $subscriptionTypes[$transaction['subscription_id']] ?? 'Standard';
                    }
                    
                    if ($revenueData['totals']['total_revenue'] == 0) {
                        $this->addFlash('info', 'Aucune transaction trouvée pour cette période.');
                    }
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Erreur lors du calcul du chiffre d\'affaires : ' . $e->getMessage());
                }
            }
        }
        
        return $this->render('admin/revenue.html.twig', [
            'revenue_data' => $revenueData,
            'transactions' => $transactions,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'subscription_types' => $subscriptionTypes
        ]);
    }
}
