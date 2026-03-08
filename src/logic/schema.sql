-- Database Schema: Sistema Escala Assai (Mercearia)

-- Tabela de Colaboradores
CREATE TABLE colaboradores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    matricula TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('gestor', 'colaborador')) DEFAULT 'colaborador',
    setor TEXT DEFAULT 'Mercearia',
    data_admissao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Escala Mensal (Planejamento)
CREATE TABLE escalas (
    id SERIAL PRIMARY KEY,
    colaborador_id UUID REFERENCES colaboradores(id),
    data DATE NOT NULL,
    tipo CHAR(3) NOT NULL, -- T (Trabalho), F (Folga), FF (Feriado), FBH (Banco de Horas)
    horario_previsto TEXT, -- Ex: "08:00 - 14:30"
    UNIQUE(colaborador_id, data)
);

-- Tabela de Registro de Ponto (Realizado)
CREATE TABLE pontos (
    id SERIAL PRIMARY KEY,
    colaborador_id UUID REFERENCES colaboradores(id),
    data DATE DEFAULT CURRENT_DATE,
    entrada TIMESTAMP WITH TIME ZONE,
    saida TIMESTAMP WITH TIME ZONE,
    justificativa TEXT,
    aprovado_gestor BOOLEAN DEFAULT FALSE
);

-- Tabela de Trocas de Turno
CREATE TABLE trocas (
    id SERIAL PRIMARY KEY,
    solicitante_id UUID REFERENCES colaboradores(id),
    receptor_id UUID REFERENCES colaboradores(id),
    data_original DATE,
    data_desejada DATE,
    status TEXT CHECK (status IN ('pendente_colega', 'pendente_gestor', 'aprovada', 'rejeitada')) DEFAULT 'pendente_colega'
);
