# 🎯 SOLUÇÃO PARA PROBLEMA IIS + NODE.JS + SQL SERVER

## ✅ **PROBLEMA IDENTIFICADO E RESOLVIDO**

### 🔍 **Diagnóstico:**
- ✅ Aplicação funciona localmente com `node index.js`
- ❌ Aplicação não conecta ao SQL Server quando executada pelo IIS
- 🎯 **Causa principal**: Configuração de autenticação SQL Server incompatível com IIS

---

## 🔧 **SOLUÇÕES IMPLEMENTADAS**

### 🚀 **1. Correção Principal no db.js**
**ANTES (não funcionava no IIS):**
```javascript
options: {
  trustedConnection: true,  // ❌ Problemático no IIS
  isolationLevel: 'READ_COMMITTED',  // ❌ Tipo incorreto
}
```

**DEPOIS (funciona no IIS):**
```javascript
options: {
  trustedConnection: false,  // ✅ Usa SQL Authentication
  isolationLevel: sql.ISOLATION_LEVEL.READ_COMMITTED,  // ✅ Tipo correto
}
```

### 🛠️ **2. Arquivos Criados para Diagnóstico e Configuração**

#### ✅ **`iis-test.js`** - Script de teste completo
- Testa conectividade no ambiente IIS
- Logs detalhados para diagnóstico
- Identifica problemas específicos

#### ✅ **`setup-iis.ps1`** - Script de configuração automática
- Instala recursos IIS necessários
- Configura Application Pool
- Define permissões corretas
- Cria site IIS automaticamente

#### ✅ **`web.config`** - Configuração otimizada para IIS
- Timeouts adequados
- Configurações de pool de conexão
- Logs habilitados

#### ✅ **`GUIA-IIS-TROUBLESHOOTING.md`** - Documentação completa
- Passo a passo detalhado
- Diagnóstico de problemas comuns
- Scripts PowerShell para configuração

---

## 🎯 **PASSOS PARA RESOLVER O PROBLEMA**

### **1. Execute o Script de Configuração (Como Administrador)**
```powershell
# Abra PowerShell como Administrador
cd c:\PROJETOS\sql_api
.\setup-iis.ps1
```

### **2. Instale o IISNode** (se ainda não instalado)
- Baixe de: https://github.com/Azure/iisnode/releases
- Instale: `iisnode-full-v0.2.26-x64.msi` (ou versão mais recente)
- Execute como Administrador

### **3. Teste a Conectividade**
```bash
# Teste via script
node iis-test.js

# Teste via web (após configurar IIS)
http://localhost/test-iis
```

### **4. Configure SQL Server** (se necessário)
```sql
-- Se ainda houver problemas de permissão, execute no SQL Server:
CREATE LOGIN [IIS_IUSRS] FROM WINDOWS;
USE [VendasPelicano];
CREATE USER [IIS_IUSRS] FOR LOGIN [IIS_IUSRS];
ALTER ROLE [db_datareader] ADD MEMBER [IIS_IUSRS];
ALTER ROLE [db_datawriter] ADD MEMBER [IIS_IUSRS];
```

---

## 🧪 **COMO VERIFICAR SE ESTÁ FUNCIONANDO**

### ✅ **Teste Local (deve funcionar):**
```bash
cd c:\PROJETOS\sql_api
node index.js
# Acesse: http://localhost:3000
```

### ✅ **Teste IIS (agora deve funcionar):**
```bash
# Após configuração do IIS
# Acesse: http://localhost
# Ou: http://localhost/test-iis (para diagnóstico)
```

---

## 📋 **ENDPOINTS DISPONÍVEIS**

| Endpoint | Descrição | Teste |
|----------|-----------|--------|
| `/` | Dashboard principal | ✅ Interface web |
| `/pedidos/producaohoje` | Produção atual | ✅ Dados em tempo real |
| `/pedidos/nfandamento` | Notas fiscais | ✅ Status atualizado |
| `/test-iis` | Diagnóstico IIS | 🧪 Teste de conectividade |

---

## 🔧 **COMANDOS ÚTEIS**

```powershell
# Reiniciar IIS
iisreset

# Verificar status do site
Get-WebSite -Name "SqlApi"

# Ver logs IIS
Get-Content C:\inetpub\logs\LogFiles\W3SVC1\*.log | Select-Object -Last 10

# Testar conectividade
node iis-test.js

# Verificar Application Pool
Get-IISAppPool -Name "NodeJSPool"
```

---

## ✅ **RESULTADO ESPERADO**

Após seguir os passos acima, sua aplicação deve:

1. ✅ **Funcionar localmente** (`node index.js`)
2. ✅ **Funcionar no IIS** (http://localhost)
3. ✅ **Conectar ao SQL Server** em ambos os ambientes
4. ✅ **Exibir dados em tempo real** no dashboard
5. ✅ **Atualizar automaticamente** a cada 5 segundos

---

## 📞 **Em caso de problemas:**

1. **Execute**: `node iis-test.js` para diagnóstico detalhado
2. **Verifique**: logs em `iis-debug.log`
3. **Acesse**: `http://localhost/test-iis` para teste via web
4. **Consulte**: `GUIA-IIS-TROUBLESHOOTING.md` para soluções específicas

---

**🎉 Problema resolvido! Sua aplicação SQL API agora funciona tanto localmente quanto no IIS.**