import { ROLES, SCALE_TYPES } from './constants.js';

export const MOCK_COLABORADORES = [
    // 1º TURNO: 06:00 — 08:00
    { id: '1', nome: 'AMANDA PORTO', matricula: '5741181', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 5, telefone: '5511961909818' },
    { id: '2', nome: 'KAIQUE VIEIRA', matricula: '658526', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0, telefone: '5511987654321' },
    { id: '3', nome: 'DAYANA ANGELO', matricula: '5477786', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0, telefone: '5511912345678' },
    { id: '4', nome: 'LUIZA JESUS', matricula: '604933', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 0, telefone: '5511922223333' },
    { id: '5', nome: 'LINDINALVA', matricula: '2741768', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00', folgaFixa: 5, telefone: '5511944445555' },
    { id: '6', nome: 'DENISE ISSI', matricula: '596254', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00', folgaFixa: 2, telefone: '5511966667777' },
    { id: '7', nome: 'PEDRO ANGELO', matricula: '672167', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 1, telefone: '5511988889999' },
    { id: '8', nome: 'CLAUDINEI CORREA', matricula: '4593634', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 5, telefone: '5511900001111' },
    { id: '9', nome: 'FABIO ROBERTO', matricula: '3366847', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 0, telefone: '5511922221111' },
    { id: '10', nome: 'CLEONICE SANTOS', matricula: '640515', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00', folgaFixa: 3, telefone: '5511933332222' },
    { id: '11', nome: 'SERGIO RICARDO', matricula: '6413005', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 2, telefone: '5511944443333' },
    { id: '12', nome: 'FABRICIO SOUZA', matricula: '6789358', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 1, telefone: '5511977776666' },
    { id: '13', nome: 'FLAVIO REZENDE', matricula: '6513042', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00', folgaFixa: 3, telefone: '5511966665555' },
    { id: '14', nome: 'VALDEMIR LOURENÇO', matricula: '7095783', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2, telefone: '5511944443333' },
    { id: '15', nome: 'CLAUDEMIR', matricula: '0', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 5, telefone: '5511961909818' },
    // 2º TURNO: 14:30
    { id: '16', nome: 'JOSE MANOEL', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 1, telefone: '5511988887777' },
    { id: '17', nome: 'ALEXSANDER FREIRE', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0, telefone: '5511955554444' },
    { id: '18', nome: 'KAUA PEREIRA', matricula: '6199917', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2, telefone: '5511999998888' },
    { id: '19', nome: 'ISABELLY DE OLIVEIRA', matricula: '6871283', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 5, telefone: '5511900009999' },
    { id: '20', nome: 'ANA MARIA', matricula: '6339867', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0, telefone: '5511911110000' },
    { id: '21', nome: 'LUANA VIEIRA', matricula: '6885551', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2, telefone: '5511922221111' },
    { id: '22', nome: 'ALINE DOMINGUES', matricula: '6778011', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 1, telefone: '5511933332222' },
    { id: '23', nome: 'RENAN ARRUDA', matricula: '6099980', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 0, telefone: '5511999998888' },
    { id: '24', nome: 'THIAGO DA SILVA', matricula: '6945961', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 2, telefone: '5511966665555' },
    { id: '25', nome: 'ABRAHAO ALVES', matricula: '6948111', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 4, telefone: '5511977776666' },
    { id: '26', nome: 'IVAN CARMO', matricula: '5839653', role: ROLES.COLABORADOR, funcao: 'OP. PLENO', horario: '14:30', folgaFixa: 1, telefone: '5511988887777' },
    { id: '27', nome: 'DANILO GOMES', matricula: '6020917', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30', folgaFixa: 3, telefone: '5511900001111' },
    { id: '28', nome: 'THOMAS AUGUSTO', matricula: '7070632', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 2, telefone: '5511922223333' },
    // 3º TURNO NOTURNO: 22:00
    { id: '29', nome: 'CLAUDIOR DE MELO', matricula: '6507859', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3, telefone: '5511911112222' },
    { id: '30', nome: 'ABNER DE SOUZA', matricula: '7107293', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 2, telefone: '5511900002222' },
    { id: '31', nome: 'RENATO ARAUJO', matricula: '5925479', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3, telefone: '5511933334444' },
    { id: '32', nome: 'DANIEL SILVA', matricula: '6973647', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 3, telefone: '5511944445555' },
    { id: '33', nome: 'MAURICIO ALMEIDA', matricula: '6580408', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00', folgaFixa: 1, telefone: '5511955556666' },
];

if (typeof window !== 'undefined') {
    window.MOCK_COLABORADORES = MOCK_COLABORADORES;
}

export const MOCK_GESTOR = {
    id: '0',
    nome: 'EDERSON CUBAS',
    matricula: '101010',
    role: ROLES.GESTOR,
    telefone: '5511974154868'
};

export const LOJA_INFO = {
    setor: 'MERCEARIA',
    loja: 'SUZANO',
    cr: '068',
    unidade: 'SUZANO 068',
    gestor: 'EDERSON CUBAS'
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // 1 to 12
const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
const DIAS_SEMANA_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export const DIAS_IMAGEM = Array.from({ length: 31 }, (_, i) => {
    // Início em 16/03/2026
    const start = new Date(2026, 2, 16);
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
        dia: d.getDate(),
        sem: DIAS_SEMANA_SHORT[d.getDay()]
    };
});

export const IMAGE_GRID = {
    '1':  ['', '', '', '', '', '', 'D', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '2':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '3':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', university: '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '4':  ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
    '5':  ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', 'F'],
    '6':  ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', 'F', ''],
    '7':  ['', '', 'F', '', '', '', 'F', '', university: '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '8':  ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', 'F'],
    '9':  ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', university: '', '', '', '', '', 'F', '', '', ''],
    '10': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', university: '', 'F', '', '', ''],
    '11': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', university: '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '12': ['', 'F', '', '', '', '', 'F', '', 'F', '', university: '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
    '13': ['F', '', '', '', '', '', 'D', 'F', '', '', '', '', '', 'F', 'F', '', '', '', '', '', 'F', 'F', '', '', '', '', '', 'F', 'F', '', ''],
    '14': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '15': ['', 'F', '', '', '', '', 'F', 'F', '', '', '', '', '', 'F', 'F', '', '', '', '', '', 'F', 'F', '', '', '', '', '', 'F', 'F', '', ''],
    '16': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
    '17': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', 'F'],
    '18': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', university: '', '', '', '', '', 'F', '', 'F', ''],
    '19': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', 'F'],
    '20': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', ''],
    '21': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '22': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', university: '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
    '23': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', ''],
    '24': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', sea: '', '', '', '', 'F', '', 'F', ''],
    '25': ['', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', ''],
    '26': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', university: '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
    '27': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', ''],
    '28': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', ''],
    '29': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', university: '', 'F', '', '', '', 'F', '', '', '', 'F', '', '', 'F', '', 'F', ''],
    '30': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', university: '', '', '', '', '', 'F', '', 'F', ''],
    '31': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', university: '', '', '', 'F', '', '', 'F', '', 'F', ''],
    '32': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', university: '', '', '', 'F', '', '', 'F', '', 'F', ''],
    '33': ['', 'F', '', '', '', '', 'F', '', 'F', '', '', '', university: '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', ''],
};
