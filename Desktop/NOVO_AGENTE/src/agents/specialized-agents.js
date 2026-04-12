import Groq from 'groq-sdk';
import { gmailService, calendarService, contactService } from '../services/google.js';
import { tavilyService } from '../services/tavily.js';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODEL = 'llama-3.3-70b-versatile';

let _groq = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const SIGNATURE = process.env.SIGNATURE || 'Claudemir Pedroso Cubas';
const DEFAULT_EMAIL = process.env.DEFAULT_EMAIL || 'claudemirpc68@gmail.com';

// =======================
// AGENTE DE EMAIL
// Prompt extraído de: Agente_de_Email (1).json
// =======================
export async function emailAgent(query) {
  const systemMessage = `# Visão Geral
Você é um assistente de gerenciamento de e-mails. Todos os e-mails devem ser formatados profissionalmente em HTML e assinados como "${SIGNATURE}".

**Ferramentas de Gerenciamento de E-mail**
- Use "enviarEmail" para enviar e-mails.
- Use "criarEsboco" se o usuário pedir um rascunho (não enviar).
- Use "buscarEmails" para recuperar e-mails quando solicitado.
- Use "marcarComoNaoVisualizado" para marcar um e-mail como não lido.
- Use "adicionarEtiqueta" para marcar um e-mail com uma etiqueta.
- Use "responderEmail" para responder a um e-mail.

## Observações Finais
- Aqui está a data/hora atual: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;

  const tools = [
    {
      type: 'function',
      function: {
        name: 'enviarEmail',
        description: 'Enviar um e-mail',
        parameters: {
          type: 'object',
          properties: {
            emailAddress: { type: 'string', description: 'Endereço de e-mail do destinatário' },
            subject: { type: 'string', description: 'Assunto do e-mail' },
            emailBody: { type: 'string', description: 'Corpo do e-mail em HTML' }
          },
          required: ['emailAddress', 'subject', 'emailBody']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'buscarEmails',
        description: 'Recuperar e-mails da caixa de entrada',
        parameters: {
          type: 'object',
          properties: {
            sender: { type: 'string', description: 'Filtrar por remetente (opcional)' },
            limit: { type: 'string', description: 'Quantos e-mails retornar (número)' }
          }
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'buscarEmail',
        description: 'Abrir/details um e-mail específico pelo ID',
        parameters: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID do e-mail' }
          },
          required: ['id']
        }
      }
    }
  ];

  const response = await getGroq().chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: query }
    ],
    tools,
    tool_choice: 'auto'
  });

  const msg = response.choices[0].message;
  if (msg.tool_calls?.length) {
    const results = [];
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments);
      if (tc.function.name === 'enviarEmail') {
        const bodyWithSig = args.emailBody + `<br><br>---<br><i>${SIGNATURE}</i>`;
        const result = await gmailService.sendEmail(args.emailAddress, args.subject, bodyWithSig);
        results.push(result);
      } else if (tc.function.name === 'buscarEmails') {
        const limit = parseInt(args.limit) || 5;
        const emails = await gmailService.listEmails(args.sender ? `from:${args.sender}` : '', limit);
        
        if (emails.length === 0) {
          results.push('Nenhum e-mail encontrado.');
        } else {
          const details = [];
          for (const em of emails.slice(0, limit)) {
            try {
              const full = await gmailService.getEmail(em.id);
              const headers = full.payload?.headers || [];
              const subject = headers.find(h => h.name === 'Subject')?.value || 'Sem assunto';
              const from = headers.find(h => h.name === 'From')?.value || 'Desconhecido';
              const date = headers.find(h => h.name === 'Date')?.value || '';
              const snippet = full.snippet || '';
              details.push(`📧 De: ${from}\n📝 Assunto: ${subject}\n📅 Data: ${date}\n💬 ${snippet}\n---`);
            } catch (e) {
              details.push(`ID: ${em.id} (erro ao buscar detalhes)`);
            }
          }
          results.push(details.join('\n\n'));
        }
      } else if (tc.function.name === 'buscarEmail') {
        try {
          const email = await gmailService.getEmail(args.id);
          const headers = email.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || 'Sem assunto';
          const from = headers.find(h => h.name === 'From')?.value || 'Desconhecido';
          const date = headers.find(h => h.name === 'Date')?.value || '';
          const snippet = email.snippet || '';
          results.push(`📧 De: ${from}\n📝 Assunto: ${subject}\n📅 Data: ${date}\n💬 Prévia: ${snippet}`);
        } catch (e) {
          results.push('E-mail não encontrado.');
        }
      }
    }
    return results.join('\n');
  }
  return msg.content;
}

// =======================
// AGENTE DE CALENDÁRIO
// Prompt extraído de: Agente_de_Calend_rio (1).json
// =======================
export async function calendarAgent(query) {
  const systemMessage = `# Visão Geral
Você é um assistente de calendário. Suas responsabilidades incluem criar, obter e excluir eventos no calendário do usuário. Sempre envie o link desse evento alterado/criado como parte do output.

**Ferramentas de Gerenciamento de Calendário**
- Use "criarEventoComParticipante" quando um evento incluir um participante.
- Use "criarEvento" para eventos individuais.
- Use "buscarEventos" para buscar agendas do calendário quando solicitado.
- Use "apagarEvento" para excluir um evento. Você deve usar primeiro o "buscarEventos" para obter o ID do evento a ser excluído.
- Use "atualizarEvento" para atualizar um evento. Você deve usar primeiro o "buscarEventos" para obter o ID do evento a ser atualizado.

## Observações Finais
Aqui está a data/hora atual: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
Se a duração de um evento não for especificada, assuma que terá uma hora.`;

  const tools = [
    {
      type: 'function',
      function: {
        name: 'criarEvento',
        description: 'Criar um evento individual no calendário',
        parameters: {
          type: 'object',
          properties: {
            eventTitle: { type: 'string' },
            eventStart: { type: 'string', description: 'ISO 8601 datetime, ex: 2025-04-12T10:00:00-03:00' },
            eventEnd: { type: 'string', description: 'ISO 8601 datetime' },
            description: { type: 'string' }
          },
          required: ['eventTitle', 'eventStart', 'eventEnd']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'criarEventoComParticipante',
        description: 'Criar evento com participante',
        parameters: {
          type: 'object',
          properties: {
            eventTitle: { type: 'string' },
            eventStart: { type: 'string' },
            eventEnd: { type: 'string' },
            eventAttendeeEmail: { type: 'string' },
            description: { type: 'string' }
          },
          required: ['eventTitle', 'eventStart', 'eventEnd', 'eventAttendeeEmail']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'buscarEventos',
        description: 'Buscar eventos no calendário em um período',
        parameters: {
          type: 'object',
          properties: {
            dayBefore: { type: 'string', description: 'Data de início da busca (ISO 8601)' },
            dayAfter: { type: 'string', description: 'Data de fim da busca (ISO 8601)' }
          },
          required: ['dayBefore', 'dayAfter']
        }
      }
    }
  ];

  const response = await getGroq().chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: query }
    ],
    tools,
    tool_choice: 'auto'
  });

  const msg = response.choices[0].message;
  if (msg.tool_calls?.length) {
    const results = [];
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments);
      if (tc.function.name === 'criarEvento' || tc.function.name === 'criarEventoComParticipante') {
        const attendees = args.eventAttendeeEmail ? [args.eventAttendeeEmail] : [];
        const ev = await calendarService.createEvent(
          args.eventTitle,
          '',
          args.description || '',
          args.eventStart,
          args.eventEnd,
          attendees
        );
        results.push(`✅ Evento "${ev.summary}" criado! Link: ${ev.htmlLink}`);
      } else if (tc.function.name === 'buscarEventos') {
        const events = await calendarService.listEvents(args.dayBefore);
        if (!events.length) {
          results.push('Nenhum evento encontrado nesse período.');
        } else {
          const list = events.map(e => {
            const start = e.start.dateTime || e.start.date;
            return `• ${e.summary} — ${new Date(start).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
          }).join('\n');
          results.push(`📅 Eventos encontrados:\n${list}`);
        }
      }
    }
    return results.join('\n');
  }
  return msg.content;
}

