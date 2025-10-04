#!/bin/bash
# Environment Switch Helper Script
# Usage: ./switch-env.sh [development|production|example]

case "$1" in
    "development" | "dev")
        echo "🚀 Switching to DEVELOPMENT environment..."
        cp .env.development .env
        echo "✅ Copied .env.development to .env"
        echo "🔧 You can now run: docker-compose -f docker-compose.dev.yml up --build"
        ;;
    
    "production" | "prod")
        echo "🏭 Switching to PRODUCTION environment..."
        cp .env.production .env
        echo "✅ Copied .env.production to .env"
        echo "⚠️  REMEMBER: Change passwords and secrets before deployment!"
        echo "🚀 You can now run: docker-compose -f docker-compose.prod.yml up --build"
        ;;
    
    "example" | "template")
        echo "📝 Switching to EXAMPLE template..."
        cp .env.example .env
        echo "✅ Copied .env.example to .env"
        echo "✏️  Please edit .env and fill in your values"
        ;;
    
    *)
        echo "🤔 Environment Switch Helper"
        echo ""
        echo "Usage: $0 [environment]"
        echo ""
        echo "Available environments:"
        echo "  development | dev     - Development environment with hot reload"
        echo "  production  | prod    - Production environment (secure)"
        echo "  example     | template - Template with example values"
        echo ""
        echo "Current .env configuration:"
        if [ -f .env ]; then
            echo "NODE_ENV: $(grep '^NODE_ENV=' .env | cut -d'=' -f2)"
            echo "POSTGRES_DB: $(grep '^POSTGRES_DB=' .env | cut -d'=' -f2)"
            echo "DEBUG: $(grep '^DEBUG=' .env | cut -d'=' -f2)"
        else
            echo "❌ No .env file found"
        fi
        ;;
esac