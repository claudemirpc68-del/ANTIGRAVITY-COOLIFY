# Workflow n8n - Tabela Contatos

## 📋 Visão Geral
Este workflow gerencia a tabela **`contatos`** no Supabase (projeto FEVEREIRO_NEW).

## 🗂️ Estrutura da Tabela
- **nome_completo** (text, obrigatório)
- **sobrenome** (text, opcional)
- **email** (text, obrigatório, único, validado)
- **telefone** (text, opcional)
- **estado** (text, opcional)
- **empresa** (text, opcional)
- **categoria** (text, opcional)
- **observacoes** (text, opcional)

## 🚀 Como Usar

### 1. Criar a Tabela no Supabase
Execute o arquivo `contatos_schema.sql` no SQL Editor do Supabase.

### 2. Importar o Workflow no n8n
1. Abra seu n8n: `https://n8n.srv1067081.hstgr.cloud`
2. Importe o arquivo `contatos_workflow.json`
3. Configure as credenciais do Supabase

### 3. URL do Webhook
**Teste:** `https://n8n.srv1067081.hstgr.cloud/webhook-test/contatos-final`
**Produção:** `https://n8n.srv1067081.hstgr.cloud/webhook/contatos-final`

## 📝 Exemplos de Requisições

### Criar Contato
```json
{
  "operation": "create",
  "data": {
    "nome_completo": "João",
    "sobrenome": "Silva",
    "email": "joao@example.com",
    "telefone": "(11) 98765-4321",
    "estado": "SP",
    "empresa": "Tech Solutions",
    "categoria": "Cliente",
    "observacoes": "Contato inicial via site"
  }
}
```

### Listar Todos os Contatos
```json
{
  "operation": "read"
}
```

### Atualizar Contato
```json
{
  "operation": "update",
  "id": 1,
  "data": {
    "telefone": "(11) 91234-5678"
  }
}
```

### Deletar Contato
```json
{
  "operation": "delete",
  "id": 1
}
```

## 🧪 Teste Rápido (PowerShell)
```powershell
$url = "https://n8n.srv1067081.hstgr.cloud/webhook-test/contatos"
$body = @{
    operation = "create"
    data = @{
        nome_completo = "Maria Santos"
        email = "maria@example.com"
        telefone = "(21) 99999-8888"
        estado = "RJ"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
```
