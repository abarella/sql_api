# 🔧 SOLUÇÃO PARA ERRO DE POLÍTICA DE EXECUÇÃO POWERSHELL

## ❌ **ERRO ENCONTRADO:**
```
O arquivo setup-iis.ps1 não pode ser carregado porque a execução de scripts foi desabilitada neste sistema.
```

## ✅ **SOLUÇÕES (ESCOLHA UMA):**

### 🚀 **SOLUÇÃO 1: Use o arquivo .BAT (RECOMENDADO)**
Execute o script .BAT que não requer mudanças de política:

```cmd
# 1. Abra CMD como Administrador
# 2. Navegue para o diretório
cd c:\PROJETOS\sql_api

# 3. Execute o script .BAT
setup-iis.bat
```

### 🔧 **SOLUÇÃO 2: Permitir execução temporária (SEGURO)**
```powershell
# Execute APENAS o script específico (mais seguro)
PowerShell -ExecutionPolicy Bypass -File "c:\PROJETOS\sql_api\setup-iis.ps1"
```

### ⚙️ **SOLUÇÃO 3: Alterar política temporariamente**
```powershell
# 1. Abra PowerShell como Administrador
# 2. Permitir execução temporária
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Execute o script
.\setup-iis.ps1

# 4. Restaurar política original (IMPORTANTE!)
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```

### 🔒 **SOLUÇÃO 4: Verificar política atual**
```powershell
# Ver política atual
Get-ExecutionPolicy -List

# Política recomendada para desenvolvimento
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎯 **RECOMENDAÇÃO:**

**Use a SOLUÇÃO 1** - Execute o arquivo `setup-iis.bat` que acabei de criar. Ele faz a mesma configuração sem precisar alterar políticas de segurança do PowerShell.

### **Como executar:**
1. **Abra CMD como Administrador** (não PowerShell)
2. **Navegue para o diretório:**
   ```cmd
   cd c:\PROJETOS\sql_api
   ```
3. **Execute:**
   ```cmd
   setup-iis.bat
   ```

---

## 📋 **DEPOIS DA CONFIGURAÇÃO:**

Independente da solução escolhida, após executar a configuração:

1. **Instale o IISNode** (obrigatório):
   - Baixe: https://github.com/Azure/iisnode/releases
   - Execute como Administrador

2. **Teste a conectividade:**
   ```bash
   node iis-test.js
   ```

3. **Configure o IIS manualmente** usando o Gerenciador do IIS

---

## ⚡ **COMANDOS RÁPIDOS:**

```cmd
# Abrir CMD como Admin e executar tudo de uma vez:
cd c:\PROJETOS\sql_api && setup-iis.bat && node iis-test.js
```

---

**✅ Use o arquivo .BAT para evitar problemas de política!**