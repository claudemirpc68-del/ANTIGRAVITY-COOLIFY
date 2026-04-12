import Groq from 'groq-sdk';
import { emailAgent, calendarAgent, contactAgent, contentCreator } from './specialized-agents.js';
import { tavilyService } from '../services/tavily.js';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODEL = 'llama-3.3-70b-versatile';

let _groq = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

// Memória por chat (simulando o Simple Memory do n8n por session key = chat.id)
const memoryMap = new Map();

function getMemory(chatId) {
  if (!memoryMap.has(chatId)) memoryMap.set(chatId, []);
  return memoryMap.get(chatId);
}

function addToMemory(chatId, role, content) {
  const mem = getMemory(chatId);
  mem.push({ role, content });
  // Manter apenas as últimas 10 mensagens (window buffer)
  if (mem.length > 10) mem.shift();
}

// Prompt do sistema extraído de: Assistente_Pessoal_Completo.json
function buildSystemMessage() {
  return `# Visão Geral
Você é o JARVYS, o assistente pessoal de Claudemir Pedroso Cubas. Seu trabalho é enviar a solicitação do usuário para a ferramenta correta. Você nunca deve escrever e-mails ou criar resumos — apenas precisa chamar a ferramenta certa.

## Ferramentas
- **think**: Use esta ferramenta APENAS para pensar internamente. Ela não deve aparecer na resposta. Após usar, forneça a resposta diretamente sem mencionar a ferramenta.
- **emailAgent**: Use esta ferramenta para realizar ações no e-mail.
- **calendarAgent**: Use esta ferramenta para realizar ações no calendário.
- **contactAgent**: Use esta ferramenta para obter, atualizar ou adicionar contatos.
- **contentCreator**: Use esta ferramenta para criar postagens de blog.
- **tavilySearch**: Use esta ferramenta para pesquisar na web.

## Regras
- Algumas ações exigem que você busque informações de contato primeiro. Para as seguintes ações, é necessário obter as informações de contato e enviá-las ao agente responsável:
  - enviar e-mails
  - redigir e-mails
  - criar evento no calendário com participante (sempre enviar o nome e email do contato)

## Instruções
1) Chame as ferramentas necessárias com base na solicitação do usuário
2) Use a ferramenta "think" para verificar se você tomou as medidas corretas. Esta ferramenta deve ser chamada sempre que ficar preso ou precisar pensar profundamente.

## Exemplos
1)
  - Entrada: envie um e-mail para o Felipe Almeida perguntando que horas ele quer sair
  - Ação: Use o contactAgent para obter o e-mail do Felipe Almeida
  - Ação: Use o emailAgent para enviar o e-mail. Você passará à ferramenta uma solicitação como:
    "envie um e-mail para Felipe Almeida perguntando que horas ele quer sair. aqui está o e-mail dele: [endereço de e-mail]"
  - Saída: O e-mail foi enviado para Felipe Almeida. Posso ajudar em mais alguma coisa?

## Lembretes Finais
Aqui está a data/hora atual: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'think',
      description: 'Use para pensar profundamente antes de agir. Sempre entregue o input como parte do output.',
      parameters: {
        type: 'object',
        properties: {
          thought: { type: 'string', description: 'O raciocínio sobre o que fazer a seguir' }
        },
        required: ['thought']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'emailAgent',
      description: 'Chame esta ferramenta para quaisquer ações relacionadas a e-mail.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'A instrução completa para o agente de e-mail' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'calendarAgent',
      description: 'Chame esta ferramenta para quaisquer ações relacionadas ao calendário.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'A instrução completa para o agente de calendário' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'contactAgent',
      description: 'Chame esta ferramenta para quaisquer ações relacionadas a contatos.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'A instrução completa para o agente de contatos' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'contentCreator',
      description: 'Chame esta ferramenta para criar postagens de blog.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'O tema ou pedido de criação de conteúdo' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'tavilySearch',
      description: 'Use esta ferramenta para pesquisar na web.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'O que pesquisar na internet' }
        },
        required: ['query']
      }
    }
  }
];

async function executeTool(name, args) {
  console.log(`[JARVYS] 🔧 Ferramenta ativada: ${name}`);
  switch (name) {
    case 'think':
      console.log(`[JARVYS] 💭 Pensamento: ${args.thought}`);
      return '';
    case 'emailAgent':
      return await emailAgent(args.query);
    case 'calendarAgent':
      return await calendarAgent(args.query);
    case 'contactAgent':
      return await contactAgent(args.query);
    case 'contentCreator':
      return await contentCreator(args.query);
    case 'tavilySearch':
      return await tavilyService.search(args.query);
    default:
      return 'Ferramenta desconhecida.';
  }
}

export async function processMessage(chatId, userText) {
  console.log(`[JARVYS] 📩 Usuário (${chatId}): "${userText}"`);
  addToMemory(chatId, 'user', userText);

  const messages = [
    { role: 'system', content: buildSystemMessage() },
    ...getMemory(chatId)
  ];

  try {
    // Loop de agente: permite múltiplas chamadas de ferramentas encadeadas
    let maxIterations = 5;
    while (maxIterations-- > 0) {
      let response;
      try {
        response = await getGroq().chat.completions.create({
          model: GROQ_MODEL,
          messages,
          tools: TOOLS,
          tool_choice: 'auto',
          parallel_tool_calls: false
        });
      } catch (toolErr) {
        // Groq retornou erro de tool_use_failed — tentar sem ferramentas
        console.warn('[JARVYS] ⚠️ Falha no tool_use, tentando resposta direta...');
        response = await getGroq().chat.completions.create({
          model: GROQ_MODEL,
          messages
        });
      }

      const msg = response.choices[0].message;
      messages.push(msg);

      // Sem mais tool_calls: resposta final
      if (!msg.tool_calls?.length) {
        let finalText = msg.content || 'Tarefa concluída.';
        // Limpar saídas de funções vazias ou boilerplate
        finalText = finalText.replace(/<function=\w+>\{[^}]+\}<\/function>/g, '').trim();
        if (!finalText) finalText = 'Tarefa concluída.';
        addToMemory(chatId, 'assistant', finalText);
        console.log(`[JARVYS] ✅ Resposta: "${finalText.substring(0, 80)}..."`);
        return finalText;
      }

      // Executar todas as ferramentas solicitadas
      const toolResults = [];
      for (const tc of msg.tool_calls) {
        try {
          const args = JSON.parse(tc.function.arguments);
          const result = await executeTool(tc.function.name, args);
          toolResults.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: String(result)
          });
        } catch (parseErr) {
          console.warn(`[JARVYS] ⚠️ Erro ao executar ferramenta ${tc.function.name}:`, parseErr.message);
          toolResults.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: 'Erro ao executar a ferramenta. Tente de outra forma.'
          });
        }
      }
      messages.push(...toolResults);
    }

    return 'Desculpe, Claudemir. Não consegui completar a tarefa a tempo. Pode reformular?';
  } catch (err) {
    console.error('[JARVYS] ❌ Erro no orquestrador:', err.message);
    return 'Tive um problema interno ao processar. Por favor, tente novamente.';

  }
}
