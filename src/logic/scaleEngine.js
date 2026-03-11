/**
 * Motor de Lógica de Escala 6x1 - Assai Mercearia
 * Regras:
 * 1. 6 dias de trabalho -> 1 dia de folga.
 * 2. Máximo de 2 domingos trabalhados por mês.
 * 3. Garantir 1 folga semanal (dentro de 7 dias).
 */

import { SCALE_TYPES } from './constants.js';

export const generateScale = (colaboradores, ano, mes) => {
    const escala = [];
    const diasNoMes = new Date(ano, mes, 0).getDate();

    // Identificar domingos do mês
    const domingos = [];
    for (let d = 1; d <= diasNoMes; d++) {
        const date = new Date(ano, mes - 1, d);
        if (date.getDay() === 0) domingos.push(d);
    }

    colaboradores.forEach(colab => {
        const folgaFixa = colab.folgaFixa; // 0=Dom, 1=Seg...

        // Determinar quais domingos este colaborador folga.
        // Regra: 2 domingos por mês. Vamos alternar baseado no ID ou algo fixo para consistência.
        // Para simplificar: Colabs folgam o 1º e 3º OU 2º e 4º domingos.
        const domingosFolga = (parseInt(colab.id) % 2 === 0)
            ? [domingos[0], domingos[2]].filter(Boolean)
            : [domingos[1], domingos[3]].filter(Boolean);

        // Inicializando diasDesdeFolga para que a primeira folga caia no dia folgaFixa
        // Em Março 2026, dia 1 é Domingo (0).
        let primeiroDiaSem = new Date(ano, mes - 1, 1).getDay();
        let offsetFolga = (folgaFixa - primeiroDiaSem + 7) % 7;
        let diasDesdeFolga = 6 - offsetFolga;

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataAtual = new Date(ano, mes - 1, dia);
            const diaSemana = dataAtual.getDay();

            let tipo = SCALE_TYPES.TRABALHO;

            // REGRA 1: Domingo de Folga (Escala alternada 2 domingos/mês)
            if (domingosFolga.includes(dia)) {
                tipo = SCALE_TYPES.FOLGA;
            }
            // REGRA 2: Folga Fixa Semanal
            else if (diaSemana === folgaFixa) {
                tipo = SCALE_TYPES.FOLGA;
            }
            // REGRA 3: Segurança 6x1 (Não permitir mais de 6 dias seguidos de trabalho)
            else if (diasDesdeFolga >= 6) {
                tipo = SCALE_TYPES.FOLGA;
            }

            // Atualiza contador
            if (tipo === SCALE_TYPES.FOLGA) {
                diasDesdeFolga = 0;
            } else {
                diasDesdeFolga++;
            }

            escala.push({
                colaborador_id: colab.id,
                data: dataAtual.toISOString().split('T')[0],
                tipo: tipo
            });
        }
    });

    return escala;
};

/**
 * Validador de conformidade da escala
 */
export const validateScale = (escala, colabId) => {
    const colabEscala = escala.filter(e => e.colaborador_id === colabId).sort((a, b) => a.data.localeCompare(b.data));
    const alertas = [];

    let diasSeguidos = 0;
    let domingosNoMes = 0;

    colabEscala.forEach(entry => {
        const date = new Date(entry.data);
        const isDomingo = date.getDay() === 1; // getDay 0 is Sunday, adjustment needed based on locale if using 1-indexed

        if (entry.tipo === SCALE_TYPES.TRABALHO) {
            diasSeguidos++;
            if (date.getDay() === 0) domingosNoMes++;
        } else {
            diasSeguidos = 0;
        }

        if (diasSeguidos > 6) alertas.push(`Excedeu 6 dias seguidos em ${entry.data}`);
        if (domingosNoMes > 2) alertas.push(`Excedeu 2 domingos no mês em ${entry.data}`);
    });

    return alertas;
};
