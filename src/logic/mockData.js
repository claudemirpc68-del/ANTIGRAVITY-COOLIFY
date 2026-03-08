import { ROLES, SCALE_TYPES } from './constants';

export const MOCK_COLABORADORES = [
    { id: '1', nome: 'AMANDA PORTO', matricula: '5741181', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00' },
    { id: '2', nome: 'KAIQUE VIEIRA', matricula: '658526', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00' },
    { id: '3', nome: 'DAYANA ANGELO', matricula: '5477786', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00' },
    { id: '4', nome: 'LUIZA JESUS', matricula: '604933', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00' },
    { id: '5', nome: 'LINDINALVA', matricula: '2741768', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00' },
    { id: '6', nome: 'DENISE ISSI', matricula: '596254', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '07:00' },
    { id: '7', nome: 'PEDRO ANGELO', matricula: '672167', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00' },
    { id: '8', nome: 'CLAUDINEI', matricula: '4593634', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00' },
    { id: '9', nome: 'CLAUDEMIR', matricula: '4593600', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '10', nome: 'FABIO ROBERTO', matricula: '3366847', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00' },
    { id: '11', nome: 'CLEONICE SANTOS', matricula: '640515', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '06:00' },
    { id: '12', nome: 'SERGIO RICARDO', matricula: '6413005', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '08:00' },
    { id: '13', nome: 'ALEXSANDER FREIRE', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '14', nome: 'FLAVIO REZENDE', matricula: '6513042', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '15', nome: 'FABRICIO SOUZA', matricula: '6789358', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '16', nome: 'JOSE MANOEL', matricula: '4581008', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '17', nome: 'KAUA PEREIRA', matricula: '6199917', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '18', nome: 'ISABELI', matricula: '6871283', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '19', nome: 'ANA MARIA', matricula: '6339867', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '20', nome: 'LUANA VIEIRA', matricula: '6885551', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '21', nome: 'ALINE', matricula: '6778011', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '22', nome: 'VALDEMIR', matricula: '0000001', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '23', nome: 'THIAGO', matricula: '6945961', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '24', nome: 'ABRAÃO', matricula: '6948111', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '25', nome: 'IVAN CARMO', matricula: '5839653', role: ROLES.COLABORADOR, funcao: 'OP. PLENO', horario: '14:30' },
    { id: '26', nome: 'RENAN', matricula: '6099980', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '14:30' },
    { id: '27', nome: 'JACK ARAUJO', matricula: '6011799', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '28', nome: 'CLAUDIOR DE MELO', matricula: '6507859', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '29', nome: 'THOMAS', matricula: '0000002', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '30', nome: 'RENATO', matricula: '5925479', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '31', nome: 'DANIEL SILVA', matricula: '6973647', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '32', nome: 'MAURICIO ALMEIDA', matricula: '6580408', role: ROLES.COLABORADOR, funcao: 'OP. LOJA', horario: '22:00' },
    { id: '33', nome: 'GILBERTO', matricula: '5285771', role: ROLES.COLABORADOR, funcao: 'OP. PLENO', horario: '22:00' },
];

export const MOCK_GESTOR = {
    id: '0',
    nome: 'CLAUDEMIR',
    matricula: '101010',
    role: ROLES.GESTOR
};

export const DIAS_IMAGEM = [
    { dia: 16, sem: 'seg' }, { dia: 17, sem: 'ter' }, { dia: 18, sem: 'qua' }, { dia: 19, sem: 'qui' },
    { dia: 20, sem: 'sex' }, { dia: 21, sem: 'sab' }, { dia: 22, sem: 'dom' }, { dia: 23, sem: 'seg' },
    { dia: 24, sem: 'ter' }, { dia: 25, sem: 'qua' }, { dia: 26, sem: 'qui' }, { dia: 27, sem: 'sex' },
    { dia: 28, sem: 'sab' }, { dia: 1, sem: 'dom' }, { dia: 2, sem: 'seg' }, { dia: 3, sem: 'ter' },
    { dia: 4, sem: 'qua' }, { dia: 5, sem: 'qui' }, { dia: 6, sem: 'sex' }, { dia: 7, sem: 'sab' },
    { dia: 8, sem: 'dom' }, { dia: 9, sem: 'seg' }, { dia: 10, sem: 'ter' }, { dia: 11, sem: 'qua' },
    { dia: 12, sem: 'qui' }, { dia: 13, sem: 'sex' }, { dia: 14, sem: 'sab' }, { dia: 15, sem: 'dom' }
];

export const IMAGE_GRID = {
    '1': ['', '', '', '', '', '', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    '2': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'D', '', '', '', '', '', '', 'D'],
    '3': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'D', '', '', '', '', '', '', 'D'],
    '4': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', '10:30', 'D', 'D', 'D', 'D', 'D', 'D', '10:30'],
    '5': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '6': ['', '', '', 'F', '', '', '10:30', '', '', '', 'F', '', '', '10:30', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '7': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', '10:30', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '8': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', '10:30', 'D', 'F', 'D', 'D', 'D', 'D', '10:30'],
    // Placeholder para Claudemir (9) que não estava na matriz, usando escala mista vazia.
    '9': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],

    // Novas linhas da imagem (Aproximação das Folgas Visíveis)
    '10': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '11': ['', '', 'F', '', '', '', '10:30', '', '', '', 'F', '', '', '10:30', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F'],
    '12': ['', '', '', 'F', '', '', '10:30', '', '', 'F', '', '', '', '10:30', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '13': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '14': ['', '', '', 'F', '', '', '10:30', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '10:30'],
    '15': ['F', '', '', '', '', '', '10:30', '', 'F', '', '', '', '', '10:30', '', 'F', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '16': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', '10:30', 'D', 'F', 'D', 'D', 'D', 'D', '10:30'],
    '17': ['', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '10:30', '', '', '', '', 'F', '', '10:30'],
    '18': ['', '', '', '', 'F', '', '10:30', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', '10:30'],
    '19': ['', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', ''],
    '20': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', '10:30', '', 'F', '', '', '', '', '10:30'],
    '21': ['', '', '', '', '', '', '10:30', '', '', '', 'F', '', '', '10:30', '', '', '', 'F', '', '', '10:30', '', '', 'F', '', '', '', 'F'],
    '22': ['', '', 'F', '', '', '', '10:30', '', '', 'F', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', '', '', '', '', '10:30'],
    '23': ['', '', '', 'F', '', '', '10:30', '', '', '', '', 'F', '', '10:30', '', '', '', 'F', '', '', 'F', '', '', '', '', 'F', '', 'F'],
    '24': ['', '', '', '', 'F', '', '', '', '', '', '', '', '', 'F', '', '', '', 'F', '', '', '10:30', '', '', 'F', '', '', '', '10:30'],
    '25': ['', '', '', '', 'F', '', '10:30', 'F', '', '', '', '', '', '10:30', 'F', '', '', '', '', '', '10:30', 'F', '', '', '', '', '', 'F'],
    '26': ['', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', '', '', '', '', 'F'],
    '27': ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', '22:00', 'D', 'F', 'D', 'D', 'D', 'D', '22:00'],
    '28': ['F', '', '', '', '', '', '22:00', '', 'F', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', '', 'F', '', '', '', '22:00'],
    '29': ['', '', 'F', '', '', '', 'F', '', '', 'F', '', '', '', '22:00', '', 'F', '', '', '', '', '22:00', '', 'F', '', '', '', '', 'F'],
    '30': ['', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', '22:00', '', '', 'F', '', '', '', '22:00', '', '', 'F', '', '', '', 'F'],
    '31': ['', '', '', 'F', '', '', '22:00', '', '', '', 'F', '', '', 'F', '', '', '', 'F', '', '', 'F', '', 'F', '', '', '', '', '22:00'],
    '32': ['F', '', '', '', '', '', 'F', 'F', '', '', '', '', '', '22:00', 'F', '', '', '', '', '', '22:00', '', '', 'F', '', '', '', 'F'],
    '33': ['', '', 'F', '', '', '', '22:00', '', 'F', '', '', '', '', 'F', '', '', '', '', '', '', 'F', '', 'F', '', '', '', '', '22:00']
};
