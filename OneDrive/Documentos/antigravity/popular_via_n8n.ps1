$url = "https://n8n.srv1067081.hstgr.cloud/webhook/contatos-final"

$contatos = @(
    @{ nome_completo = "Carlos"; sobrenome = "Eduardo"; email = "carlos.eduardo@email.com"; telefone = "(11) 91234-5678"; estado = "SP"; empresa = "Tech Solutions"; categoria = "Cliente"; observacoes = "Interessado em consultoria de nuvem" },
    @{ nome_completo = "Beatriz"; sobrenome = "Santos"; email = "beatriz.santos@parceiro.com"; telefone = "(21) 98888-7777"; estado = "RJ"; empresa = "Santos & Co"; categoria = "Parceiro"; observacoes = "Parceria estratégica iniciada em Janeiro" },
    @{ nome_completo = "Ricardo"; sobrenome = "Mendes"; email = "r.mendes@fornecedor.com"; telefone = "(31) 97777-6666"; estado = "MG"; empresa = "Global Logística"; categoria = "Fornecedor"; observacoes = "Entrega rápida de insumos" },
    @{ nome_completo = "Juliana"; sobrenome = "Almeida"; email = "juliana.lead@site.com"; telefone = "(41) 96666-5555"; estado = "PR"; empresa = "Almeida Negócios"; categoria = "Lead"; observacoes = "Baixou o ebook de automação" },
    @{ nome_completo = "Fernando"; sobrenome = "Costa"; email = "fernando.costa@empresa.com"; telefone = "(51) 95555-4444"; estado = "RS"; empresa = "Costa Inc"; categoria = "Cliente"; observacoes = "Cliente recorrente desde 2023" },
    @{ nome_completo = "Patrícia"; sobrenome = "Gomes"; email = "patricia.gomes@email.com"; telefone = "(61) 94444-3333"; estado = "DF"; empresa = "Gomes Jurídico"; categoria = "Cliente"; observacoes = "Assunto: Renovação de contrato" },
    @{ nome_completo = "Sérgio"; sobrenome = "Pinto"; email = "sergio.p@fornecedor.com"; telefone = "(71) 93333-2222"; estado = "BA"; empresa = "Pinto Suprimentos"; categoria = "Fornecedor"; observacoes = "Material de escritório" },
    @{ nome_completo = "Aline"; sobrenome = "Vieira"; email = "aline.vieira@lead.com"; telefone = "(81) 92222-1111"; estado = "PE"; empresa = "Vieira Eventos"; categoria = "Lead"; observacoes = "Pediu orçamento por WhatsApp" },
    @{ nome_completo = "Maurício"; sobrenome = "Silva"; email = "m.silva@cliente.com"; telefone = "(85) 91111-0000"; estado = "CE"; empresa = "Maurício ME"; categoria = "Cliente"; observacoes = "Foco em manutenção preventiva" },
    @{ nome_completo = "Camila"; sobrenome = "Rocha"; email = "camila.rocha@email.com"; telefone = "(98) 90000-1111"; estado = "MA"; empresa = "Rocha Design"; categoria = "Parceiro"; observacoes = "Desenvolvimento de logos" }
)

Write-Host "🚀 Iniciando população de contatos via n8n..." -ForegroundColor Cyan
Write-Host "URL: $url"

foreach ($contato in $contatos) {
    $body = @{
        operation = "create"
        data      = $contato
    } | ConvertTo-Json -Depth 5

    Write-Host "Enviando: $($contato.nome_completo) ($($contato.email))..." -NoNewline
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
        Write-Host " ✅ OK" -ForegroundColor Green
    }
    catch {
        Write-Host " ❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Pequena pausa para não sobrecarregar
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "✨ Processo concluído!" -ForegroundColor Green
