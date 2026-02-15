# Instruções: Managed Supabase Global Workflow

Este workflow permite gerenciar **qualquer tabela** do seu projeto Supabase através de um único Webhook no n8n.

## Importação
1. No n8n, crie um novo workflow.
2. Clique no menu (três pontos) e selecione **"Import from File"**.
3. Selecione o arquivo `managed_supabase_workflow.json`.

## Configuração
Todos os nós do Supabase usarão a sua credencial padrão. 
Certifique-se de configurar a URL do projeto e a Service Role Key corretamente nas credenciais do n8n.

## Como Usar via API

Envie um POST para o Webhook com os seguintes campos:

| Campo | Descrição |
| :--- | :--- |
| `table` | Nome da tabela no Supabase (ex: `contatos`, `documents`, `produtos`). |
| `operation` | `create`, `read`, `update` ou `delete`. |
| `data` | (Para create/update) Objeto JSON com os campos. |
| `id` | (Para update/delete) O ID do registro. |

### Exemplos

**Criar novo registro:**
```json
{
  "table": "contatos",
  "operation": "create",
  "data": { "nome": "Maria Silva", "email": "maria@exemplo.com" }
}
```

**Listar registros:**
```json
{
  "table": "contatos",
  "operation": "read"
}
```

**Atualizar registro:**
```json
{
  "table": "documents",
  "operation": "update",
  "id": 123,
  "data": { "title": "Novo Título" }
}
```
