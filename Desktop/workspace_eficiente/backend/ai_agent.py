import json
import httpx
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
from data_engine import DataEngine

class AIAgent:
    def __init__(self, data_engine: DataEngine):
        self.engine = data_engine

    async def ask(self, question: str, provider: str = "auto", api_key: Optional[str] = None) -> Dict[str, Any]:
        if self.engine.df_main is None or len(self.engine.df_main) == 0:
            return {
                "answer": "⚠️ Nenhuma planilha foi carregada ainda. Por favor, envie seus dados antes de fazer perguntas.",
                "chart": None,
                "table": None
            }

        question_clean = question.lower().strip()
        profile = self.engine.get_summary_metrics()

        # Chamada a provedor externo se configurado
        if api_key and provider in ["gemini", "groq", "openrouter", "openai"]:
            try:
                llm_response = await self._call_external_llm(question, provider, api_key, profile)
                if llm_response:
                    return llm_response
            except Exception as e:
                print(f"[AI AGENT] Erro na LLM externa: {e}. Alternando para motor analítico dinâmico.")

        # Motor Analítico Dinâmico com Perfil Estrategista Sênior
        return self._dynamic_answer(question_clean, profile)

    def _dynamic_answer(self, q: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        df = self.engine.df_main
        types = profile.get("inferred_types", {})
        primary_metric = profile.get("primary_metric")
        title = profile.get("dataset_title", "Dataset")
        total_rows = profile.get("total_rows", len(df))

        # 1. Pergunta Estratégica: Diagnóstico de Gargalos e Plano de Ação para Reverter Situações Indesejadas
        is_strategic = any(w in q for w in [
            "plano de ação", "estrategista", "estratégia", "reverter", "reversão", 
            "indesejada", "gargalo", "problema", "risco", "melhorar", "prejuízo", "virada"
        ])

        if is_strategic:
            return self._build_strategic_action_plan(df, profile, primary_metric, types, title)

        # 2. Pergunta sobre resumo / principais insights executivos
        if any(w in q for w in ["insight", "resumo", "geral", "panorama", "principais", "destaque", "analise", "análise"]):
            insights = [
                f"**Volume Operacional**: A base analisada (**{title}**) consolida **{total_rows:,} registros** e **{len(df.columns)} variáveis mapeadas**.".replace(",", ".")
            ]

            if primary_metric:
                total_val = df[primary_metric].sum()
                avg_val = df[primary_metric].mean()
                max_val = df[primary_metric].max()
                insights.append(
                    f"**Métrica Central ({primary_metric})**: O acumulado alcança **R$ {total_val:,.2f}**, com média de **R$ {avg_val:,.2f}** por registro e pico de **R$ {max_val:,.2f}**.".replace(",", "X").replace(".", ",").replace("X", ".")
                )

            # Destacar concentração
            if types.get("categorical"):
                cat_col = types["categorical"][0]
                if primary_metric:
                    top_cat = df.groupby(cat_col)[primary_metric].sum().sort_values(ascending=False).head(1)
                    if not top_cat.empty:
                        cat_name = top_cat.index[0]
                        cat_val = top_cat.values[0]
                        pct = (cat_val / df[primary_metric].sum() * 100) if df[primary_metric].sum() > 0 else 0
                        insights.append(
                            f"**Polo Principal ({cat_col})**: O segmento **{cat_name}** concentra **{pct:.1f}%** do volume ({primary_metric}: R$ {cat_val:,.2f}).".replace(",", "X").replace(".", ",").replace("X", ".")
                        )

            # Visão crítica de estrategista
            insights.append(
                "💡 **Diretriz Estratégica**: Para visualizar os gargalos operacionais e o plano tático de correção 5W2H, digite ou clique em *'Plano Estratégico de Reversão de Gargalos'*."
            )

            answer = f"### 📊 Relatório Executivo de Inteligência: '{title}'\n\n" + "\n".join([f"* {i}" for i in insights])
            first_chart = profile.get("charts", [None])[0]
            return {"answer": answer, "chart": first_chart, "table": None}

        # 3. Perguntas específicas sobre colunas categóricas
        for cat_col in types.get("categorical", []):
            if cat_col.lower() in q:
                if primary_metric:
                    grouped = df.groupby(cat_col)[primary_metric].agg(['sum', 'mean', 'count']).reset_index()
                    grouped = grouped.sort_values(by='sum', ascending=False).head(10)
                    grouped.columns = [cat_col, f"Total ({primary_metric})", "Média", "Contagem"]
                    top_row = grouped.iloc[0]
                    bottom_row = grouped.iloc[-1]
                    
                    answer = f"""### 🎯 Diagnóstico Estratégico por {cat_col}

* 🏆 **Líder de Desempenho**: **{top_row[cat_col]}** com **R$ {top_row[f"Total ({primary_metric})"]:,.2f}** no acumulado (Média: R$ {top_row['Média']:,.2f}).
* ⚠️ **Gargalo / Ponto de Atenção**: **{bottom_row[cat_col]}** registra o menor volume relativo (**R$ {bottom_row[f"Total ({primary_metric})"]:,.2f}** em {bottom_row['Contagem']} registros).
* 📋 **Recomendação Tática**: Fazer benchmark dos processos do líder **{top_row[cat_col]}** e aplicar plano de nivelamento operacional sobre **{bottom_row[cat_col]}**.
""".replace(",", "X").replace(".", ",").replace("X", ".")
                    table_data = grouped.to_dict(orient='records')
                else:
                    counts = df[cat_col].value_counts().head(10).reset_index()
                    counts.columns = [cat_col, "Total"]
                    answer = f"### 📊 Frequência por {cat_col}\n\nA categoria **{counts.iloc[0][cat_col]}** é a mais frequente com **{counts.iloc[0]['Total']} ocorrências**."
                    table_data = counts.to_dict(orient='records')

                return {"answer": answer, "chart": None, "table": table_data}

        # 4. Perguntas específicas sobre colunas numéricas
        for num_col in types.get("numeric", []):
            if num_col.lower() in q:
                total_val = df[num_col].sum()
                avg_val = df[num_col].mean()
                min_val = df[num_col].min()
                max_val = df[num_col].max()
                answer = f"""### 📈 Avaliação Estratégica da Variável: {num_col}

* **Volume Acumulado**: R$ {total_val:,.2f}
* **Média por Ocorrência**: R$ {avg_val:,.2f}
* **Pico Máximo Registrado**: R$ {max_val:,.2f}
* **Piso Mínimo Registrado**: R$ {min_val:,.2f}
* 💡 **Análise de Dispersão**: A amplitude entre o piso e o teto aponta oportunidade para padronização de processos e metas intermediárias.
""".replace(",", "X").replace(".", ",").replace("X", ".")
                return {"answer": answer, "chart": None, "table": None}

        # Fallback orientado
        cols_preview = ", ".join([f"`{c}`" for c in df.columns[:8]])
        answer = f"""Entendido! Como Estrategista de Negócios, analisei a planilha **'{title}'** ({total_rows} linhas).
Variáveis mapeadas: {cols_preview}

Você pode me solicitar:
1. 🎯 **"Plano de Ação para Reverter Situações Indesejadas"** (Diagnóstico + Ações 5W2H)
2. 🔍 Análise profunda de gargalos por coluna (ex: *"{types.get('categorical', [''])[0]}"*)
3. 📊 Otimização de margem e alocação de recursos."""
        return {"answer": answer, "chart": None, "table": None}

    def _build_strategic_action_plan(self, df: pd.DataFrame, profile: Dict[str, Any], primary_metric: str, types: Dict[str, Any], title: str) -> Dict[str, Any]:
        """Gera um plano de ação estratégico executivo rigoroso para reverter situações indesejadas."""
        bottlenecks = []
        action_plan = []

        # 1. Analisar se há produtos / categorias com margem comprimida ou menor faturamento
        if types.get("categorical") and primary_metric:
            cat_col = types["categorical"][0]
            grouped = df.groupby(cat_col)[primary_metric].sum().sort_values()
            bottom_item = grouped.index[0]
            bottom_val = grouped.values[0]
            top_item = grouped.index[-1]
            top_val = grouped.values[-1]
            disparity = (top_val / bottom_val) if bottom_val > 0 else 10

            bottlenecks.append({
                "pain": f"Disparidade crítica em '{cat_col}'",
                "detail": f"O segmento '{bottom_item}' gera apenas R$ {bottom_val:,.2f}, enquanto '{top_item}' fatura R$ {top_val:,.2f} ({disparity:.1f}x mais).",
                "action": f"Revisar o mix de produtos e precificação de '{bottom_item}', aplicando as práticas de alta conversão de '{top_item}'.",
                "deadline": "30 a 60 dias",
                "kpi": f"Aumentar o volume de '{bottom_item}' em pelo menos 25% no próximo trimestre."
            })

        # 2. Analisar se existem margens negativas ou baixas se houver coluna de margem
        margin_cols = [c for c in df.columns if 'margem' in c.lower() or '%' in c]
        if margin_cols:
            m_col = margin_cols[0]
            avg_mrg = df[m_col].mean()
            low_mrg = df[df[m_col] < avg_mrg]
            if len(low_mrg) > 0:
                bottlenecks.append({
                    "pain": f"Erosão de Rentabilidade na métrica '{m_col}'",
                    "detail": f"{len(low_mrg)} registros estão operando abaixo da média ({avg_mrg:.1f}%), comprimindo o lucro líquido da empresa.",
                    "action": "Renegociar custos de aquisição junto a fornecedores ou descontinuar SKUs/serviços com margem deficitária.",
                    "deadline": "Imediato (15 a 45 dias)",
                    "kpi": f"Elevar o piso da margem para no mínimo {avg_mrg:.1f}% em toda a linha."
                })

        # 3. Analisar sazonalidade ou anomalia temporal se houver data
        date_cols = types.get("datetime", [])
        if date_cols:
            d_col = date_cols[0]
            if pd.api.types.is_datetime64_any_dtype(df[d_col]):
                df['AnoMes_Tmp'] = df[d_col].dt.to_period('M')
                if primary_metric:
                    monthly = df.groupby('AnoMes_Tmp')[primary_metric].sum()
                    if len(monthly) > 2:
                        lowest_month = monthly.idxmin()
                        lowest_val = monthly.min()
                        mean_val = monthly.mean()
                        drop_pct = ((mean_val - lowest_val) / mean_val * 100) if mean_val > 0 else 0
                        if drop_pct > 30:
                            bottlenecks.append({
                                "pain": f"Queda Anômala de Desempenho no Período {lowest_month}",
                                "detail": f"O período registrou queda brusca de {drop_pct:.1f}% em relação à média histórica (apenas R$ {lowest_val:,.2f}).",
                                "action": "Auditar processos operacionais desse período para checar fechamentos imprevistos, problemas de estoque ou falha de registro.",
                                "deadline": "Imediato (7 dias)",
                                "kpi": "Eliminar gaps de estoque e garantir contingência operacional em meses de baixa."
                            })

        # Montagem do relatório executivo do Estrategista
        ans = f"""### 🎯 PLANO ESTRATÉGICO DE REVERSÃO DE GARGALOS (CHIEF STRATEGY OFFICER)
**Alvo da Análise**: Planilha `{title}` | **Abordagem**: Diagnóstico de Riscos & Matriz de Ação 5W2H

---

#### 🚨 1. Diagnóstico de Situações Indesejadas & Pontos Críticos
"""
        for idx, b in enumerate(bottlenecks, 1):
            ans += f"""
**Gargalo #{idx}: {b['pain']}**
* **Impacto Detectado**: {b['detail']}
* **Risco Corporativo**: Perda de rentabilidade, dependência excessiva de poucos canais e subutilização da base.
"""

        ans += """
---

#### 📋 2. Matriz de Ações Corretivas para Reversão (Plano de Ação Tático)

| Gargalo Prioritário | Ação Corretiva Recomendada | Prazo de Execução | Meta / KPI de Sucesso |
| :--- | :--- | :--- | :--- |
"""
        for b in bottlenecks:
            ans += f"| **{b['pain']}** | {b['action']} | {b['deadline']} | **{b['kpi']}** |\n"

        ans += """
---

#### 🚀 3. Roteiro de Execução Rápida (Next Steps nos Próximos 14 Dias)
1. **Semana 1 (Alinhamento & Contenção)**: Apresentar estes indicadores à liderança e estancar as concessões de descontos em itens com margem comprimida.
2. **Semana 2 (Operacionalização)**: Ativar campanhas promocionais de *cross-selling* com produtos/serviços de alta margem para alavancar o ticket médio.
3. **Semana 3 em diante (Monitoramento)**: Realizar checagens semanais no painel para validar a recuperação da curva.
"""
        return {"answer": ans.replace(",", "X").replace(".", ",").replace("X", "."), "chart": None, "table": None}

    async def _call_external_llm(self, question: str, provider: str, api_key: str, profile: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        system_prompt = f"""Você é um Estrategista Corporativo Chefe (Chief Strategy Officer e Sênior Partner da McKinsey/BCG).
Sua missão NÃO é apenas descrever números passivos. Você deve AGIR COMO UM VERDADEIRO ESTRATEGISTA:
1. Analise criticamente os dados e encontre PROATIVAMENTE situações indesejadas, vulnerabilidades, gargalos, perda de rentabilidade ou ineficiências.
2. Formule PLANOS DE AÇÃO CORRETIVOS práticos (metodologia 5W2H / OKR) para reverter imediatamente qualquer cenário negativo.
3. Estruture suas respostas sempre em português do Brasil com:
   - 🚨 Diagnóstico Estratégico de Riscos e Gargalos
   - 🎯 Metas Claras de Virada
   - 📋 Matriz de Ações Práticas (O que fazer, Prazo e Impacto)
   - 📈 KPIs de Monitoramento

Dados reais consolidados da planilha atual:
{json.dumps(profile, ensure_ascii=False, indent=1)}
"""

        if provider == "gemini":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\nConsulta Estratégica do Usuário: {question}"}]}
                ]
            }
            async with httpx.AsyncClient(timeout=25.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
                    return {"answer": text, "chart": None, "table": None}

        elif provider == "groq":
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ]
            }
            async with httpx.AsyncClient(timeout=25.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    text = resp.json()["choices"][0]["message"]["content"]
                    return {"answer": text, "chart": None, "table": None}

        return None
