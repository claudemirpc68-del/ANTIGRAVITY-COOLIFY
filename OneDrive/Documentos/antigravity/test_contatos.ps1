$url = "https://n8n.srv1067081.hstgr.cloud/webhook-test/contatos"

Write-Host "=== TESTE DO WORKFLOW CONTATOS ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Criar um contato
Write-Host "📝 TESTE 1: CRIAR CONTATO" -ForegroundColor Yellow
$createBody = @{
    operation = "create"
    data      = @{
        nome_completo = "Maria Silva Santos"
        email         = "maria.santos@example.com"
        telefone      = "(11) 98765-4321"
        estado        = "SP"
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $createBody -ContentType "application/json"
    Write-Host "✅ Sucesso! Contato criado:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Teste 2: Listar todos os contatos
Write-Host "📋 TESTE 2: LISTAR CONTATOS" -ForegroundColor Yellow
$readBody = @{
    operation = "read"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $readBody -ContentType "application/json"
    Write-Host "✅ Sucesso! Contatos encontrados:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TESTES CONCLUÍDOS ===" -ForegroundColor Cyan
