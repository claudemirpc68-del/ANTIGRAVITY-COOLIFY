import os
import io
import pandas as pd
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_engine import DataEngine
from ai_agent import AIAgent

app = FastAPI(title="Data Insights AI Agent API", version="1.0.0")

# Enable CORS for React frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = DataEngine()
agent = AIAgent(engine)

DEFAULT_LOCAL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Dados e Insights"))
# O dashboard agora inicia sempre limpo aguardando novas planilhas conforme solicitado pelo usuário!

class ChatRequest(BaseModel):
    question: str
    provider: Optional[str] = "auto"
    api_key: Optional[str] = None

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "data_status": engine.status,
        "loaded_files": engine.loaded_files,
        "records_count": len(engine.df_main) if engine.df_main is not None else 0
    }

@app.post("/api/load-local")
def load_local():
    if not os.path.exists(DEFAULT_LOCAL_PATH):
        raise HTTPException(status_code=404, detail=f"Pasta não encontrada: {DEFAULT_LOCAL_PATH}")
    try:
        summary = engine.load_from_folder(DEFAULT_LOCAL_PATH)
        return {"message": "Planilhas locais carregadas com sucesso!", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/clear")
def clear_data():
    engine.clear()
    return {"message": "Dashboard limpo com sucesso! Aguardando novas planilhas.", "summary": engine.get_summary_metrics()}

@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo enviado.")

    files_data = {}
    for file in files:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail=f"O arquivo '{file.filename}' está vazio (0 bytes). Se ele estiver aberto no Excel, salve e feche-o antes de enviar.")

        filename = file.filename.lower()
        try:
            if filename.endswith(".xlsx") or filename.endswith(".xls") or not "." in filename:
                try:
                    excel_file = pd.ExcelFile(io.BytesIO(contents))
                    for sheet in excel_file.sheet_names:
                        df = excel_file.parse(sheet)
                        if not df.empty and len(df.columns) > 0:
                            sheet_name = f"{file.filename} ({sheet})" if len(excel_file.sheet_names) > 1 else file.filename
                            files_data[sheet_name] = df
                except Exception as ex_excel:
                    if not "." in filename:
                        # Tenta como CSV
                        df = pd.read_csv(io.BytesIO(contents), sep=None, engine='python')
                        files_data[file.filename] = df
                    else:
                        raise ex_excel
            elif filename.endswith(".csv"):
                # Suporta delimitador vírgula ou ponto-e-vírgula do Excel brasileiro
                try:
                    df = pd.read_csv(io.BytesIO(contents), sep=None, engine='python')
                except:
                    df = pd.read_csv(io.BytesIO(contents), sep=';')
                files_data[file.filename] = df
            else:
                continue
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao ler '{file.filename}': {str(e)}")

    if not files_data:
        raise HTTPException(status_code=400, detail="Nenhum arquivo Excel ou CSV com dados válidos pôde ser processado.")

    summary = engine.load_uploaded_files(files_data)
    return {"message": f"{len(files_data)} tabela(s) processada(s) com sucesso!", "summary": summary}

@app.get("/api/insights/summary")
def get_insights_summary():
    return engine.get_summary_metrics()

@app.get("/api/data/preview")
def get_preview():
    return engine.get_preview_data()

@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not req.question:
        raise HTTPException(status_code=400, detail="A pergunta não pode estar vazia.")
    res = await agent.ask(req.question, provider=req.provider or "auto", api_key=req.api_key)
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
