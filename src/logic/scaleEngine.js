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

        let diasDesdeFolga = 0;

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataAtual = new Date(ano, mes - 1, dia);
            const diaSemana = dataAtual.getDay();
            const dataStr = dataAtual.toISOString().split('T')[0];

            let tipo = SCALE_TYPES.TRABALHO;

            // REGRA 1: É o domingo de folga dele?
            if (domingosFolga.includes(dia)) {
                tipo = SCALE_TYPES.FOLGA;
            }
            // REGRA 2: Escala 6x1 - Se ele está há 6 dias sem folgar, HOJE deve ser folga
            else if (diasDesdeFolga >= 6) {
                tipo = SCALE_TYPES.FOLGA;
            }
            // REGRA 3: É a folga fixa semanal?
            // Só folga na fixa se não houver um domingo de folga nesta semana 
            // OU se a folga fixa for necessária para não estourar os 6 dias.
            else if (diaSemana === folgaFixa) {
                const currentSunday = new Date(dataAtual);
                currentSunday.setDate(dataAtual.getDate() + (7 - (dataAtual.getDay() || 7)));
                const domDia = currentSunday.getDate();

                if (!domingosFolga.includes(domDia)) {
                    tipo = SCALE_TYPES.FOLGA;
                }
            }

            if (tipo === SCALE_TYPES.FOLGA) {
                diasDesdeFolga = 0;
            } else {
                diasDesdeFolga++;
            }

            escala.push({
                colaborador_id: colab.id,
                data: dataStr,
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
