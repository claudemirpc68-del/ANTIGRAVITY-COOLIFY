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
        nome: 'CLAUDEMIR',
        matricula: '4593634',
        role: ROLES.COLABORADOR,
        funcao: 'OP. LOJA',
        horario: '08:00'
    }
];

export const MOCK_GESTOR = {
    id: '0',
    nome: 'CLAUDEMIR',
    matricula: '101010',
    role: ROLES.GESTOR
};

export const MOCK_ESCALA_EXAMPLE = [
    { colaborador_id: '1', data: '2026-03-01', tipo: SCALE_TYPES.FOLGA },
    { colaborador_id: '1', data: '2026-03-02', tipo: SCALE_TYPES.TRABALHO },
    { colaborador_id: '2', data: '2026-03-01', tipo: SCALE_TYPES.TRABALHO },
    { colaborador_id: '2', data: '2026-03-02', tipo: SCALE_TYPES.FOLGA }
];
