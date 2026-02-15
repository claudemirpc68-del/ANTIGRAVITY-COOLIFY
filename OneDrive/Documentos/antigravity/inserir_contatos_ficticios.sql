-- Script para inserir dados fictícios na tabela contatos
-- Copie e cole este código no SQL Editor do Supabase

INSERT INTO public.contatos (nome_completo, sobrenome, email, telefone, estado, empresa, categoria, observacoes)
VALUES 
('Carlos', 'Eduardo', 'carlos.eduardo@email.com', '(11) 91234-5678', 'SP', 'Tech Solutions', 'Cliente', 'Interessado em consultoria de nuvem'),
('Beatriz', 'Santos', 'beatriz.santos@parceiro.com', '(21) 98888-7777', 'RJ', 'Santos & Co', 'Parceiro', 'Parceria estratégica iniciada em Janeiro'),
('Ricardo', 'Mendes', 'r.mendes@fornecedor.com', '(31) 97777-6666', 'MG', 'Global Logística', 'Fornecedor', 'Entrega rápida de insumos'),
('Juliana', 'Almeida', 'juliana.lead@site.com', '(41) 96666-5555', 'PR', 'Almeida Negócios', 'Lead', 'Baixou o ebook de automação'),
('Fernando', 'Costa', 'fernando.costa@empresa.com', '(51) 95555-4444', 'RS', 'Costa Inc', 'Cliente', 'Cliente recorrente desde 2023'),
('Patrícia', 'Gomes', 'patricia.gomes@email.com', '(61) 94444-3333', 'DF', 'Gomes Jurídico', 'Cliente', 'Assunto: Renovação de contrato'),
('Sérgio', 'Pinto', 'sergio.p@fornecedor.com', '(71) 93333-2222', 'BA', 'Pinto Suprimentos', 'Fornecedor', 'Material de escritório'),
('Aline', 'Vieira', 'aline.vieira@lead.com', '(81) 92222-1111', 'PE', 'Vieira Eventos', 'Lead', 'Pediu orçamento por WhatsApp'),
('Maurício', 'Silva', 'm.silva@cliente.com', '(85) 91111-0000', 'CE', 'Maurício ME', 'Cliente', 'Foco em manutenção preventiva'),
('Camila', 'Rocha', 'camila.rocha@email.com', '(98) 90000-1111', 'MA', 'Rocha Design', 'Parceiro', 'Desenvolvimento de logos');
