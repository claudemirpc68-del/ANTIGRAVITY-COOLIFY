
import { generateScale } from '../src/logic/scaleEngine.js';

const mockColabs = [
    { id: '22', nome: 'CLAUDEMIR', folgaFixa: 5 }
];

const escala = generateScale(mockColabs, 2026, 3);
const claudemirEscala = escala.filter(e => e.colaborador_id === '22');

console.log('--- ESCALA CLAUDEMIR MARÇO/2026 ---');
claudemirEscala.forEach(e => {
    const d = new Date(e.data + 'T00:00:00');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    console.log(`${e.data} (${dias[d.getDay()]}): ${e.tipo}`);
});
