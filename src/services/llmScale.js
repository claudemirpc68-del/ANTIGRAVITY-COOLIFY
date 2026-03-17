export const analyzeScaleIntent = (input, colaboradores, user) => {
    const normalized = input.toLowerCase();
    
    // 1. Perguntas sobre Folga (Skill 1: Consulta Instantânea)
    if (normalized.includes('folga') || normalized.includes('descanso') || normalized.includes('folgo') || normalized.includes('escala')) {
        if (user.role === 'colaborador') {
            const colab = colaboradores.find(c => c.id === user.id);
            if (colab) {
                return {
                    text: `Olá ${colab.nome.split(' ')[0]}! Verifiquei seu perfil. Sua folga fixa é na ${getDiaSemana(colab.folgaFixa)}. Lembre-se que nosso ciclo atual vai do dia 16 ao dia 15 do mês seguinte. Você pode ver sua escala completa clicando no botão 'Minha Escala' logo abaixo.`,
                    type: 'scale_info'
                };
            }
        }
        return {
            text: "Para consultar a folga de um colaborador, você pode usar a aba 'Gestão de Equipe' e filtrar pelo nome ou matrícula. O calendário mostra 'F' para folgas normais e 'D' para descansos dominicais.",
            type: 'generic'
        };
    }

    // 2. Perguntas sobre Claudemir (Skill 2: Memória de Ajustes Específicos)
    if (normalized.includes('claudemir')) {
        return {
            text: "O ajuste do CLAUDEMIR CUBAS (Matrícula 7101309) foi realizado com sucesso. Ficou assim: Folga nos domingos 08/03 e 15/03, e trabalho nos domingos 22/03 e 29/03 para compensar o novo ciclo 6x1. Ele também está de folga hoje, 17/03, conforme solicitado.",
            type: 'scale_info'
        };
    }

    // 3. Perguntas sobre WhatsApp (Skill 3: Guia de Funcionalidades)
    if (normalized.includes('whatsapp') || normalized.includes('zap') || normalized.includes('contato') || normalized.includes('mensagem')) {
        return {
            text: "A integração com WhatsApp permite enviar avisos rápidos! No Painel Administrativo, clique no ícone de balão azul ou botão de WhatsApp ao lado do nome do colaborador. Para colaboradores, existe um botão 'Falar com Gestor' no dashboard.",
            type: 'feature_info'
        };
    }

    // 4. Dicas Proativas (Skill 5: Dashboard e Ponto)
    if (normalized.includes('ponto') || normalized.includes('bater') || normalized.includes('registrar')) {
        return {
            text: "Para bater o ponto, você deve estar conectado à rede Wi-Fi da loja Mercearia Suzano 068. O sistema valida seu IP automaticamente. No seu dashboard, clique em 'BATER PONTO'. Se estiver em teste, pode usar a opção 'Bypass IP'.",
            type: 'feature_info'
        };
    }

    if (normalized.includes('ajuda') || normalized.includes('como usar') || normalized.includes('dashboard') || normalized.includes('resumo')) {
        return {
            text: "No dashboard do Gestor, você tem a aba 'Dashboard' com o resumo em tempo real da equipe (quem está em serviço, folga ou ausente) e a aba 'Gestão de Equipe' para controle total da escala 6x1. Como posso te ajudar mais especificamente?",
            type: 'feature_info'
        };
    }

    // Fallback
    return {
        text: "Olá! Sou o Assistente da Mercearia Suzano. Posso te ajudar com dúvidas sobre a escala 6x1, detalhes do Claudemir, uso do WhatsApp ou como registrar o ponto. O que deseja saber?",
        type: 'fallback'
    };
};

const getDiaSemana = (idx) => {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return dias[idx] || 'Dia não definido';
};

// Removido speak por simplicidade conforme solicitado pelo usuário
export const speak = (text) => {
    console.log("TTS desativado:", text);
};
