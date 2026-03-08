import { ROLES, SCALE_TYPES } from './constants';

export const MOCK_COLABORADORES = [
    {
        id: '1',
        nome: 'AMANDA PORTO',
        matricula: '5741181',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '08:00'
    },
    {
        id: '2',
        nome: 'KAIQUE VIEIRA',
        matricula: '658526',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '06:00'
    },
    {
        id: '3',
        nome: 'DAYANA ANGELO',
        matricula: '5477786',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '06:00'
    },
    {
        id: '4',
        nome: 'LUIZA JESUS',
        matricula: '604933',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '06:00'
    },
    {
        id: '5',
        nome: 'LINDINALVA',
        matricula: '2741768',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '07:00'
    },
    {
        id: '6',
        nome: 'DENISE ISSI',
        matricula: '596254',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '07:00'
    },
    {
        id: '7',
        nome: 'PEDRO ANGELO',
        matricula: '672167',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '08:00'
    },
    {
        id: '8',
        nome: 'CLAUDINEI',
        matricula: '4593634',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '08:00'
    },
    {
        id: '9',
        nome: 'CLAUDEMIR',
        matricula: '4593600',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '14:30'
    }
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
    '9': ['', '', '', '', 'F', '', '10:30', '', '', '', '', 'F', '', '10:30', '', '', '', '', 'F', '', 'F', '', '', '', '', 'F', '', 'F']
};
