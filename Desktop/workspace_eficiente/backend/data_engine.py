import os
import glob
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List

class DataEngine:
    def __init__(self):
        self.tables: Dict[str, pd.DataFrame] = {}
        self.df_main: Optional[pd.DataFrame] = None
        self.status: str = "unloaded"
        self.loaded_files: List[str] = []
        self.dataset_title: str = ""
        self.profile: Dict[str, Any] = {
            "status": "empty",
            "message": "Nenhuma planilha carregada.",
            "dataset_title": "",
            "files": [],
            "total_rows": 0,
            "columns": [],
            "kpis": [],
            "charts": [],
            "suggestions": []
        }

    def clear(self):
        self.tables = {}
        self.df_main = None
        self.status = "unloaded"
        self.loaded_files = []
        self.dataset_title = ""
        self.profile = {
            "status": "empty",
            "message": "Nenhuma planilha carregada.",
            "dataset_title": "",
            "files": [],
            "total_rows": 0,
            "columns": [],
            "kpis": [],
            "charts": [],
            "suggestions": []
        }

    def _infer_column_types(self, df: pd.DataFrame) -> Dict[str, List[str]]:
        numeric_cols = []
        categorical_cols = []
        datetime_cols = []
        id_cols = []

        for col in df.columns:
            col_lower = str(col).lower()
            series = df[col]

            # Detectar IDs
            if any(term in col_lower for term in ['id', 'código', 'codigo', 'sku', 'cpf', 'cnpj', 'matricula']) and series.nunique() > 0.6 * len(df):
                id_cols.append(col)
                continue

            # Detectar Datas
            if pd.api.types.is_datetime64_any_dtype(series):
                datetime_cols.append(col)
                continue
            elif 'data' in col_lower or 'dia' in col_lower or 'date' in col_lower:
                try:
                    converted = pd.to_datetime(series, errors='coerce')
                    if converted.notnull().sum() > 0.5 * len(df):
                        df[col] = converted
                        datetime_cols.append(col)
                        continue
                except:
                    pass

            # Detectar Numéricos
            if pd.api.types.is_numeric_dtype(series):
                # Se tiver muitos valores únicos ou flutuantes, é métrica
                if series.nunique() > 10 or pd.api.types.is_float_dtype(series):
                    numeric_cols.append(col)
                else:
                    # Poucos valores inteiros podem ser categorias (ex: tipo 1, 2, 3)
                    categorical_cols.append(col)
            else:
                # Textuais
                if series.nunique() <= 500:
                    categorical_cols.append(col)

        return {
            "numeric": numeric_cols,
            "categorical": categorical_cols,
            "datetime": datetime_cols,
            "id": id_cols
        }

    def _auto_consolidate(self):
        if not self.tables:
            return

        # Se houver apenas uma tabela
        if len(self.tables) == 1:
            name = list(self.tables.keys())[0]
            self.df_main = self.tables[name].copy()
            self.dataset_title = name.replace(".xlsx", "").replace(".csv", "")
            return

        # Se houver múltiplas tabelas, procurar relacionamentos
        # Tenta identificar tabela de fatos/transações (com mais linhas ou nome 'vendas', 'transacoes', 'pedidos', etc.)
        fact_table_name = None
        max_rows = -1
        for name, t in self.tables.items():
            lower = name.lower()
            if any(term in lower for term in ['venda', 'fato', 'transac', 'pedido', 'order', 'item', 'registro']):
                fact_table_name = name
                break
            if len(t) > max_rows:
                max_rows = len(t)
                fact_table_name = name

        df = self.tables[fact_table_name].copy()
        self.dataset_title = fact_table_name.replace(".xlsx", "").replace(".csv", "")

        # Tentar fazer merge com as outras tabelas através de colunas com mesmo nome ou nomes similares
        for name, other_df in self.tables.items():
            if name == fact_table_name:
                continue
            
            # Encontrar colunas de interseção direta
            common_cols = [c for c in df.columns if c in other_df.columns]
            if common_cols:
                key = common_cols[0]
                df = df.merge(other_df, on=key, how='left')
            else:
                # Tentar correspondência parcial (ex: 'Cliente' e 'Código do Cliente')
                merged = False
                for c1 in df.columns:
                    for c2 in other_df.columns:
                        c1_l, c2_l = c1.lower(), c2.lower()
                        if (c1_l in c2_l or c2_l in c1_l) and ('id' in c1_l or 'cliente' in c1_l or 'produto' in c1_l or 'sku' in c1_l):
                            df = df.merge(other_df, left_on=c1, right_on=c2, how='left')
                            merged = True
                            break
                    if merged:
                        break

        # Se tiver cálculo de multiplicação comum (Quantidade * Valor de venda)
        cols_lower = {str(c).lower(): c for c in df.columns}
        if 'quantidade' in cols_lower and 'valor de venda' in cols_lower and 'faturamento' not in cols_lower:
            df['Faturamento'] = df[cols_lower['quantidade']] * df[cols_lower['valor de venda']]
        if 'quantidade' in cols_lower and 'custo de compra' in cols_lower and 'custo total' not in cols_lower:
            df['Custo Total'] = df[cols_lower['quantidade']] * df[cols_lower['custo de compra']]
        if 'Faturamento' in df.columns and 'Custo Total' in df.columns:
            df['Lucro Bruto'] = df['Faturamento'] - df['Custo Total']
            df['Margem (%)'] = np.where(df['Faturamento'] > 0, (df['Lucro Bruto'] / df['Faturamento']) * 100, 0.0)

        self.df_main = df

    def _generate_profile(self):
        if self.df_main is None or len(self.df_main) == 0:
            self.profile = {}
            return

        df = self.df_main
        types = self._infer_column_types(df)
        total_rows = len(df)

        # Escolher a métrica numérica principal (prioridade para colunas de valor monetário, faturamento, salário, etc.)
        primary_metric = None
        for col in types["numeric"]:
            c_low = col.lower()
            if any(term in c_low for term in ['faturamento', 'valor', 'lucro', 'salario', 'preco', 'preço', 'total', 'receita', 'saldo']):
                primary_metric = col
                break
        if not primary_metric and types["numeric"]:
            primary_metric = types["numeric"][0]

        # Gerar KPIs Dinâmicos
        kpis = [
            {
                "title": "Total de Registros",
                "value": f"{total_rows:,}".replace(",", "."),
                "subtitle": f"{len(df.columns)} colunas detectadas",
                "badge": "Base Completa",
                "color": "#6366f1"
            }
        ]

        if primary_metric:
            total_val = df[primary_metric].sum()
            avg_val = df[primary_metric].mean()
            kpis.append({
                "title": f"Total: {primary_metric}",
                "value": f"R$ {total_val:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
                "subtitle": "Volume acumulado",
                "badge": "Principal",
                "color": "#10b981"
            })
            kpis.append({
                "title": f"Média de {primary_metric}",
                "value": f"R$ {avg_val:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
                "subtitle": f"Por registro",
                "badge": "Média",
                "color": "#06b6d4"
            })

        # Métrica secundária (ex: Lucro, Quantidade, Margem, Nota, etc.)
        secondary_metrics = [c for c in types["numeric"] if c != primary_metric]
        for sec in secondary_metrics[:2]:
            sec_low = sec.lower()
            val = df[sec].sum()
            is_pct = '%' in sec or 'margem' in sec_low or 'taxa' in sec_low
            formatted = f"{df[sec].mean():.1f}%" if is_pct else f"{val:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
            kpis.append({
                "title": sec,
                "value": formatted,
                "subtitle": "Média" if is_pct else "Acumulado",
                "badge": "Destaque",
                "color": "#f59e0b" if is_pct else "#ec4899"
            })

        # Gerar Gráficos Dinâmicos (Para as principais dimensões categóricas)
        charts = []
        colors = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#ec4899"]
        
        for idx, cat_col in enumerate(types["categorical"][:4]):
            color = colors[idx % len(colors)]
            if primary_metric:
                grouped = df.groupby(cat_col)[primary_metric].sum().reset_index()
                grouped = grouped.sort_values(by=primary_metric, ascending=False).head(8)
                items = [
                    {
                        "label": str(row[cat_col]),
                        "value": float(row[primary_metric]),
                        "formatted": f"R$ {row[primary_metric]:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                    }
                    for _, row in grouped.iterrows()
                ]
                title = f"{primary_metric} por {cat_col}"
            else:
                # Contagem de registros por categoria
                counts = df[cat_col].value_counts().head(8).reset_index()
                counts.columns = [cat_col, "Qtd"]
                items = [
                    {
                        "label": str(row[cat_col]),
                        "value": int(row["Qtd"]),
                        "formatted": f"{row['Qtd']} itens"
                    }
                    for _, row in counts.iterrows()
                ]
                title = f"Ocorrências por {cat_col}"

            charts.append({
                "id": f"chart_{idx}",
                "title": title,
                "items": items,
                "color": color
            })

        # Sugestões dinâmicas de perguntas para o Chat baseadas nas colunas reais da planilha
        suggestions = ["Quais os principais insights desta planilha?"]
        if types["categorical"]:
            suggestions.append(f"Qual a distribuição por {types['categorical'][0]}?")
        if len(types["categorical"]) > 1:
            suggestions.append(f"Qual categoria de {types['categorical'][1]} tem melhor desempenho?")
        if primary_metric:
            suggestions.append(f"Quais os maiores valores de {primary_metric}?")
        if len(types["numeric"]) > 1:
            suggestions.append(f"Qual a média de {types['numeric'][1]}?")

        self.profile = {
            "status": "ready",
            "dataset_title": self.dataset_title,
            "files": self.loaded_files,
            "total_rows": total_rows,
            "columns": list(df.columns),
            "inferred_types": types,
            "primary_metric": primary_metric,
            "kpis": kpis[:5],
            "charts": charts,
            "suggestions": suggestions
        }

    def load_from_folder(self, folder_path: str) -> Dict[str, Any]:
        if not os.path.exists(folder_path):
            raise FileNotFoundError(f"Diretório não encontrado: {folder_path}")

        files = glob.glob(os.path.join(folder_path, "*.xlsx")) + glob.glob(os.path.join(folder_path, "*.csv"))
        self.loaded_files = [os.path.basename(f) for f in files]
        self.tables = {}

        for file_path in files:
            fname = os.path.basename(file_path)
            if file_path.endswith(".xlsx"):
                df = pd.read_excel(file_path)
            else:
                df = pd.read_csv(file_path)
            df.columns = [str(c).strip() for c in df.columns]
            self.tables[fname] = df

        self._auto_consolidate()
        self._generate_profile()
        self.status = "loaded"
        return self.get_summary_metrics()

    def load_uploaded_files(self, files_data: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        self.loaded_files = list(files_data.keys())
        self.tables = {}
        for name, df in files_data.items():
            df.columns = [str(c).strip() for c in df.columns]
            self.tables[name] = df

        self._auto_consolidate()
        self._generate_profile()
        self.status = "loaded"
        return self.get_summary_metrics()

    def get_summary_metrics(self) -> Dict[str, Any]:
        if not self.profile:
            self._generate_profile()
        return self.profile

    def get_preview_data(self) -> Dict[str, Any]:
        previews = {}
        for name, df in self.tables.items():
            clean_name = name.replace(".xlsx", "").replace(".csv", "")
            previews[clean_name] = df.head(10).fillna("").to_dict(orient='records')
        return previews
