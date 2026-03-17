import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Clock, Calendar, ArrowLeftRight, MessageSquare, Sun, Moon } from 'lucide-react';
import ScaleManager from '../gestor/ScaleManager';
import Modal from '../common/Modal';
import CommunicationCenter from '../common/CommunicationCenter';


import { MOCK_COLABORADORES, DIAS_IMAGEM, MOCK_GESTOR, SCALE_START_DATE } from '../../logic/mockData';
import { generateScale } from '../../logic/scaleEngine';
import { STORE_CONFIG } from '../../logic/constants';
import WhatsAppModal from '../common/WhatsAppModal';

// ─── Helpers ───────────────────────────────────────────────────────────────

const getShiftDisplay = (horario) => {
    if (horario === '14:30') return { label: '14:30 — 22:50', nome: '2º Turno', icon: 'moon' };
    return { label: '07:30 — 14:30', nome: '1º Turno', icon: 'sun' };
};

const getTodayIndex = () => {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    // Encontrar índice baseado na data real comparada à SCALE_START_DATE
    const diffTime = Math.abs(hoje - SCALE_START_DATE);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 31 ? diffDays : 0;
};

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const getStatusHoje = (colabId, todayIdx, dynamicGrid, horario) => {
    const grade = dynamicGrid[colabId] || [];
    const val = grade[todayIdx] || '';
    if (val === 'F') return { label: 'Folga', color: '#E65100', bg: 'rgba(255,102,0,0.12)', icon: '🌴' };
    if (val === 'D') return { label: 'Descanso (D)', color: '#1565C0', bg: 'rgba(33,150,243,0.12)', icon: '😴' };
    
    let label = 'Em Serviço';
    let color = '#2E7D32';
    let bg = 'rgba(46,125,50,0.10)';
    let icon = '✅';

    if (horario) {
        const agora = new Date();
        const minutosAtual = agora.getHours() * 60 + agora.getMinutes();
        const [h, m] = horario.split(':').map(Number);
        const minutosTurnoInicio = h * 60 + m;
        const minutosTurnoFim = minutosTurnoInicio + (8 * 60 + 20); // Turno aproximado 8h20m

        if (minutosAtual < minutosTurnoInicio) {
            label = 'Aguardando Turno';
            color = '#F57C00';
            bg = 'rgba(245,124,0,0.10)';
            icon = '⏳';
        } else if (minutosAtual > minutosTurnoFim && h < 18) {
            label = 'Turno Encerrado';
            color = '#616161';
            bg = 'rgba(97,97,97,0.10)';
            icon = '🏁';
        }
    }

    return { label, color, bg, icon };
};

const getProximasFolgas = (colabId, todayIdx, dynamicGrid) => {
    const grade = dynamicGrid[colabId] || [];
    const folgas = [];
    const hoje = new Date();
    const startDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    for (let i = todayIdx + 1; i < grade.length; i++) {
        if (grade[i] === 'F' || grade[i] === 'D') {
            const dataBase = new Date(startDate);
            dataBase.setDate(dataBase.getDate() + i);
            folgas.push({
                diaNum: dataBase.getDate(),
                mes: MESES[dataBase.getMonth()],
                semana: DIAS_SEMANA[dataBase.getDay()].substring(0, 3).toUpperCase()
            });
            if (folgas.length >= 3) break;
        }
    }
    return folgas;
};

// ─── Componente ────────────────────────────────────────────────────────────

