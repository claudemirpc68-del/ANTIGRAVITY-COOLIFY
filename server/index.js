require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Assai WhatsApp API' });
});

// Endpoint de envio de mensagem WhatsApp
app.post('/api/whatsapp/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Parâmetros "to" e "message" são obrigatórios.' });
  }

  // Formatar número: garantir formato whatsapp:+55XXXXXXXXXX
  let numero = String(to).replace(/\D/g, ''); // remove não-dígitos
  if (!numero.startsWith('55')) numero = '55' + numero;
  const destinatario = `whatsapp:+${numero}`;

  try {
    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: destinatario,
      body: message
    });

    console.log(`[WhatsApp] Mensagem enviada para ${destinatario} | SID: ${msg.sid}`);
    res.json({ success: true, sid: msg.sid, to: destinatario });
  } catch (err) {
    console.error('[WhatsApp] Erro ao enviar:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Assai WhatsApp Server rodando na porta ${PORT}`);
});
