# ESCALA_FÁCIL

## 📌 Visão Geral
ESCALA_FÁCIL é um assistente virtual desenvolvido para apoiar a gestão de escalas de trabalho no Supermercado Assaí.  
Ele organiza a escala 6x1, garante 2 domingos de folga por mês e facilita a comunicação entre colaboradores e gestores.  
O bot possui identidade visual própria (**avatar + slogan**) e está integrado com a base de dados dos colaboradores.

---

## 🎯 Objetivos
- Automatizar consultas de escala semanal e próximas folgas.
- Permitir solicitações de troca de turno, justificativas e mudanças de setor.
- Facilitar a comunicação direta entre colaboradores e gestores.
- Garantir que o gestor tenha sempre a última palavra nas decisões.

---

## 🧩 Estrutura do Projeto
```
ESCALA_FÁCIL/
│
├── skill_config/
│   ├── skill_escala.json       → Regras, intents, menus e permissões
│   └── colaboradores.json      → Cadastro completo dos colaboradores
│
├── assets/
│   ├── avatar_escala_facil.png → Identidade visual do bot
│   └── identidade_visual.md    → Manual de identidade (cores, tom de voz, slogan)
│
├── conversas_exemplo/
│   ├── colaborador_fluxo.md    → Exemplo de conversa com colaborador
│   └── gestor_fluxo.md         → Exemplo de conversa com gestor
│
├── docs/
│   ├── apresentacao_gerente.md → Texto base para apresentação do projeto
│   └── fluxograma_bot.png      → Organograma visual do fluxo de decisões
│
└── README.md                   → Visão geral do projeto
```

---

## 🤖 Identidade do Bot
- **Nome:** ESCALA_FÁCIL  
- **Avatar:** `avatar_escala_facil.png`  
- **Slogan:** *"Organizando sua escala para que você faça toda a diferença!"*  
- **Tom de voz:** Amigável, claro e objetivo, sempre reforçando que o gestor tem a última palavra.

---

## 📲 Fluxos de Interação

### Colaborador
```
Usuário: 7101309
Bot ESCALA_FÁCIL:
  Nome: CLAUDEMIR
  Função: OP. LOJA
  Horário: 14:30
  Sua próxima folga está prevista para domingo, 22/03.
  Atenção: o gestor tem a última palavra.
```

### Gestor
```
Usuário: 101010
Bot ESCALA_FÁCIL:
  Bem-vindo, Anderson Cubas (Gestor).
  Menu disponível:
    1 - Aprovar/Rejeitar trocas
    2 - Validar justificativas
    3 - Ajustar escala
    4 - Gerar relatórios
    5 - Enviar comunicado
```

---

## 🚀 Próximos Passos
1. Testar fluxos básicos no Antigravity (colaborador e gestor).  
2. Validar integração entre Skill JSON e Cadastro JSON.  
3. Refinar intents e mensagens conforme feedback da equipe.  
4. Preparar apresentação oficial para a gerente com avatar e fluxograma.  