// =======================
// AGENTE DE CONTATOS
// Prompt extraído de: Agente_de_Contatos (1).json
// =======================
export async function contactAgent(query) {
  const systemMessage = `# Visão Geral
Você é um assistente de gerenciamento de contatos. Suas responsabilidades incluem procurar contatos, adicionar novos contatos ou atualizar as informações de um contato.

# Ferramentas Disponíveis

## 1. **Buscar Contatos**
- Use esta ferramenta para encontrar um contato específico no Google Contacts.
- O usuário pode solicitar um contato usando o primeiro nome, sobrenome ou nome completo.
- **Sempre utilize esta ferramenta primeiro antes de recuperar todos os contatos.**

## 2. **Buscar Todos os Contatos do Google**
- Recupera uma lista de todos os contatos armazenados no Google Contacts.
- **Use esta ferramenta SOMENTE se "Buscar Contatos" não encontrar o contato solicitado.**

## 3. **Criar Contato**
- Use esta ferramenta para armazenar novas informações de contato quando um contato não existir.
- **Antes de criar um contato, verifique se "Buscar Contatos" e "Buscar Todos os Contatos do Google" não encontraram uma correspondência.**`;

  const tools = [
    {
      type: 'function',
      function: {
        name: 'buscarContatos',
        description: 'Buscar um contato pelo nome',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nome do contato a buscar' }
          },
          required: ['name']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'criarContato',
        description: 'Criar um novo contato',
        parameters: {
          type: 'object',
          properties: {
            Given_Name: { type: 'string' },
            Family_Name: { type: 'string' },
            emailsValues0_Value: { type: 'string' },
            phoneValues0_Value: { type: 'string' }
          },
          required: ['Given_Name', 'Family_Name']
        }
      }
    }
  ];

  const response = await getGroq().chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: query }
    ],
    tools,
    tool_choice: 'auto'
  });

  const msg = response.choices[0].message;
  if (msg.tool_calls?.length) {
    const results = [];
    for (const tc of msg.tool_calls) {
      const args = JSON.parse(tc.function.arguments);
      if (tc.function.name === 'buscarContatos') {
        const contacts = await contactService.searchContacts(args.name);
        if (!contacts.length) {
          results.push(`Contato "${args.name}" não encontrado.`);
        } else {
          const found = contacts.map(c => {
            const name = c.person?.names?.[0]?.displayName || 'Desconhecido';
            const email = c.person?.emailAddresses?.[0]?.value || 'sem e-mail';
            const phone = c.person?.phoneNumbers?.[0]?.value || 'sem telefone';
            return `👤 ${name} | 📧 ${email} | 📱 ${phone}`;
          }).join('\n');
          results.push(found);
        }
      } else if (tc.function.name === 'criarContato') {
        const c = await contactService.createContact(
          args.Given_Name,
          args.Family_Name,
          args.emailsValues0_Value || '',
          args.phoneValues0_Value || ''
        );
        results.push(`✅ Contato "${args.Given_Name} ${args.Family_Name}" criado com sucesso!`);
      }
    }
    return results.join('\n');
  }
  return msg.content;
}

