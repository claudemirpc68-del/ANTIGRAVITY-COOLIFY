$url = "https://n8n.srv1067081.hstgr.cloud/webhook/contatos"
$body = '{"operation":"read"}'
Write-Host "Checking URL: $url"
try {
    $r = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "Status Code: $($r.StatusCode)"
    Write-Host "Headers:"
    $r.Headers | Out-String | Write-Host
    Write-Host "Content:"
    $r.Content | Write-Host
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
}
