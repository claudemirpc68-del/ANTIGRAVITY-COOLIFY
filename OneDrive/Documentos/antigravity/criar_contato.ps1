$url = "https://n8n.srv1067081.hstgr.cloud/webhook/contatos-final"

Write-Host "Criando contato fictício..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    operation = "create"
    data      = @{
        nome_completo = "Roberto"
        sobrenome     = "Alencar"
        email         = "roberto.alencar@consultoria.com"
        telefone      = "(11) 92233-4455"
        estado        = "SP"
        empresa       = "Alencar Consultoria"
        categoria     = "Parceiro"
        observacoes   = "Contato via indicação"
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Contato criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dados do contato:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "❌ Erro ao criar contato: $_" -ForegroundColor Red
}
