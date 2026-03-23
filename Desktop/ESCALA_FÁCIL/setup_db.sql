-- ============================================================
-- ESCALA_FÁCIL - Schema para Supabase (PostgreSQL)
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ============================================================

-- 1. TABELA DE COLABORADORES
CREATE TABLE IF NOT EXISTS colaboradores (
    matricula TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    funcao TEXT,
    horario_padrao TEXT,
    tipo TEXT DEFAULT 'colaborador', -- 'colaborador' ou 'gestor'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE ESCALAS (DIÁRIA)
CREATE TABLE IF NOT EXISTS escalas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula TEXT REFERENCES colaboradores(matricula) ON DELETE CASCADE,
    data DATE NOT NULL,
    dia_semana TEXT,
    status TEXT NOT NULL, -- 'TRABALHA' ou 'FOLGA'
    entrada TEXT,         -- Horário de entrada se status = 'TRABALHA'
    tipo_folga TEXT       -- Tipo da folga se status = 'FOLGA'
);

CREATE INDEX IF NOT EXISTS idx_escalas_matricula_data ON escalas(matricula, data);

-- 3. TABELA DE DOMINGOS DE FOLGA (FACILITA CONSULTA RÁPIDA)
CREATE TABLE IF NOT EXISTS domingos_folga (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricula TEXT REFERENCES colaboradores(matricula) ON DELETE CASCADE,
    data DATE NOT NULL
);

-- 4. TABELA DE SOLICITAÇÕES
CREATE TABLE IF NOT EXISTS solicitacoes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    matricula TEXT REFERENCES colaboradores(matricula) ON DELETE SET NULL,
    nome TEXT,
    tipo TEXT, -- 'Troca de Turno', 'Justificativa', etc.
    texto TEXT,
    status TEXT DEFAULT 'PENDENTE', -- 'PENDENTE', 'APROVADO', 'REJEITADO'
    data_criacao TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE SESSÕES (WATSAPP BOT)
CREATE TABLE IF NOT EXISTS sessoes (
    numero_telefone TEXT PRIMARY KEY, -- Formato 'whatsapp:+55...'
    matricula TEXT,
    nome TEXT,
    tipo TEXT,
    estado TEXT,             -- Ex: 'aguardando_texto'
    tipo_solicitacao TEXT,   -- Ex: 'Troca de Turno/Folga'
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função para atualizar o timestamp de 'updated_at' automaticamente na tabela sessoes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sessoes_updated_at
    BEFORE UPDATE ON sessoes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- INSERÇÃO DE GESTORES INICIAIS (Exemplos)
-- ============================================================
INSERT INTO colaboradores (matricula, nome, tipo) 
VALUES 
    ('101010', 'Anderson Cubas', 'gestor'),
    ('111111', 'John', 'gestor'),
    ('121212', 'Leonardo', 'gestor'),
    ('131313', 'Ivan', 'gestor'),
    ('101012', 'Antonio', 'gestor')
ON CONFLICT (matricula) DO NOTHING;
