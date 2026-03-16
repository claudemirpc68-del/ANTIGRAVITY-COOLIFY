export const analyzeScaleIntent = (input, colaboradores, user) => {
    const normalized = input.toLowerCase();
    
    // 1. Perguntas sobre Folga
    if (normalized.includes('folga') || normalized.includes('descanso') || normalized.includes('folgo')) {
        if (user.role === 'colaborador') {
            const colab = colaboradores.find(c => c.id === user.id);
            if (colab) {
                return {
                    text: `Olá ${colab.nome}! Verifiquei sua escala. Sua folga fixa é na ${getDiaSemana(colab.folgaFixa)}. Amanhã, dia 16/03, inicia seu novo ciclo 6x1.`,
                    type: 'scale_info'
                };
            }
        }
        return {
            text: "Você pode consultar a folga de qualquer colaborador clicando no nome dele na lista de equipe ou olhando o calendário geral.",
            type: 'generic'
        };
    }

    // 2. Perguntas sobre Claudemir (caso específico solicitado anteriormente)
    if (normalized.includes('claudemir')) {
        return {
            text: "A escala do Claudemir foi ajustada: ele folga nos dois primeiros domingos de Março (08 e 15) e trabalha nos dois últimos (22 e 29) para compensar o novo ciclo 6x1.",
            type: 'scale_info'
        };
    }

    // 3. Perguntas sobre WhatsApp
    if (normalized.includes('whatsapp') || normalized.includes('zap') || normalized.includes('contato')) {
        return {
            text: "Agora temos integração direta com WhatsApp! No painel do gestor, basta clicar no ícone verde ao lado do colaborador para enviar avisos rápidos.",
            type: 'feature_info'
        };
    }

    // Fallback
    return {
        text: "Olá! Sou o Assistente da Mercearia Suzano. Posso te ajudar com dúvidas sobre a escala 6x1, folgas ou como usar o novo sistema de WhatsApp. O que deseja saber?",
        type: 'fallback'
    };
};

const getDiaSemana = (idx) => {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[idx] || 'Dia não definido';
};

export const speak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
};
