# Makefile for Docker Microservice

.PHONY: help build up down restart logs bash test clean

# Default command
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker images
	docker-compose build

up: ## Start containers
	docker-compose up -d

down: ## Stop containers
	docker-compose down

restart: ## Restart containers
	docker-compose down && docker-compose up -d

logs: ## View logs
	docker-compose logs -f

logs-app: ## View app logs
	docker-compose logs -f app

logs-nginx: ## View nginx logs
	docker-compose logs -f nginx

logs-mysql: ## View mysql logs
	docker-compose logs -f mysql

bash: ## Access app container bash
	docker-compose exec app bash

bash-nginx: ## Access nginx container bash
	docker-compose exec nginx sh

bash-mysql: ## Access mysql container bash
	docker-compose exec mysql bash

mysql-cli: ## Access MySQL CLI
	docker-compose exec mysql mysql -u root -p

cache-clear: ## Clear Symfony cache
	docker-compose exec app php bin/console cache:clear

composer-install: ## Install composer dependencies
	docker-compose exec app composer install

composer-update: ## Update composer dependencies
	docker-compose exec app composer update

test: ## Run tests
	docker-compose exec app php bin/phpunit

clean: ## Clean up containers and volumes
	docker-compose down -v
	docker system prune -f

status: ## Show container status
	docker-compose ps

rebuild: ## Rebuild and restart containers
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
