import { ROLES, SCALE_TYPES } from './constants.js';

export const MOCK_COLABORADORES = [
    // 1º TURNO: 06:00 — 08:00
    { id: '1', nome: 'AMANDA PORTO', matricula: '5741181', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 0 },
    { id: '2', nome: 'KAIQUE VIEIRA', matricula: '658526', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0 },
    { id: '3', nome: 'DAYANA ANGELO', matricula: '5477786', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0 },
    { id: '4', nome: 'LUIZA JESUS', matricula: '604933', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0 },
    { id: '5', nome: 'LINDINALVA', matricula: '2741768', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00', folgaFixa: 5 },
    { id: '6', nome: 'DENISE ISSI', matricula: '596254', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00', folgaFixa: 2 },
    { id: '7', nome: 'PEDRO ANGELO', matricula: '672167', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 0 },
    { id: '8', nome: 'CLAUDINEI', matricula: '4593634', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 0 },
    { id: '9', nome: 'FABIO ROBERTO', matricula: '3366847', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 0 },
    { id: '10', nome: 'CLEONICE SANTOS', matricula: '640515', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 3 },
    { id: '11', nome: 'SERGIO RICARDO', matricula: '6413005', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 2 },
    // 2º TURNO: 14:30
    { id: '12', nome: 'ALEXSANDER FREIRE', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 5 },
    { id: '13', nome: 'FLAVIO REZENDE', matricula: '6513042', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 3 },
    { id: '14', nome: 'FABRICIO SOUZA', matricula: '6789358', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 1 },
    { id: '15', nome: 'JOSE MANOEL', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0 },
    { id: '16', nome: 'KAUA PEREIRA', matricula: '6199917', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2 },
    { id: '17', nome: 'ISABELI', matricula: '6871283', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 5 },
    { id: '18', nome: 'ANA MARIA', matricula: '6339867', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0 },
    { id: '19', nome: 'LUANA VIEIRA', matricula: '6885551', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2 },
    { id: '20', nome: 'ALINE', matricula: '6778011', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 1 },
    { id: '21', nome: 'VALDEMIR', matricula: '9999001', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2 },
    { id: '22', nome: 'CLAUDEMIR', matricula: '4593600', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0 },
    { id: '23', nome: 'THIAGO', matricula: '6945961', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2 },
    { id: '24', nome: 'ABRAÃO', matricula: '6948111', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 4 },
    { id: '25', nome: 'IVAN CARMO', matricula: '5839653', role: ROLES.COLABORADOR, funcao: 'OP. PLENO', horario: '14:30', folgaFixa: 0 },
    { id: '26', nome: 'RENAN', matricula: '6099980', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0 },
    // 3º TURNO NOTURNO: 22:00
    { id: '27', nome: 'JACK ARAUJO', matricula: '6011799', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 0 },
    { id: '28', nome: 'CLAUDIOR DE MELO', matricula: '6507859', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3 },
    { id: '29', nome: 'THOMAS', matricula: '9999002', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 2 },
    { id: '30', nome: 'RENATO', matricula: '5925479', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3 },
    { id: '31', nome: 'DANIEL SILVA', matricula: '6973647', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3 },
    { id: '32', nome: 'MAURICIO ALMEIDA', matricula: '6580408', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 1 },
    { id: '33', nome: 'GILBERTO', matricula: '5285771', role: ROLES.COLABORADOR, funcao: 'OP. PLENO', horario: '22:00', folgaFixa: 2 },
];

if (typeof window !== 'undefined') {
    window.MOCK_COLABORADORES = MOCK_COLABORADORES;
}

export const MOCK_GESTOR = {
    id: '0',
    nome: 'EDERSON CUBAS',
    matricula: '101010',
    role: ROLES.GESTOR
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // 1 to 12
const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
const DIAS_SEMANA_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export const DIAS_IMAGEM = Array.from({ length: 28 }, (_, i) => {
    // Escala da imagem: 16/02 a 15/03
    let dia, mes, ano = 2026;
    if (i < 13) {
        dia = 16 + i;
        mes = 2; // Fev
    } else {
        dia = i - 12;
        mes = 3; // Mar
    }
    const d = new Date(ano, mes - 1, dia);
    return {
        dia: dia,
        sem: DIAS_SEMANA_SHORT[d.getDay()]
    };
});

export const IMAGE_GRID = {
    '1':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '2':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '3':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '4':  ['D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F'],
    '5':  ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '6':  ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '7':  ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '8':  ['D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F'],
    '9':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '10': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '11': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '12': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '13': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '14': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F'],
    '15': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '16': ['D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F'],
    '17': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '18': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '19': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '20': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F'],
    '21': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '22': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '23': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '24': ['', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F'],
    '25': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '26': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '27': ['D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F'],
    '28': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '29': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '30': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '31': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '32': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F'],
    '33': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
};
