
import { generateScale } from './scaleEngine.js';
import { MOCK_COLABORADORES } from './mockData.js';
import { SCALE_TYPES } from './constants.js';

function testScaleLogic() {
    console.log('🚀 Iniciando testes de lógica de escala...');
    
    const ano = 2025;
    const mes = 3; // Março 2025
    const escala = generateScale(MOCK_COLABORADORES, ano, mes);

    const erros = [];

    MOCK_COLABORADORES.forEach(colab => {
        const colabEscala = escala.filter(e => e.colaborador_id === colab.id);
        
        let diasSeguidosTrabalho = 0;
        let domingosTrabalhados = 0;

        colabEscala.forEach(entry => {
            const date = new Date(entry.data + 'T00:00:00');
            const diaSemana = date.getDay();

            if (entry.tipo === SCALE_TYPES.TRABALHO) {
                diasSeguidosTrabalho++;
                if (diaSemana === 0) domingosTrabalhados++;
            } else {
                diasSeguidosTrabalho = 0;
            }

            if (diasSeguidosTrabalho > 6) {
                erros.push(`ERRO: ${colab.nome} trabalhou mais de 6 dias seguidos em ${entry.data}`);
            }
        });

        if (domingosTrabalhados > 2) {
            erros.push(`ERRO: ${colab.nome} trabalhou ${domingosTrabalhados} domingos em Março/2026 (Limite: 2)`);
        }
    });

    if (erros.length === 0) {
        console.log('✅ Todos os testes de lógica passaram!');
    } else {
        console.error('❌ Falhas encontradas na lógica:');
        erros.forEach(err => console.error('  -', err));
        throw new Error('Falha nos testes.');
    }
}

testScaleLogic();
