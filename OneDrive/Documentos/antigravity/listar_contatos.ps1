$url = "https://n8n.srv1067081.hstgr.cloud/webhook/contatos-final"

Write-Host "Listando todos os contatos..." -ForegroundColor Cyan
Write-Host ""

$body = '{"operation":"read"}'

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "Contatos encontrados!" -ForegroundColor Green
    Write-Host ""
    $response | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "Erro ao listar contatos" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
