import React, { useState, useEffect } from 'react';
import { 
  Activity, BarChart3, Database, FileText, Layers, Sparkles 
} from 'lucide-react';

import Navbar from './components/Navbar';
import KPICard from './components/KPICard';
import DynamicChartCard from './components/DynamicChartCard';
import ChatPanel from './components/ChatPanel';
import UploadModal from './components/UploadModal';
import SettingsModal from './components/SettingsModal';
import DataPreviewModal from './components/DataPreviewModal';
import EmptyDashboard from './components/EmptyDashboard';

const API_BASE = "/api";

export default function App() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [previewData, setPreviewData] = useState({});
  
  // Modais
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Configurações salvas no localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("decisoes_inteligentes_settings") || localStorage.getItem("datamind_settings");
    return saved ? JSON.parse(saved) : { provider: "auto", apiKey: "" };
  });

  // Mensagens do chat
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! O dashboard está pronto e limpo. Carregue uma ou mais planilhas de dados brutos (.xlsx ou .csv) para que eu faça a leitura das métricas e apresente os insights.',
    }
  ]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/insights/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Erro ao carregar resumo:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    try {
      const res = await fetch(`${API_BASE}/data/preview`);
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
      }
    } catch (err) {
      console.error("Erro ao buscar pré-visualização:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchPreview();
  }, []);

  const handleClearData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/clear`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setPreviewData({});
        setMessages([
          {
            role: 'assistant',
            content: '🧹 Dashboard limpo com sucesso! Aguardando o envio da sua próxima planilha para uma nova análise.',
          }
        ]);
      }
    } catch (err) {
      alert("Erro ao limpar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleUploadFiles = async (files) => {
    setLoading(true);
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Erro no processamento da planilha");
    }

    const data = await res.json();
    setSummary(data.summary);
    await fetchPreview();
    setMessages(prev => [
      ...prev,
      { 
        role: 'assistant', 
        content: `🎉 **Planilha processada:** '${data.summary.dataset_title || files[0].name}'.\n\nForam mapeadas **${data.summary.total_rows} linhas** e **${data.summary.columns?.length || 0} colunas**. O dashboard foi gerado para esta planilha e você já pode fazer perguntas!` 
      }
    ]);
  };

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          provider: settings.provider,
          api_key: settings.apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            chart: data.chart,
            table: data.table
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '❌ Ocorreu um erro ao processar sua consulta no servidor.' }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `❌ Erro de conexão com a API: ${err.message}` }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("decisoes_inteligentes_settings", JSON.stringify(newSettings));
  };

  const kpis = summary?.kpis || [];
  const charts = summary?.charts || [];
  const datasetTitle = summary?.dataset_title;
  const totalRows = summary?.total_rows || 0;
  const files = summary?.files || [];
  const hasData = kpis.length > 0 && totalRows > 0;

  return (
    <div className="app-container">
      <Navbar 
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onClearData={handleClearData}
        loading={loading}
        hasData={hasData}
      />

      <main className="main-wrapper">
        {/* Painel Esquerdo */}
        <section className="hero-section">
          {hasData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700 }}>
                    Decisões Inteligentes • {datasetTitle}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Variáveis mapeadas • {totalRows} linhas • {summary?.columns?.length || 0} colunas
                  </p>
                </div>
                {files.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    📁 {files.join(' • ')}
                  </div>
                )}
              </div>

              {/* Grid de KPIs Dinâmicos */}
              <div className="kpi-grid">
                {kpis.map((kpi, idx) => (
                  <KPICard 
                    key={idx}
                    title={kpi.title}
                    value={kpi.value}
                    icon={idx === 0 ? Database : idx === 1 ? Activity : BarChart3}
                    color={kpi.color || "#6366f1"}
                    subtitle={kpi.subtitle}
                    badge={kpi.badge}
                  />
                ))}
              </div>

              {/* Seção de Gráficos Adaptativos com Múltiplos Tipos */}
              <div className="charts-grid">
                {charts.map((ch, idx) => (
                  <DynamicChartCard 
                    key={ch.id || idx}
                    title={ch.title}
                    items={ch.items}
                    color={ch.color || "#6366f1"}
                    defaultType={idx === 0 ? "column" : idx === 1 ? "line" : idx === 2 ? "donut" : "bar"}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyDashboard 
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}
        </section>

        {/* Painel Direito: Chat Conversacional com IA */}
        <ChatPanel 
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={chatLoading}
          suggestions={summary?.suggestions || []}
        />
      </main>

      {/* Modais */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadFiles={handleUploadFiles}
        loading={loading}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <DataPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewData={previewData}
      />
    </div>
  );
}
