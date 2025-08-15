<?php

namespace App\Service\Payment;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PaymentService implements PaymentInterface
{
    private HttpClientInterface $client;
    private string $apiUrl;

    public function __construct(HttpClientInterface $client, ParameterBagInterface $params)
    {
        $this->client = $client;
        $this->apiUrl = $params->get('payment.api_url');
    }

    public function createUser(int $userId, string $cardNumber, int $cvv): void
    {
        $this->client->request('POST', $this->apiUrl . '/user', [
            'json' => [
                'user_id' => $userId,
                'card_number' => $cardNumber,
                'cvv' => $cvv
            ]
        ]);
    }

    public function createTransaction(int $userId, float $amount): string
    {
        $response = $this->client->request('POST', $this->apiUrl . '/transaction', [
            'json' => [
                'user_id' => $userId,
                'amount' => $amount
            ]
        ]);

        $data = $response->toArray();
        return $data['transaction_id'] ?? 'N/A';
    }

    public function updatePaymentMethod(int $userId, string $cardNumber, int $cvv, string $holderName = ''): void
    {
        $this->client->request('PUT', $this->apiUrl . '/user/' . $userId, [
            'json' => [
                'card_number' => $cardNumber,
                'cvv' => $cvv,
                'holder_name' => $holderName
            ]
        ]);
    }
}
