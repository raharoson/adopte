<?php

namespace App\Service\Payment;

interface PaymentInterface
{
    public function createUser(int $userId, string $cardNumber, int $cvv): void;
    public function createTransaction(int $userId, float $amount): string;
    public function updatePaymentMethod(int $userId, string $cardNumber, int $cvv, string $holderName = ''): void;
}
