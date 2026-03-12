import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import { User, Lock } from 'lucide-react';
import { MOCK_COLABORADORES, MOCK_GESTOR } from '../../logic/mockData';

const LoginForm = ({ onLogin }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [showMatricula, setShowMatricula] = useState(false);

    const handleUserChange = (e) => {
        const val = e.target.value;
        setSelectedUser(val);
        setShowMatricula(false);
        if (val) {
            setMatricula(val);
        } else {
            setMatricula('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const matriculaLimpa = matricula.trim();
        const senhaLimpa = senha.trim();

        // Busca o colaborador ou gestor pela matrícula
        const isGestor = matriculaLimpa === MOCK_GESTOR.matricula;
        const colaborador = MOCK_COLABORADORES.find(c => c.matricula === matriculaLimpa);
        const userFound = isGestor ? MOCK_GESTOR : colaborador;

        if (!userFound) {
            alert('Matrícula não encontrada. Verifique o número e tente novamente.');
            return;
        }

        // A senha são os 4 primeiros dígitos da matrícula
        const senhaCorreta = userFound.matricula.substring(0, 4);

        if (senhaLimpa !== senhaCorreta) {
            alert('Senha incorreta! Verifique os dados e tente novamente.');
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
                <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: '700' }}>Bem-vindo</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Acesse sua conta da Mercearia</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Selecione seu Nome:</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', zIndex: 1 }} />
                        <select
                            value={selectedUser}
                            onChange={handleUserChange}
                            style={{ width: '100%', paddingLeft: '40px', background: 'white' }}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value={MOCK_GESTOR.matricula}>{MOCK_GESTOR.nome} (GESTOR)</option>
                            <optgroup label="Colaboradores">
                                {MOCK_COLABORADORES.map(c => (
                                    <option key={c.id} value={c.matricula}>{c.nome}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Nº de Registro (Matrícula):</label>
                    <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                type="text"
                                placeholder="Matrícula"
                                required
                                readOnly={!!selectedUser}
                                value={selectedUser ? (showMatricula ? matricula : '••••••') : matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                style={{ width: '100%', paddingLeft: '40px', background: selectedUser ? '#f5f5f5' : 'white' }}
                            />
                        </div>
                        {selectedUser && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setShowMatricula(!showMatricula)}
                                style={{ padding: '0 10px', fontSize: '11px', minWidth: '60px' }}
                            >
                                {showMatricula ? 'Ocultar' : 'Ver Nº'}
                            </Button>
                        )}
                    </div>
                    {showMatricula && (
                        <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(255, 102, 0, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--assai-orange)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0 }}>
                                Sua senha são os <strong>4 primeiros dígitos</strong> (ex: {matricula.substring(0, 4)}).
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="password"
                        placeholder="Senha de 4 dígitos"
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
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Esqueceu a senha? Selecione seu nome e clique em "Ver Nº" para ver os 4 dígitos iniciais.
                </span>
            </div>
        </Card>

    );
};

export default LoginForm;