const ColaboradorDashboard = ({ user, messages, notifications, historico, pontosBatidos = [], onAddMessage, onMarkRead, onBaterPonto }) => {
    const [isCheckingIP, setIsCheckingIP] = useState(false);
    const [bypassIP, setBypassIP] = useState(false);
    const [showScale, setShowScale] = useState(true);
    const [activeMainTab, setActiveMainTab] = useState('dashboard'); // 'dashboard' or 'communication'
    const [waModalOpen, setWaModalOpen] = useState(false);
    const [waTemplate, setWaTemplate] = useState('');

    // Gerar escala dinâmica para o período (16/03 a 15/04)
    const dynamicScale = React.useMemo(() => generateScale(MOCK_COLABORADORES, SCALE_START_DATE, 31), []);

    const dynamicGrid = React.useMemo(() => {
        const grid = {};
        dynamicScale.forEach(entry => {
            if (!grid[entry.colaborador_id]) grid[entry.colaborador_id] = [];
            grid[entry.colaborador_id].push(entry.tipo);
        });
        return grid;
    }, [dynamicScale]);

    const todayIdx = getTodayIndex();
    const colabData = MOCK_COLABORADORES.find(c => c.id === user.id) || {};
    const { horario = '07:30', funcao = 'OP. LOJA' } = colabData;
    const turno = getShiftDisplay(horario);
    const statusHoje = getStatusHoje(user.id, todayIdx, dynamicGrid, horario);
    const proximasFolgas = getProximasFolgas(user.id, todayIdx, dynamicGrid);
    const isFolgaHoje = statusHoje.label === 'Folga' || statusHoje.label === 'Descanso (D)';

    const handleSubmitJustificativa = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simula o processamento do arquivo
        const fileName = file ? file.name : 'Nenhum arquivo';
        console.log('Arquivo anexado:', fileName);

        setTimeout(() => {
            alert(`Justificativa enviada com sucesso! ${file ? '(Anexo incluído)' : ''}`);
            setShowJustificativa(false);
            setFile(null); // Limpa o arquivo após envio
            setLoading(false);
        }, 1200);
    };

    const handleTalkToGestor = (type = 'general') => {
        const templates = {
            general: `Olá ${MOCK_GESTOR.nome}, aqui é o colaborador ${user.nome}. Gostaria de tratar de um assunto sobre minha escala.`,
            atraso: `Olá ${MOCK_GESTOR.nome}, tive um imprevisto e vou me atrasar um pouco hoje. Já estou a caminho!`,
            duvida: `Oi ${MOCK_GESTOR.nome}, estou com uma dúvida sobre meu dia de folga nesta semana. Poderia me confirmar?`
        };
        setWaTemplate(templates[type] || templates.general);
        setWaModalOpen(true);
    };

    const handleCheckIn = async () => {
        setIsCheckingIP(true);
        try {
            // 1. Obter Localização (GPS)
            const getCoords = () => new Promise((resolve, reject) => {
                if (!navigator.geolocation) reject('Geolocalização não suportada');
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    (err) => reject(err.message),
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            });

            let coords = null;
            try {
                coords = await getCoords();
            } catch (err) {
                console.warn('Erro ao obter GPS:', err);
                // Fallback ou aviso se necessário
            }

            // 2. Verificar IP/Rede
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const userIP = data.ip;

            if (bypassIP || userIP === STORE_CONFIG.OFFICIAL_IP) {
                onBaterPonto({
                    colabId: user.id,
                    timestamp: new Date().toISOString(),
                    coords: coords,
                    networkIP: userIP
                });
                alert('Ponto registrado com sucesso! Localização e IP validados. Bom trabalho.');
            } else {
                alert(`Conexão Recusada!\n\nSeu IP atual (${userIP}) não pertence à rede autorizada da Mercearia Suzano 068.\n\nPor favor, conecte-se ao Wi-Fi da loja para bater o ponto.`);
            }
        } catch (error) {
            console.error('Erro no registro de ponto:', error);
            if (bypassIP) {
                onBaterPonto({
                    colabId: user.id,
                    timestamp: new Date().toISOString(),
                    coords: { lat: -23.5375, lng: -46.3123 }, // Coordenadas simuladas de Suzano
                    networkIP: '127.0.0.1'
                });
                alert('Ponto registrado (Modo de Teste/Bypass)!');
            } else {
                alert('Erro ao validar presença. Verifique sua conexão e tente novamente.');
            }
        } finally {
            setIsCheckingIP(false);
        }
    };

    const jaBateuPonto = pontosBatidos.some(p => p.colabId === user.id);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Olá, {user.nome.split(' ')[0]}! 👋</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{funcao} · Mercearia Suzano 068</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                            onClick={() => setActiveMainTab('dashboard')} 
                            variant={activeMainTab === 'dashboard' ? 'primary' : 'outline'}
                            style={{ fontSize: '12px' }}
                        >
                            Início
                        </Button>
                        <Button 
                            onClick={() => setActiveMainTab('communication')} 
                            variant={activeMainTab === 'communication' ? 'primary' : 'outline'}
                            style={{ fontSize: '12px' }}
                        >
                            WhatsApp
                        </Button>
                    </div>
                </div>
            </header>

            {activeMainTab === 'communication' ? (
                <CommunicationCenter 
                    user={user} 
                    messages={messages} 
                    notifications={notifications}
                    dynamicScale={dynamicScale}
                    onAddMessage={onAddMessage}
                    onMarkRead={onMarkRead}
                />
            ) : (
                <>

            <Card className="assai-gradient" style={{ color: 'white', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '50%', flexShrink: 0 }}>
                        {turno.icon === 'moon' ? <Moon size={30} /> : <Sun size={30} />}
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', opacity: 0.85, marginBottom: '2px' }}>{turno.nome} — Seu turno:</p>
                        <h3 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '1px' }}>{turno.label}</h3>
                    </div>
                </div>

                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', opacity: 0.9 }}>Status hoje:</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                        {statusHoje.icon && `${statusHoje.icon} `}{statusHoje.label}
                    </span>
                </div>

                {!isFolgaHoje && (
                    <div style={{ marginTop: '14px' }}>
                        {jaBateuPonto ? (
                            <div style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', border: '2px solid #FFF', color: 'white', fontWeight: '800', fontSize: '14px' }}>
                                ✅ PONTO REGISTRADO
                            </div>
                        ) : (
                            <>
                                <Button 
                                    onClick={handleCheckIn} 
                                    variant="secondary" 
                                    disabled={isCheckingIP}
                                    style={{ width: '100%', background: 'white', color: 'var(--assai-orange)', fontWeight: '700' }}
                                >
                                    {isCheckingIP ? 'VERIFICANDO REDE...' : 'BATER PONTO'}
                                </Button>
                                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="bypass" 
                                        checked={bypassIP} 
                                        onChange={(e) => setBypassIP(e.target.checked)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label htmlFor="bypass" style={{ fontSize: '10px', opacity: 0.8, cursor: 'pointer' }}>
                                        Simular rede da loja (Bypass IP para teste)
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Card>



            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#FFF8F0', border: turno.nome === '1º Turno' ? '2px solid var(--assai-orange)' : '1px solid #FFE0C8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sun size={18} color="var(--assai-orange)" />
                    <div>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>1º TURNO</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: 'var(--assai-orange)' }}>07:30 — 14:30</p>
                    </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#F3F0FF', border: turno.nome === '2º Turno' ? '2px solid #6A1B9A' : '1px solid #D8CAFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Moon size={18} color="#6A1B9A" />
                    <div>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>2º TURNO</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: '#6A1B9A' }}>14:30 — 22:50</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowScale(!showScale)}>
                    <Calendar size={24} color={showScale ? 'var(--status-success)' : 'var(--assai-orange)'} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{showScale ? 'Ocultar Escala' : 'Minha Escala'}</p>
                </Card>
            </div>

            <WhatsAppModal 
                isOpen={waModalOpen} 
                onClose={() => setWaModalOpen(false)} 
                recipient={MOCK_GESTOR} 
                templateMessage={waTemplate} 
            />


            {showScale && <div style={{ marginBottom: '24px', animation: 'fadeIn 0.3s' }}><ScaleManager colaboradorId={user.id} historico={historico} /></div>}

            <Card style={{ padding: '15px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '700' }}>🗓️ Próximas Folgas</h4>
                {proximasFolgas.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '10px 0' }}>Sem folgas previstas no período.</p>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {proximasFolgas.map((f, i) => (
                            <div key={i} style={{ background: i === 0 ? '#FFF5F0' : '#F8F9FA', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${i === 0 ? '#FFD0B0' : '#E0E0E0'}`, minWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                                <p style={{ fontSize: '10px', color: i === 0 ? 'var(--assai-orange)' : 'var(--text-tertiary)', fontWeight: '600', marginBottom: '4px' }}>{f.semana}</p>
                                <p style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{f.diaNum}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{f.mes}</p>
                            </div>
                        ))}
                    </div>
                )}
                </Card>
                </>
            )}
        </div>
    );
};

export default ColaboradorDashboard;
