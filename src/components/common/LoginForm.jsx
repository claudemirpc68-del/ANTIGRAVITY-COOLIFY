import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import { User, Lock } from 'lucide-react';
import { MOCK_COLABORADORES, MOCK_GESTOR } from '../../logic/mockData';

const LoginForm = ({ onLogin }) => {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const matriculaLimpa = matricula.trim();
        const senhaLimpa = senha.trim();

        // Busca o colaborador pela matrícula nos dados reais
        const colaborador = MOCK_COLABORADORES.find(c => c.matricula === matriculaLimpa);
        const senhaCorreta = '1010';

        if (senhaLimpa !== senhaCorreta) {
            alert('Senha incorreta! Use a senha padrão definida.');
            return;
        }

        if (matriculaLimpa === MOCK_GESTOR.matricula) {
            onLogin('gestor', MOCK_GESTOR.nome, MOCK_GESTOR.id);
        } else if (colaborador) {
            onLogin('colaborador', colaborador.nome, colaborador.id);
        } else {
            alert('Matrícula não encontrada. Verifique o número e tente novamente.');
        }
    };

    return (
        <Card className="animate-fade-in" style={{ width: '100%', maxWidth: '380px', margin: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700' }}>Bem-vindo</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Acesse sua conta da Mercearia</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Matrícula"
                        required
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="password"
                        placeholder="Senha (1010)"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>

                <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>
                    Entrar no Sistema
                </Button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="#" style={{ fontSize: '12px', color: 'var(--assai-orange)', textDecoration: 'none', fontWeight: '500' }}>Esqueci minha senha</a>
            </div>
        </Card>
    );
};

export default LoginForm;
