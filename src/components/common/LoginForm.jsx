import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import { User, Lock, Info } from 'lucide-react';
import { MOCK_COLABORADORES, MOCK_GESTOR } from '../../logic/mockData';

const LoginForm = ({ onLogin }) => {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const matriculaLimpa = matricula.trim();
        const senhaLimpa = senha.trim();

        // Busca o colaborador ou gestor pela matrícula
        const isGestor = matriculaLimpa === MOCK_GESTOR.matricula;
        const colaborador = MOCK_COLABORADORES.find(c => c.matricula === matriculaLimpa);
        const userFound = isGestor ? MOCK_GESTOR : colaborador;

        if (!userFound) {
            alert('Matrícula não encontrada. Verique os dados ou procure seu gestor.');
            return;
        }

        // A senha são os 4 primeiros dígitos da matrícula
        const senhaCorreta = userFound.matricula.substring(0, 4);

        if (senhaLimpa !== senhaCorreta) {
            alert('Senha incorreta!');
            return;
        }

        if (isGestor) {
            onLogin('gestor', MOCK_GESTOR.nome, MOCK_GESTOR.id);
        } else {
            onLogin('colaborador', colaborador.nome, colaborador.id);
        }
    };

    return (
        <Card className="animate-fade-in" style={{ width: '100%', maxWidth: '380px', margin: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700' }}>Acesso Restrito</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Digite suas credenciais da Mercearia</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Nº de Registro (Matrícula):</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Ex: 123456"
                            required
                            value={matricula}
                            onChange={(e) => setMatricula(e.target.value)}
                            style={{ width: '100%', paddingLeft: '40px' }}
                        />
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Senha:</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="password"
                            placeholder="Sua senha de 4 dígitos"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={{ width: '100%', paddingLeft: '40px' }}
                        />
                    </div>
                </div>

                <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>
                    Entrar no Sistema
                </Button>
            </form>

            <div style={{ marginTop: '20px', padding: '12px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #EEE' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Info size={16} color="var(--text-tertiary)" style={{ marginTop: '2px' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        <strong>Esqueceu seus dados?</strong> Por motivos de segurança, a lista de nomes foi removida. Caso não saiba sua matrícula, solicite ao seu gestor direto.
                    </span>
                </div>
            </div>
        </Card>
    );
};

export default LoginForm;
