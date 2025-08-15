<?php

namespace App\Service;

use PDO;
use PDOException;

class DatabaseService
{
    private ?PDO $pdo = null;
    
    public function __construct()
    {
        $this->connect();
    }
    
    private function connect(): void
    {
        $host = $_ENV['MYSQL_HOST'] ?? 'mysql';
        $port = $_ENV['MYSQL_PORT'] ?? '3306';
        $database = $_ENV['MYSQL_DATABASE'] ?? 'microservice';
        $username = $_ENV['MYSQL_USER'] ?? 'user';
        $password = $_ENV['MYSQL_PASSWORD'] ?? 'password';
        
        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        
        try {
            $this->pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection(): PDO
    {
        if ($this->pdo === null) {
            $this->connect();
        }
        
        return $this->pdo;
    }
    
    public function testConnection(): bool
    {
        try {
            $stmt = $this->getConnection()->query('SELECT 1');
            return $stmt !== false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public function query(string $sql, array $params = []): array
    {
        $stmt = $this->getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    public function execute(string $sql, array $params = []): bool
    {
        $stmt = $this->getConnection()->prepare($sql);
        return $stmt->execute($params);
    }
}
