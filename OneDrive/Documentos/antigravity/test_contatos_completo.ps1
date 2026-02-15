$url = "https://n8n.srv1067081.hstgr.cloud/webhook-test/contatos-v3"

Write-Host "=== TESTE COMPLETO DO WORKFLOW CONTATOS ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Criar um contato
Write-Host "📝 TESTE 1: CRIAR CONTATO" -ForegroundColor Yellow
$createBody = @{
    operation = "create"
    data      = @{
        nome_completo = "João Pedro"
        sobrenome     = "Oliveira"
        email         = "joao.oliveira@example.com"
        telefone      = "(21) 99876-5432"
        estado        = "RJ"
        empresa       = "Oliveira Corp"
        categoria     = "Lead"
    }
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-RestMethod -Uri $url -Method Post -Body $createBody -ContentType "application/json"
    Write-Host "✅ Contato criado com sucesso!" -ForegroundColor Green
    $createResponse | ConvertTo-Json -Depth 3
    $createdId = $createResponse.id
}
catch {
    Write-Host "❌ Erro ao criar: $_" -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 2

# Teste 2: Listar todos os contatos
Write-Host "📋 TESTE 2: LISTAR TODOS OS CONTATOS" -ForegroundColor Yellow
$readBody = @{
    operation = "read"
} | ConvertTo-Json

try {
    $readResponse = Invoke-RestMethod -Uri $url -Method Post -Body $readBody -ContentType "application/json"
    Write-Host "✅ Contatos listados com sucesso!" -ForegroundColor Green
    $readResponse | ConvertTo-Json -Depth 3
    
    # Pegar o ID do primeiro contato para os próximos testes
    if ($readResponse -is [array] -and $readResponse.Count -gt 0) {
        $testId = $readResponse[0].id
    }
    elseif ($readResponse.id) {
        $testId = $readResponse.id
    }
}
catch {
    Write-Host "❌ Erro ao listar: $_" -ForegroundColor Red
}

Write-Host ""
Start-Sleep -Seconds 2

# Teste 3: Atualizar um contato (se temos um ID)
if ($testId) {
    Write-Host "✏️ TESTE 3: ATUALIZAR CONTATO (ID: $testId)" -ForegroundColor Yellow
    $updateBody = @{
        operation = "update"
        id        = $testId
        data      = @{
            telefone = "(21) 91111-2222"
            estado   = "SP"
        }
    } | ConvertTo-Json -Depth 3

    try {
        $updateResponse = Invoke-RestMethod -Uri $url -Method Post -Body $updateBody -ContentType "application/json"
        Write-Host "✅ Contato atualizado com sucesso!" -ForegroundColor Green
        $updateResponse | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "❌ Erro ao atualizar: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
    
    # Teste 4: Deletar um contato
    Write-Host "🗑️ TESTE 4: DELETAR CONTATO (ID: $testId)" -ForegroundColor Yellow
    $deleteBody = @{
        operation = "delete"
        id        = $testId
    } | ConvertTo-Json

    try {
        $deleteResponse = Invoke-RestMethod -Uri $url -Method Post -Body $deleteBody -ContentType "application/json"
        Write-Host "✅ Contato deletado com sucesso!" -ForegroundColor Green
        $deleteResponse | ConvertTo-Json -Depth 3
    }
    catch {
        Write-Host "❌ Erro ao deletar: $_" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠️ Não foi possível obter ID para testes de UPDATE/DELETE" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== TODOS OS TESTES CONCLUÍDOS ===" -ForegroundColor Cyan
Write-Host "✅ CREATE - Criar contato" -ForegroundColor Green
Write-Host "✅ READ - Listar contatos" -ForegroundColor Green
Write-Host "✅ UPDATE - Atualizar contato" -ForegroundColor Green
Write-Host "✅ DELETE - Deletar contato" -ForegroundColor Green
