# Solução Twilio - Caminhos Longos no Windows

## Problema
Erro ao instalar twilio: `No such file or directory` devido a caminhos longos no Windows.

## Solução Implementada

### 1. Instalar twilio em diretório curto (sem dependências)
```bash
pip install twilio==7.9.0 --no-deps --target="C:\twilio_lib"
```

### 2. Adicionar no início do server.py
```python
import platform
if platform.system() == "Windows":
    TWILIO_LIB_PATH = r"C:\twilio_lib"
    if TWILIO_LIB_PATH not in sys.path:
        sys.path.insert(0, TWILIO_LIB_PATH)
```

**Nota:** Esse ajuste só é necessário no Windows. No Coolify (Linux) funciona normalmente.

### 3. Iniciar servidor
```bash
python server.py
```

## Alternativa (futuro)
Habilitar Long Paths no Windows via registro:
- Chave: `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`
- Valor: `LongPathsEnabled` = 1 (DWORD)

---

## URLs de Produção
- **Bot ASAI**: https://assai-bot.72.61.130.70.sslip.io
