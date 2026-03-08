/**
 * Motor de Lógica de Escala 6x1 - Assai Mercearia
 * Regras:
 * 1. 6 dias de trabalho -> 1 dia de folga.
 * 2. Máximo de 2 domingos trabalhados por mês.
 * 3. Garantir 1 folga semanal (dentro de 7 dias).
 */

import { SCALE_TYPES } from './constants';

export const generateScale = (colaboradores, ano, mes) => {
    const escala = [];
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const startDate = new Date(ano, mes - 1, 1);

    // Controle de domingos trabalhados por colaborador no mês
    const domingosTrabalhados = {};
    colaboradores.forEach(c => domingosTrabalhados[c.id] = 0);

    // Controle de dias seguidos trabalhados por colaborador
    const diasSeguidos = {};
    colaboradores.forEach(c => diasSeguidos[c.id] = 0);

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataAtual = new Date(ano, mes - 1, dia);
        const isDomingo = dataAtual.getDay() === 0;

        colaboradores.forEach((colab, index) => {
            let tipo = SCALE_TYPES.TRABALHO;

            // Regra 1: Folga obrigatória após 6 dias seguidos
            if (diasSeguidos[colab.id] >= 6) {
                tipo = SCALE_TYPES.FOLGA;
            }

            // Regra 2: Balanceamento de Domingos
            // Se for domingo e o colaborador já trabalhou 2 domingos, ele DEVE folgar.
            if (isDomingo && domingosTrabalhados[colab.id] >= 2) {
                tipo = SCALE_TYPES.FOLGA;
            }

            // Tentar equilibrar as folgas para não folgar todo mundo no mesmo dia
            // (Simplified: Se não for domingo e não for obrigatório folgar por 6x1, trabalha)

            // Ajuste de contador
            if (tipo === SCALE_TYPES.FOLGA) {
                diasSeguidos[colab.id] = 0;
            } else {
                diasSeguidos[colab.id]++;
                if (isDomingo) {
                    domingosTrabalhados[colab.id]++;
                }
            }

            escala.push({
                colaborador_id: colab.id,
                data: dataAtual.toISOString().split('T')[0],
                tipo: tipo
            });
        });
    }

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
