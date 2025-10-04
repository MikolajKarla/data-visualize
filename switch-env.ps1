# Environment Switch Helper Script for Windows PowerShell
# Usage: .\switch-env.ps1 [development|production|example]

param(
    [Parameter(Position=0)]
    [string]$Environment
)

switch ($Environment.ToLower()) {
    { $_ -in "development", "dev" } {
        Write-Host "🚀 Switching to DEVELOPMENT environment..." -ForegroundColor Green
        Copy-Item ".env.development" ".env" -Force
        Write-Host "✅ Copied .env.development to .env" -ForegroundColor Green
        Write-Host "🔧 You can now run: docker-compose -f docker-compose.dev.yml up --build" -ForegroundColor Cyan
    }
    
    { $_ -in "production", "prod" } {
        Write-Host "🏭 Switching to PRODUCTION environment..." -ForegroundColor Yellow
        Copy-Item ".env.production" ".env" -Force
        Write-Host "✅ Copied .env.production to .env" -ForegroundColor Green
        Write-Host "⚠️  REMEMBER: Change passwords and secrets before deployment!" -ForegroundColor Red
        Write-Host "🚀 You can now run: docker-compose -f docker-compose.prod.yml up --build" -ForegroundColor Cyan
    }
    
    { $_ -in "example", "template" } {
        Write-Host "📝 Switching to EXAMPLE template..." -ForegroundColor Blue
        Copy-Item ".env.example" ".env" -Force
        Write-Host "✅ Copied .env.example to .env" -ForegroundColor Green
        Write-Host "✏️  Please edit .env and fill in your values" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "🤔 Environment Switch Helper" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Usage: .\switch-env.ps1 [environment]" -ForegroundColor White
        Write-Host ""
        Write-Host "Available environments:" -ForegroundColor White
        Write-Host "  development | dev     - Development environment with hot reload" -ForegroundColor Green
        Write-Host "  production  | prod    - Production environment (secure)" -ForegroundColor Yellow
        Write-Host "  example     | template - Template with example values" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Current .env configuration:" -ForegroundColor White
        
        if (Test-Path ".env") {
            $nodeEnv = (Get-Content ".env" | Select-String "^NODE_ENV=" | ForEach-Object { $_.Line.Split('=')[1] })
            $postgresDb = (Get-Content ".env" | Select-String "^POSTGRES_DB=" | ForEach-Object { $_.Line.Split('=')[1] })
            $debug = (Get-Content ".env" | Select-String "^DEBUG=" | ForEach-Object { $_.Line.Split('=')[1] })
            
            Write-Host "NODE_ENV: $nodeEnv" -ForegroundColor Cyan
            Write-Host "POSTGRES_DB: $postgresDb" -ForegroundColor Cyan
            Write-Host "DEBUG: $debug" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ No .env file found" -ForegroundColor Red
        }
    }
}