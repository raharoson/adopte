<?php

namespace App\Controller;

use App\Service\DatabaseService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ApiController extends AbstractController
{
    #[Route('/health', name: 'health_check', methods: ['GET'])]
    public function healthCheck(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'timestamp' => date('Y-m-d H:i:s'),
            'service' => 'microservice'
        ]);
    }

    #[Route('/', name: 'api_info', methods: ['GET'])]
    public function info(): JsonResponse
    {
        return new JsonResponse([
            'name' => 'Microservice API',
            'version' => '1.0.0',
            'framework' => 'Symfony 6.4'
        ]);
    }

    #[Route('/database', name: 'database_test', methods: ['GET'])]
    public function databaseTest(): JsonResponse
    {
        try {
            $db = new DatabaseService();
            $isConnected = $db->testConnection();
            
            if ($isConnected) {
                // Test a simple query
                $result = $db->query('SELECT NOW() as current_datetime, VERSION() as mysql_version');
                
                return new JsonResponse([
                    'status' => 'connected',
                    'mysql_info' => $result[0] ?? null
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'failed',
                    'error' => 'Could not connect to database'
                ], 500);
            }
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/users', name: 'users_demo', methods: ['GET'])]
    public function usersDemo(): JsonResponse
    {
        try {
            $db = new DatabaseService();
            
            // Create users table if not exists
            $createTable = "
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ";
            $db->execute($createTable);
            
            // Insert sample data if table is empty
            $count = $db->query('SELECT COUNT(*) as total FROM users')[0]['total'];
            if ($count == 0) {
                $db->execute('INSERT INTO users (name, email) VALUES (?, ?)', ['John Doe', 'john@example.com']);
                $db->execute('INSERT INTO users (name, email) VALUES (?, ?)', ['Jane Smith', 'jane@example.com']);
            }
            
            // Fetch all users
            $users = $db->query('SELECT * FROM users ORDER BY created_at DESC');
            
            return new JsonResponse([
                'status' => 'success',
                'users' => $users,
                'total' => count($users)
            ]);
            
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
