import { Telegraf } from 'telegraf';
import Groq from 'groq-sdk';
import { processMessage } from './src/agents/orchestrator.js';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

dotenv.config();

if (!process.env.TELEGRAM_TOKEN) {
  console.error('❌ ERRO: TELEGRAM_TOKEN não definido no arquivo .env');
  process.exit(1);
}
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERRO: GROQ_API_KEY não definido no arquivo .env');
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log('🚀 Iniciando JARVYS — Assistente Pessoal de Claudemir Pedroso Cubas...');

// ──────────────────────────────────────────
// Middleware de log
// ──────────────────────────────────────────
bot.use((ctx, next) => {
  const name = ctx.from?.first_name || 'Desconhecido';
  const chatId = ctx.chat?.id;
  console.log(`[BOT] Entrada de ${name} (chat: ${chatId})`);
  return next();
});

// ──────────────────────────────────────────
// Mensagens de texto
// (equivale ao nó "Set 'Text'" → "Agente Pessoal Completo" do JSON)
// ──────────────────────────────────────────
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const chatId = ctx.chat.id;

  await ctx.sendChatAction('typing');

  const reply = await processMessage(chatId, text);

  // Limpar saídas de funções
  let cleanReply = reply.replace(/<function>\s*\{[^}]+\}\s*<\/\s*function>/gi, '').trim();
  if (!cleanReply) cleanReply = 'Tarefa concluída.';
  
  // Telegram suporta HTML básico; limitar a 4096 chars (limite da API)
  const safeReply = cleanReply.substring(0, 4096);
  await ctx.reply(safeReply, { parse_mode: 'HTML' }).catch(() =>
    ctx.reply(safeReply) // Se HTML falhar, envia como texto simples
  );
});

// ──────────────────────────────────────────
// Mensagens de voz
// (equivale ao Switch → Baixar Arquivo de Voz → Áudio para Texto → Agente do JSON)
// ──────────────────────────────────────────
bot.on('voice', async (ctx) => {
  const fileId = ctx.message.voice.file_id;
  const chatId = ctx.chat.id;
  const tempPath = path.join(process.cwd(), `temp_${fileId}.ogg`);

  await ctx.sendChatAction('typing');
  await ctx.reply('🎙️ Transcrevendo seu áudio...', { parse_mode: 'HTML' });

  try {
    // 1. Obter link do arquivo no Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // 2. Download do arquivo de voz
    const dlResponse = await axios.get(fileLink.href, { responseType: 'stream' });
    await pipeline(dlResponse.data, fs.createWriteStream(tempPath));

    // 3. Transcrição via Groq Whisper (gratuito)
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-large-v3-turbo',
      language: 'pt'
    });

    // 4. Limpar arquivo temporário
    fs.unlinkSync(tempPath);

    const transcribedText = transcription.text;
    console.log(`[BOT] 🎙️ Transcrição: "${transcribedText}"`);

    // 5. Enviar para o orquestrador
    const reply = await processMessage(chatId, transcribedText);
    const safeReply = reply.substring(0, 4096);

    await ctx.reply(
      `<i>🎙️ "${transcribedText}"</i>\n\n${safeReply}`,
      { parse_mode: 'HTML' }
    ).catch(() => ctx.reply(`🎙️ "${transcribedText}"\n\n${safeReply}`));

  } catch (err) {
    console.error('[BOT] ❌ Erro ao processar áudio:', err.message);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    await ctx.reply('❌ Tive um problema ao processar seu áudio. Por favor, tente novamente.');
  }
});

// ──────────────────────────────────────────
// Inicialização
// ──────────────────────────────────────────
bot.launch().then(() => {
  console.log('✅ JARVYS está ONLINE no Telegram!');
  console.log('💬 Aguardando mensagens...');
});

process.once('SIGINT', () => {
  console.log('\n🛑 Encerrando JARVYS...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('\n🛑 Encerrando JARVYS...');
  bot.stop('SIGTERM');
});
