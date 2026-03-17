import { FOLGAS_MANUAIS } from '../logic/mockData';

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export const analyzeScaleIntent = (input, colaboradores, user) => {
    const normalized = input.toLowerCase();

    // 1. Perguntas sobre Folga / Escala → pedir matrícula
    if (
        normalized.includes('folga') ||
        normalized.includes('descanso') ||
        normalized.includes('folgo') ||
        normalized.includes('escala') ||
        normalized.includes('minha escala') ||
        normalized.includes('meu dia')
    ) {
        return {
            text: "Claro! Para consultar a escala com precisão, me informe o **número de registro (matrícula)** do colaborador. Ex: *7101309*",
            type: 'scale_info',
            needsMatricula: true
        };
    }

    // 2. Memória do Claudemir
    if (normalized.includes('claudemir')) {
        return {
            text: "CLAUDEMIR CUBAS (Mat. 7101309): folga confirmada em 17/03. Domingos de folga no período: 22/03 e 29/03 (definidos pela gerência). Regime 6x1 — as próximas folgas semanais serão divulgadas pela loja.",
            type: 'scale_info'
        };
    }

    // 3. WhatsApp / Mensagem
    if (
        normalized.includes('whatsapp') ||
        normalized.includes('zap') ||
        normalized.includes('contato') ||
        normalized.includes('mensagem') ||
        normalized.includes('avisar')
    ) {
        return {
            text: "Para enviar WhatsApp:\n• **Gestor**: clique no ícone de balão azul no painel, ao lado do nome do colaborador.\n• **Colaborador**: use o botão 'Falar com Gestor' no seu dashboard.",
            type: 'feature_info'
        };
    }

    // 4. Ponto / Registro de presença
    if (
        normalized.includes('ponto') ||
        normalized.includes('bater') ||
        normalized.includes('registrar') ||
        normalized.includes('entrada')
    ) {
        return {
            text: "Para registrar o ponto:\n1. Conecte-se ao Wi-Fi da Mercearia Suzano 068.\n2. Clique em **'BATER PONTO'** no seu dashboard.\n3. O sistema valida IP e localização automaticamente.\n\nEm teste: use a opção *Bypass IP* para simular a rede da loja.",
            type: 'feature_info'
        };
    }

    // 5. Dicas / Ajuda com o dashboard
    if (
        normalized.includes('ajuda') ||
        normalized.includes('como usar') ||
        normalized.includes('dashboard') ||
        normalized.includes('resumo') ||
        normalized.includes('equipe')
    ) {
        return {
            text: "No dashboard do Gestor você tem:\n• **Dashboard** — resumo em tempo real (serviço, folga, ausência).\n• **Gestão de Equipe** — grade 6x1 completa com filtros por turno.\n• **Comunicação** — avisos por WhatsApp.\n\nPosso consultar a escala de qualquer colaborador, é só perguntar!",
            type: 'feature_info'
        };
    }

    // Fallback
    return {
        text: "Olá! 👋 Sou o Assistente da Mercearia Suzano. Posso:\n• Consultar escala e folgas pelo registro\n• Explicar como usar o WhatsApp\n• Ajudar com o registro de ponto\n• Guiar no dashboard\n\nO que deseja saber?",
        type: 'fallback'
    };
};

/**
 * Retorna as próximas folgas de um colaborador a partir de hoje,
 * com base no mapa FOLGAS_MANUAIS.
 */
export const getProximasFolgasManuais = (colabId) => {
    const hoje = new Date();
    const folgas = (FOLGAS_MANUAIS[colabId] || [])
        .map(d => new Date(d + 'T00:00:00'))
        .filter(d => d >= hoje)
        .sort((a, b) => a - b);
    return folgas;
};

export const speak = (text) => {
    // TTS desativado por simplificação
};
