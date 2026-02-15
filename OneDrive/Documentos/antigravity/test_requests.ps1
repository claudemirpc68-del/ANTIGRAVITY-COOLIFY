$url = "https://n8n.srv1067081.hstgr.cloud/webhook-test/agent"

Write-Host "--- TESTE 1: CRIAR DOCUMENTO ---"
$createBody = @{
    operation = "create"
    data      = @{
        title    = "Teste Automático"
        content  = "Funciona! O agente enviou isso."
        metadata = @{ origem = "powershell" }
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $createBody -ContentType "application/json"
    Write-Host "Sucesso! Resposta do n8n:"
    $response | ConvertTo-Json
}
catch {
    Write-Host "Erro: $_"
    Write-Host "Dica: Verifique se o n8n está rodando e se o botão 'Execute Workflow' (Listening) está ativo."
}
