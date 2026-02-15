# Regras de Customização e Melhores Práticas - Coolify

Este documento define as regras para evitar erros de deploy no Coolify, especialmente em estruturas Monorepo.

## Checklist Anti-Erro para Monorepos

### 1. Crie `nixpacks.toml` Antecipadamente
- **Regra:** Sempre coloque um arquivo `nixpacks.toml` na raiz de cada subprojeto que será deployado.
- **Configuração:** Defina explicitamente o provider para evitar falhas na detecção automática.
  ```toml
  # Exemplo para Node.js/Next.js
  providers = ["node"]
  
  [variables]
  NODE_ENV = "production"
  ```

### 2. Configure `base_directory` Imediatamente
- **Regra:** Assim que criar a aplicação no Coolify (e **antes** do primeiro deploy), acesse as configurações (`Settings`) e defina o **Base Directory** correto (ex: `/subprojeto`).
- **Comando SQL (Alternativa):**
  ```sql
  UPDATE applications SET base_directory = '/caminho/do/projeto' WHERE uuid = 'uuid-da-aplicacao';
  ```

### 3. Use Dockerfile se Necessário
- **Regra:** Para projetos muito complexos onde o Nixpacks falha consistentemente, crie um `Dockerfile` na raiz do subprojeto. O Coolify priorizará o Dockerfile.

---
*Este arquivo deve ser consultado antes de iniciar novos deploys no Coolify.*
