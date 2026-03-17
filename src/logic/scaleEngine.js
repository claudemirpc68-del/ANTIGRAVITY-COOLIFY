/**
 * Motor de Lógica de Escala 6x1 - Assai Mercearia
 * Regras:
 * 1. Folgas são definidas manualmente pela gerência (FOLGAS_MANUAIS).
 * 2. Segurança 6x1: após 6 dias consecutivos de trabalho, o 7º é folga automática.
 * 3. Cada colaborador tem direito a 2 domingos de folga por mês (não necessariamente consecutivos).
 *    Os domingos de folga também são definidos pela gerência e registrados em FOLGAS_MANUAIS.
 */

import { SCALE_TYPES } from './constants.js';
import { FOLGAS_MANUAIS } from './mockData.js';

export const generateScale = (colaboradores, startDate, numDays = 31) => {
    const escala = [];
    const mainStartDate = new Date(startDate);

    colaboradores.forEach(colab => {
        // Buscar folgas manuais do colaborador (datas definidas pela gerência)
        const folgasManuais = new Set(FOLGAS_MANUAIS[colab.id] || []);

        // Controle de domingos no mês de referência
        const domingosFolga = {}; // mes -> count

        // Contador 6x1
        let diasSeguidos = 0;

        for (let i = 0; i < numDays; i++) {
            const dataAtual = new Date(mainStartDate);
            dataAtual.setDate(mainStartDate.getDate() + i);

            const ano = dataAtual.getFullYear();
            const mes = dataAtual.getMonth() + 1;
            const dia = dataAtual.getDate();
            const diaSemana = dataAtual.getDay();
            const dataStr = dataAtual.toISOString().split('T')[0]; // YYYY-MM-DD

            let tipo = SCALE_TYPES.TRABALHO;

            // PRIORIDADE 1: Folga Manual (definida pela gerência)
            if (folgasManuais.has(dataStr)) {
                tipo = SCALE_TYPES.FOLGA;
            }
            // PRIORIDADE 2: Regra de segurança 6x1 (nunca mais de 6 dias seguidos)
            else if (diasSeguidos >= 6) {
                tipo = SCALE_TYPES.FOLGA;
            }

            // Atualiza contador consecutivo
            if (tipo === SCALE_TYPES.FOLGA) {
                diasSeguidos = 0;
            } else {
                diasSeguidos++;
            }

            escala.push({
                colaborador_id: colab.id,
                data: dataStr,
                tipo: tipo,
                dia,
                mes,
                ano,
                diaSemana
            });
        }
    });

    return escala;
};

/**
 * Validador de conformidade da escala
 */
export const validateScale = (escala, colabId) => {
    const colabEscala = escala
        .filter(e => e.colaborador_id === colabId)
        .sort((a, b) => a.data.localeCompare(b.data));

    const alertas = [];
    let diasSeguidos = 0;
    let domingosTrabalhados = 0;
    let domingosFolga = 0;

    colabEscala.forEach(entry => {
        const date = new Date(entry.data + 'T00:00:00');
        const isDomingo = date.getDay() === 0;

        if (entry.tipo === SCALE_TYPES.TRABALHO) {
            diasSeguidos++;
            if (isDomingo) domingosTrabalhados++;
        } else {
            diasSeguidos = 0;
            if (isDomingo) domingosFolga++;
        }

        if (diasSeguidos > 6) {
            alertas.push(`Excedeu 6 dias seguidos em ${entry.data}`);
        }
    });

    if (domingosTrabalhados > 3) {
        alertas.push(`Trabalhou ${domingosTrabalhados} domingos no período (máximo recomendado: 2-3).`);
    }

    if (domingosFolga < 2) {
        alertas.push(`Apenas ${domingosFolga} domingo(s) de folga no período (mínimo: 2).`);
    }

    return alertas;
};
