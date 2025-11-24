# 🔧 Guia Completo - Resolução de Problemas IIS + Node.js + SQL Server

## 📋 Problema Identificado
- ✅ Aplicação funciona localmente com `node index.js`
- ❌ Aplicação não conecta ao SQL Server quando executada pelo IIS
- 🎯 **Causa provável**: Problemas com IISNode ou permissões

---

## 🚀 Soluções em Ordem de Prioridade

### 1. 📦 Verificar e Instalar IISNode

#### ✅ Verificar se o IISNode está instalado
```cmd
# Abrir PowerShell como Administrador
Get-WindowsFeature -Name *node*
```

#### 📥 Instalar IISNode (se não estiver instalado)
1. **Baixar IISNode**:
   - Acesse: https://github.com/Azure/iisnode/releases
   - Baixe a versão mais recente (ex: `iisnode-full-v0.2.26-x64.msi`)

2. **Instalar**:
   ```cmd
   # Execute o .msi como Administrador
   # ou via PowerShell:
   Start-Process msiexec.exe -Wait -ArgumentList '/i C:\Downloads\iisnode-full-v0.2.26-x64.msi /quiet'
   ```

3. **Verificar instalação**:
   ```cmd
   # Verificar se o módulo foi instalado
   Get-IISModule | Where-Object {$_.Name -like "*node*"}
   ```

### 2. 🔧 Configurar IIS para Node.js

#### ✅ Habilitar recursos necessários do IIS
```powershell
# Execute como Administrador
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent
Enable-WindowsOptionalFeature -Online -FeatureName IIS-DefaultDocument
```

#### ✅ Configurar Application Pool
```powershell
# Criar Application Pool específico para Node.js
Import-Module WebAdministration
New-WebAppPool -Name "NodeJSPool"
Set-ItemProperty -Path "IIS:\AppPools\NodeJSPool" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty -Path "IIS:\AppPools\NodeJSPool" -Name "enable32BitAppOnWin64" -Value $false
Set-ItemProperty -Path "IIS:\AppPools\NodeJSPool" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
```

### 3. 🔐 Configurar Permissões SQL Server

#### ⚠️ PROBLEMA PRINCIPAL: Conta de Serviço
O IIS executa aplicações com uma conta diferente da sua conta de usuário. Por isso a conexão SQL Server falha.

#### ✅ Solução 1: Usar SQL Server Authentication (RECOMENDADO)
Modifique o `db.js` para usar autenticação SQL em vez de Windows:

```javascript
// Modificar a configuração em db.js
this.config = {
  server: process.env.DB_SERVER || "UIRAPURU",
  database: process.env.DB_DATABASE || "VendasPelicano",
  user: process.env.DB_USER || "crsa",
  password: process.env.DB_PASSWORD || "cr9537",
  port: process.env.DB_PORT || 1433,
  options: {
    trustedConnection: false,  // 👈 MUDANÇA AQUI
    enableArithAbort: false,
    trustServerCertificate: true,
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    // ... resto das configurações
  }
};
```

#### ✅ Solução 2: Dar permissão à conta IIS no SQL Server
```sql
-- Execute no SQL Server Management Studio
-- Adicionar a conta IIS_IUSRS ou a conta específica do Application Pool
CREATE LOGIN [IIS_IUSRS] FROM WINDOWS;
USE [VendasPelicano];
CREATE USER [IIS_IUSRS] FOR LOGIN [IIS_IUSRS];
ALTER ROLE [db_datareader] ADD MEMBER [IIS_IUSRS];
ALTER ROLE [db_datawriter] ADD MEMBER [IIS_IUSRS];
```

### 4. 📁 Configurar Diretório da Aplicação

#### ✅ Criar Site no IIS
```powershell
# Remover site padrão (se necessário)
Remove-WebSite -Name "Default Web Site"

# Criar novo site para a aplicação
New-WebSite -Name "SqlApi" -Port 80 -PhysicalPath "c:\PROJETOS\sql_api" -ApplicationPool "NodeJSPool"
```

#### ✅ Definir permissões no diretório
```powershell
# Dar permissões ao Application Pool
$acl = Get-Acl "c:\PROJETOS\sql_api"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("IIS_IUSRS","FullControl","Allow")
$acl.SetAccessRule($accessRule)
Set-Acl "c:\PROJETOS\sql_api" $acl
```

### 5. 🔍 Testar e Diagnosticar

#### ✅ Script de teste específico para IIS