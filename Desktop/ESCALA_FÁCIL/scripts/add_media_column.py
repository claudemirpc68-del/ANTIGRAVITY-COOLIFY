import os
import sys
from dotenv import load_dotenv

# Adiciona o diretório raiz ao path para importar o cliente do Supabase
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import get_supabase

def migrate():
    print("🚀 Iniciando migração do banco de dados (Adicionando coluna 'media_url')...")
    supabase = get_supabase()
    
    # Nota: O cliente PostgREST (usado pelo SDK do Supabase) não suporta comandos ALTER TABLE diretamente 
    # através da interface de tabela. Geralmente usamos o SQL Editor do Supabase ou o comando RPC.
    # Como não temos um RPC de SQL genérico, tentaremos inserir um registro com a nova coluna.
    # Se falhar porque a coluna não existe, avisaremos o usuário.
    
    try:
        # Tenta disparar um erro controlado ou verificar a existência 
        # No Supabase, a melhor forma de rodar SQL arbitrário é via SQL Editor no Dashboard.
        # Mas para automação, podemos tentar o RPC se estiver configurado.
        
        print("⚠️  Atenção: A adição de colunas via SDK é restrita se não houver um RPC de SQL.")
        print("👉 Por favor, execute o seguinte comando no SQL Editor do Supabase:")
        print("\n   ALTER TABLE solicitacoes ADD COLUMN IF NOT EXISTS media_url TEXT;\n")
        
        # Teste de inserção para ver se já existe
        res = supabase.table("solicitacoes").insert({
            "matricula": "TESTE",
            "nome": "TESTE",
            "tipo": "TESTE",
            "texto": "TESTE",
            "media_url": "http://teste.com",
            "status": "TESTE"
        }).execute()
        
        print("✅ Coluna 'media_url' detectada e funcional!")
        
        # Limpa o teste
        supabase.table("solicitacoes").delete().eq("status", "TESTE").execute()
        
    except Exception as e:
        if "column \"media_url\" of relation \"solicitacoes\" does not exist" in str(e):
            print("❌ Erro: A coluna 'media_url' ainda não existe no banco de dados.")
        else:
            print(f"❌ Erro inesperado: {e}")

if __name__ == "__main__":
    load_dotenv()
    migrate()
