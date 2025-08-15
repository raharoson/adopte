<?php

namespace App\Service;

use PDO;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PdoFactory
{
    private ParameterBagInterface $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }

    public function create(): PDO
    {
        $host = $this->params->get('database.host');
        $database = $this->params->get('database.name');
        $username = $this->params->get('database.user');
        $password = $this->params->get('database.password');
        $charset = $this->params->get('database.charset');
        $port = $this->params->get('database.port') ?? '3306';

        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $database, $charset);

        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
