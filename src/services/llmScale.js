import { FOLGAS_MANUAIS, MOCK_COLABORADORES, HORARIO_DOMINGO, SYSTEM_MESSAGE, SCALE_START_DATE } from '../logic/mockData';

// ─── Helpers ────────────────────────────────────────────────────────────────

const hoje = () => new Date();

const toISO = (d) => d.toISOString().split('T')[0];

const formatarData = (isoStr) => {
    const [y, m, day] = isoStr.split('-');
    return `${day}/${m}/${y}`;
};

const getHorarioDomingo = (colab) => {
    if (colab.nome.toUpperCase().includes('LINDINALVA')) return HORARIO_DOMINGO['LINDINALVA'];
    return HORARIO_DOMINGO[colab.horario] || colab.horario;
};

const isFolgaHoje = (colabId, dataStr) => {
    return (FOLGAS_MANUAIS[colabId] || []).includes(dataStr);
};

// ─── Intenções ──────────────────────────────────────────────────────────────

/**
 * Analisa a mensagem do usuário e responde de acordo com as regras da Unidade Suzano 068.
 * System Message: "Você é o Assistente de Escala da Unidade Suzano 068..."
 */
export const analyzeScaleIntent = (input, colaboradores, user) => {
    const norm = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dataHoje = toISO(hoje());
    const diaSemanaHoje = hoje().getDay(); // 0=Dom, 6=Sab

    // ── 1. "Quem trabalha hoje?" / "Quem está de folga?" ─────────────────
    if (
        norm.includes('quem trabalha hoje') ||
        norm.includes('quem esta trabalhando') ||
        norm.includes('equipe hoje') ||
        norm.includes('quem tem folga hoje') ||
        norm.includes('quem folga hoje') ||
        norm.includes('de folga hoje')
    ) {
        const emFolga = colaboradores.filter(c => isFolgaHoje(c.id, dataHoje));
        const trabalhando = colaboradores.filter(c => !isFolgaHoje(c.id, dataHoje));

        if (norm.includes('folga')) {
            if (emFolga.length === 0) {
                return { text: `📅 Hoje (${formatarData(dataHoje)}) nenhum colaborador registrado está de folga confirmada no sistema.`, type: 'coverage' };
            }
            const lista = emFolga.map(c => `• ${c.nome} (${c.horario})`).join('\n');
            return {
                text: `🌴 **Folgas confirmadas hoje — ${formatarData(dataHoje)}:**\n${lista}\n\nTotal: ${emFolga.length} colaborador(es) ausente(s).`,
                type: 'coverage'
            };
        }

        const porTurno = {};
        trabalhando.forEach(c => {
            const horario = diaSemanaHoje === 0 ? getHorarioDomingo(c) : c.horario;
            if (!porTurno[horario]) porTurno[horario] = [];
            porTurno[horario].push(c.nome);
        });

        const turnosStr = Object.entries(porTurno)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([h, nomes]) => `⏰ **${h}**: ${nomes.join(', ')}`)
            .join('\n');

        return {
            text: `👥 **Equipe em serviço — ${formatarData(dataHoje)}:**\n${turnosStr}\n\n✅ ${trabalhando.length} trabalhando | 🌴 ${emFolga.length} de folga`,
            type: 'coverage'
        };
    }

    // ── 2. Horário de domingo ─────────────────────────────────────────────
    if (norm.includes('domingo') && (norm.includes('horario') || norm.includes('que horas') || norm.includes('entrada'))) {
        return {
            text: `📋 **Horários de Domingo — Suzano 068:**\n• Turnos 06:00, 07:00, 08:00 e 14:30 → entram às **10:30**\n• Turno 22:00 → entram às **12:00**\n• ⚠️ Exceção: **Lindinalva** mantém **07:00** todos os domingos\n• 🌴 **Cleonice Santos** e **Ana Maria** — folga em todos os domingos do período`,
            type: 'schedule_info'
        };
    }

    // ── 3. Legenda (D e F) ────────────────────────────────────────────────
    if (norm.includes('legenda') || norm.includes(' o que e d ') || norm.includes(' o que e f ') || norm.includes('significa d') || norm.includes('significa f')) {
        return {
            text: `📖 **Legenda da Escala:**\n• **D** → Dia de trabalho normal (horário contratual)\n• **F** → Folga / DSR (Descanso Semanal Remunerado)\n\nAs folgas semanais são **móveis** — geralmente retrocedem um dia a cada semana — definidas pela gerência da loja.`,
            type: 'info'
        };
    }

    // ── 4. Folga/Escala → pede matrícula ─────────────────────────────────
    if (
        norm.includes('folga') ||
        norm.includes('descanso') ||
        norm.includes('folgo') ||
        norm.includes('escala') ||
        norm.includes('minha escala') ||
        norm.includes('meu dia')
    ) {
        return {
            text: 'Claro! Para consultar a escala com precisão, me informe o **número de registro (matrícula)** do colaborador. Ex: *7101309*',
            type: 'scale_info',
            needsMatricula: true
        };
    }

    // ── 5. Claudemir ──────────────────────────────────────────────────────
    if (norm.includes('claudemir')) {
        return {
            text: 'CLAUDEMIR CUBAS (Mat. 7101309): folga confirmada em 17/03. Regime 6x1 — próximas folgas e os 2 domingos mensais serão definidos pela gerência e registrados aqui.',
            type: 'scale_info'
        };
    }

    // ── 6. WhatsApp ───────────────────────────────────────────────────────
    if (norm.includes('whatsapp') || norm.includes('zap') || norm.includes('mensagem') || norm.includes('avisar') || norm.includes('contato')) {
        return {
            text: 'Para enviar WhatsApp:\n• **Gestor**: clique no ícone de balão ao lado do colaborador no painel.\n• **Colaborador**: use o botão "Falar com Gestor" no seu dashboard.',
            type: 'feature_info'
        };
    }

    // ── 7. Ponto ──────────────────────────────────────────────────────────
    if (norm.includes('ponto') || norm.includes('bater') || norm.includes('registrar entrada')) {
        return {
            text: 'Para registrar o ponto:\n1. Conecte-se ao Wi-Fi da Mercearia Suzano 068.\n2. Clique em **BATER PONTO** no seu dashboard.\n3. O sistema valida IP e localização automaticamente.',
            type: 'feature_info'
        };
    }

    // ── 8. Dashboard / Ajuda ──────────────────────────────────────────────
    if (norm.includes('ajuda') || norm.includes('dashboard') || norm.includes('como usar') || norm.includes('equipe')) {
        return {
            text: 'No dashboard do Gestor:\n• **Dashboard** — situação em tempo real (serviço, folga, ausência)\n• **Gestão de Equipe** — grade 6x1 completa filtrável por turno\n• **Comunicação** — avisos por WhatsApp\n\nPosso consultar a escala de qualquer colaborador — é só informar a matrícula!',
            type: 'feature_info'
        };
    }

    // ── 9. Fallback ───────────────────────────────────────────────────────
    return {
        text: `Olá! 👋 Sou o Assistente de Escala da **Unidade Suzano 068**.\n\nPosso te ajudar com:\n• Quem trabalha/folga hoje?\n• Escala e folgas pelo registro (matrícula)\n• Horários de domingo\n• Legenda D e F\n• Uso do WhatsApp e registro de ponto\n\nO que deseja saber?`,
        type: 'fallback'
    };
};

/**
 * Retorna próximas folgas manuais de um colaborador a partir de hoje.
 */
export const getProximasFolgasManuais = (colabId) => {
    const dataHoje = toISO(hoje());
    return (FOLGAS_MANUAIS[colabId] || [])
        .filter(d => d >= dataHoje)
        .sort()
        .map(d => {
            const [y, m, day] = d.split('-');
            return `${day}/${m}/${y}`;
        });
};

export const speak = () => {}; // TTS desativado