// =======================
// CRIADOR DE CONTEÚDO
// Prompt extraído de: Agente_Criador_de_Conte_do (1).json
// =======================
export async function contentCreator(query) {
  const systemMessage = `# Visão Geral
Você é um redator de blogs habilidoso especializado em conteúdos envolventes, bem estruturados e informativos. Seu estilo de escrita é claro, cativante e adaptado ao público-alvo. Você otimiza para legibilidade, SEO e valor, garantindo que os blogs sejam bem pesquisados, originais e livres de conteúdo irrelevante.

## Ferramentas
Tavily - Use esta ferramenta para pesquisar na web sobre o tema solicitado para o post do blog.

## Requisitos do Blog
Formate todo o conteúdo do blog em HTML, utilizando cabeçalhos apropriados (<h1>, <h2>), parágrafos (<p>), listas com marcadores (<ul><li>) e links (<a href="URL">) para citações. Todas as citações vindas da ferramenta Tavily devem ser preservadas, com hiperlinks clicáveis para que os leitores possam acessar as fontes originais.

Mantenha um tom natural e humano, utilize estruturas de frase variadas e inclua exemplos ou dados relevantes quando necessário. Estruture o conteúdo para fácil leitura, com parágrafos concisos e fluxo lógico. Sempre garanta precisão factual e alinhe o tom com a marca ou propósito pretendido.`;

  const tools = [
    {
      type: 'function',
      function: {
        name: 'tavilySearch',
        description: 'Pesquisar na internet sobre o tema do blog',
        parameters: {
          type: 'object',
          properties: {
            searchTerm: { type: 'string', description: 'O tema sobre o qual pesquisar' }
          },
          required: ['searchTerm']
        }
      }
    }
  ];

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: query }
  ];

  // Loop de tool_calls para pesquisa + redação
  const response = await getGroq().chat.completions.create({ model: GROQ_MODEL, messages, tools, tool_choice: 'auto' });
  const msg = response.choices[0].message;

  if (msg.tool_calls?.length) {
    const tc = msg.tool_calls[0];
    const args = JSON.parse(tc.function.arguments);
    const searchResult = await tavilyService.search(args.searchTerm);

    // Segunda chamada com o resultado da pesquisa
    const followUp = await getGroq().chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        ...messages,
        msg,
        {
          role: 'tool',
          tool_call_id: tc.id,
          content: searchResult
        }
      ]
    });
    return followUp.choices[0].message.content;
  }

  return msg.content;
}
