# Guia de Instalação no IIS (Internet Information Services)

Este guia detalha o processo completo para instalar e configurar a aplicação SQL API no IIS do Windows Server.

## 🚀 Resumo Rápido (Para Experientes)

```powershell
# 1. Instalar Node.js (https://nodejs.org)
node --version

# 2. Instalar iisnode (https://github.com/Azure/iisnode/releases)
# Executar: iisnode-full-v0.2.26-x64.msi

# 3. Reiniciar IIS
iisreset

# 4. Copiar arquivos para C:\inetpub\wwwroot\sql_api

# 5. Instalar dependências
cd C:\inetpub\wwwroot\sql_api
npm install

# 6. Criar Application Pool no IIS (sem .NET CLR)

# 7. Criar Website/Application apontando para a pasta

# 8. Criar web.config (veja seção completa abaixo)

# 9. Configurar permissões
icacls "C:\inetpub\wwwroot\sql_api" /grant "IIS AppPool\SqlApiPool:(OI)(CI)F" /T

# 10. Testar: http://localhost
```

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação do Node.js](#instalação-do-nodejs)
3. [Instalação do IIS](#instalação-do-iis)
4. [Instalação do iisnode](#instalação-do-iisnode)
5. [Configuração da Aplicação](#configuração-da-aplicação)
6. [Configuração do IIS](#configuração-do-iis)
7. [Configuração do web.config](#configuração-do-webconfig)
8. [Teste e Verificação](#teste-e-verificação)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Windows Server 2012 R2 ou superior (ou Windows 10/11 Pro)
- ✅ Permissões de administrador
- ✅ Acesso ao SQL Server
- ✅ Conexão com a internet (para downloads iniciais)

---

## 📥 Instalação do Node.js

### Passo 1: Download do Node.js

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS (Long Term Support)** - recomendado: v18.x ou superior
3. **Importante**: Escolha a versão de 64-bit para Windows

### Passo 2: Instalação

1. Execute o instalador `node-vXX.X.X-x64.msi`
2. Siga o assistente de instalação:
   - ✅ Aceite os termos de licença
   - ✅ Mantenha o caminho padrão: `C:\Program Files\nodejs\`
   - ✅ **IMPORTANTE**: Marque "Add to PATH"
   - ✅ Marque "Install necessary tools" (se disponível)

### Passo 3: Verificação

Abra o PowerShell como Administrador e execute:

```powershell
node --version
npm --version
```

**Resultado esperado:**
```
v18.x.x
9.x.x
```

---

## 🌐 Instalação do IIS

### Passo 1: Habilitar IIS no Windows Server

1. Abra o **Server Manager**
2. Clique em **Add roles and features**
3. Navegue até **Server Roles**
4. Marque **Web Server (IIS)**
5. Na seção **Role Services**, certifique-se de marcar:
   - ✅ Common HTTP Features
     - ✅ Default Document
     - ✅ Directory Browsing
     - ✅ HTTP Errors
     - ✅ Static Content
   - ✅ Health and Diagnostics
     - ✅ HTTP Logging
     - ✅ Logging Tools
     - ✅ Request Monitor
   - ✅ Performance
     - ✅ Static Content Compression
   - ✅ Security
     - ✅ Request Filtering
   - ✅ Application Development
     - ✅ **WebSocket Protocol** (importante!)
6. Clique em **Install**

### Passo 2: Habilitar IIS no Windows 10/11 (Desktop)

1. Abra **Painel de Controle** → **Programas** → **Ativar ou desativar recursos do Windows**
2. Marque **Internet Information Services**
3. Expanda e marque os mesmos itens listados acima
4. Clique em **OK**

### Passo 3: Verificação

1. Abra o navegador
2. Acesse: `http://localhost`
3. Deve aparecer a página padrão do IIS

---

## 📦 Instalação do iisnode

O **iisnode** é um módulo nativo que permite hospedar aplicações Node.js no IIS.

### Passo 1: Download

1. Acesse: https://github.com/Azure/iisnode/releases
2. Baixe a versão mais recente (recomendado: v0.2.26 ou superior):
   - **Para 64-bit** (mais comum): `iisnode-full-v0.2.26-x64.msi`
   - Para 32-bit: `iisnode-full-v0.2.26-x86.msi`

**Como descobrir se seu Windows é 32 ou 64 bits**:
```powershell
# Execute no PowerShell
(Get-WmiObject Win32_OperatingSystem).OSArchitecture
# Resultado: "64-bit" ou "32-bit"
```

### Passo 2: Instalação

1. **Execute o instalador** `iisnode-full-vX.X.XX-x64.msi` como Administrador:
   - Clique com botão direito no arquivo
   - Selecione **Executar como administrador**

2. **Siga o assistente de instalação**:
   - Clique em **Next**
   - Aceite os termos de licença
   - Escolha o tipo de instalação: **Complete** (recomendado)
   - Clique em **Install**
   - Aguarde a instalação (pode levar 1-2 minutos)
   - Clique em **Finish**

3. **Reinicie o IIS** (IMPORTANTE!):

```powershell
# Abra PowerShell como Administrador e execute:
iisreset /restart

# Ou reinicie os serviços individualmente:
net stop was /y
net start w3svc
```

4. **Verifique os arquivos instalados**:

```powershell
# Verificar instalação
dir "C:\Program Files\iisnode\"

# Deve listar:
# - iisnode.dll
# - iisnode-express.bat
# - interceptor.js
# E outros arquivos
```

**Observação**: Se o instalador falhar, verifique:
- Se o IIS está instalado e funcionando
- Se você tem permissões de administrador
- Se não há processos do IIS travados (use `iisreset /stop` antes de instalar)

### Passo 3: Verificação

Verifique se o módulo foi instalado:

1. **Abra o IIS Manager**:
   - Pressione `Windows + R`
   - Digite: `inetmgr`
   - Pressione Enter

2. **Navegue até Handler Mappings**:
   - No painel esquerdo (**Conexões**), clique no nome do servidor (ex: `1573978 (IP\gds-alberto.barella)`)
   - No painel central, role para baixo e clique duas vezes em **Handler Mappings** (Mapeamentos de Manipulador)

3. **Verifique a entrada do iisnode**:
   - Na lista de handlers, procure por uma entrada chamada **`iisnode`**
   - Deve ter as seguintes características:
     - **Nome**: `iisnode`
     - **Caminho** (Path): `*.js`
     - **Estado** (State): `Habilitado` (Enabled)
     - **Módulo**: `iisnode`
   
4. **Se NÃO encontrar a entrada**, adicione manualmente:
   - No painel direito (**Ações**), clique em **Adicionar Mapeamento de Módulo...**
   - Preencha os campos:
     - **Caminho de solicitação**: `*.js`
     - **Módulo**: Selecione `iisnode` no dropdown (deve aparecer se instalado corretamente)
     - **Executável**: deixe em branco
     - **Nome**: `iisnode`
   - Clique em **Solicitar Restrições...**:
     - Desmarque **Invocar manipulador apenas se a solicitação for mapeada para**
   - Clique em **OK**
   - Clique em **OK** novamente

5. **Verificação final**:
   ```powershell
   # Verificar se iisnode.dll existe
   Test-Path "C:\Program Files\iisnode\iisnode.dll"
   # Deve retornar: True
   ```

**Nota importante**: Se a entrada `iisnode` não aparecer no dropdown do Módulo, significa que o iisnode não foi instalado corretamente. Repita o Passo 2 (Instalação) ou baixe novamente o instalador.

---

## ⚙️ Configuração da Aplicação

### Passo 1: Criar diretório da aplicação

```powershell
# Criar diretório no IIS
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\sql_api"
```

### Passo 2: Copiar arquivos da aplicação

Copie todos os arquivos do projeto para `C:\inetpub\wwwroot\sql_api\`:

```
C:\inetpub\wwwroot\sql_api\
├── index.js
├── db.js
├── package.json
├── routes/
│   └── Pedidos.js
├── public/
│   ├── index.html
│   └── style.css
└── node_modules/ (será criado)
```

### Passo 3: Instalar dependências

```powershell
cd C:\inetpub\wwwroot\sql_api
npm install
```

### Passo 4: Configurar banco de dados

Edite o arquivo `db.js` com as credenciais corretas:

```javascript
this.config = {
  server: "SEU_SERVIDOR_SQL",
  database: "SUA_BASE_DE_DADOS",
  user: "SEU_USUARIO",
  password: "SUA_SENHA",
  options: {
    trustedConnection: false,  // Se usar autenticação SQL
    enableArithAbort: false,
    trustServerCertificate: true,
  },
};
```

---

## 🔧 Configuração do IIS

### Passo 1: Criar Application Pool

1. Abra **IIS Manager** (`inetmgr`)
2. Expanda o servidor
3. Clique com botão direito em **Application Pools** → **Add Application Pool**
4. Configure:
   - **Name**: `SqlApiPool`
   - **.NET CLR version**: **No Managed Code**
   - **Managed pipeline mode**: `Integrated`
5. Clique em **OK**

### Passo 2: Configurar Application Pool

1. Selecione `SqlApiPool`
2. Clique em **Advanced Settings** (painel direito)
3. Configure:
   - **Start Mode**: `AlwaysRunning`
   - **Idle Time-out (minutes)**: `0` (desabilita timeout)
   - **Identity**: `ApplicationPoolIdentity` (ou conta específica com acesso ao SQL)

### Passo 3: Criar Website ou Application

**Opção A: Como Website (recomendado para produção)**

1. No IIS Manager, clique com botão direito em **Sites** → **Add Website**
2. Configure:
   - **Site name**: `SqlAPI`
   - **Application pool**: `SqlApiPool`
   - **Physical path**: `C:\PROJETOS\sql_api` ⚠️ **IMPORTANTE: Aponte para a RAIZ do projeto, NÃO para a pasta `public`**
   - **Binding**:
     - Type: `http`
     - IP address: `All Unassigned`
     - Port: `84` (ou outra porta disponível)
     - Host name: (deixe em branco ou coloque o domínio)
3. Clique em **OK**

**Opção B: Como Application (se já tem um site)**

1. Expanda **Sites** → **Default Web Site**
2. Clique com botão direito → **Add Application**
3. Configure:
   - **Alias**: `sqlapi`
   - **Application pool**: `SqlApiPool`
   - **Physical path**: `C:\PROJETOS\sql_api` ⚠️ **IMPORTANTE: Aponte para a RAIZ do projeto, NÃO para a pasta `public`**
4. Clique em **OK**

> ⚠️ **ATENÇÃO**: O caminho físico deve apontar para a **raiz do projeto** onde está o arquivo `index.js`, **NÃO** para a pasta `public`. O Express já está configurado para servir arquivos estáticos da pasta `public` automaticamente.

### Passo 4: Configurar permissões

```powershell
# Dar permissões ao Application Pool Identity
icacls "C:\PROJETOS\sql_api" /grant "IIS AppPool\SqlApiPool:(OI)(CI)F" /T
```

> 💡 Ajuste o caminho `C:\PROJETOS\sql_api` para o caminho onde está seu projeto.

---

## 📝 Configuração do web.config

⚠️ **O arquivo `web.config` já existe na raiz do projeto!** Não é necessário criar manualmente.

Mas se precisar, aqui está o conteúdo atualizado (deve estar em `C:\PROJETOS\sql_api\web.config`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    
    <!-- Handler para arquivos Node.js -->
    <handlers>
      <add name="iisnode" path="index.js" verb="*" modules="iisnode" />
    </handlers>
    
    <!-- Regras de reescrita de URL -->
    <rewrite>
      <rules>
        <!-- Regra para arquivos estáticos -->
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}" />
        </rule>
        
        <!-- Regra para redirecionar ao Node.js -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="index.js" />
        </rule>
      </rules>
      </rewrite>
      
      <!-- Configurações do iisnode -->
    <iisnode 
      nodeProcessCommandLine="&quot;C:\Program Files\nodejs\node.exe&quot;"
      debuggingEnabled="false"
      loggingEnabled="true"
      logDirectory="iisnode"
      maxNamedPipeConnectionRetry="100"
      namedPipeConnectionRetryDelay="250"
      maxConcurrentRequestsPerProcess="1024"
      maxProcessCountPerApplication="4"
      asyncCompletionThreadCount="8"
      watchedFiles="*.js;iisnode.yml"
      enableXFF="true"
    />
    
    <!-- Segurança: Esconder cabeçalhos -->
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
    
    <!-- Configuração de erros -->
    <httpErrors existingResponse="PassThrough" />
    
  </system.webServer>
</configuration>
```

---

## ✅ Teste e Verificação

### Passo 1: Reiniciar IIS

```powershell
iisreset
```

### Passo 2: Testar a aplicação

1. Abra o navegador
2. Acesse:
   - Se criou como Website: `http://localhost` ou `http://localhost:8080`
   - Se criou como Application: `http://localhost/sqlapi`

3. Teste os endpoints da API:
   ```
   http://localhost/pedidos/producaohoje
   http://localhost/pedidos/nfandamento
   ```

### Passo 3: Verificar logs

Se houver problemas, verifique os logs em:

```
C:\inetpub\wwwroot\sql_api\iisnode\
```

---

## 🔍 Troubleshooting

### Problema: Erro 500.1000 - Internal Server Error

**Causa**: iisnode não conseguiu iniciar o Node.js

**Solução**:
```powershell
# Verificar se Node.js está no PATH do sistema
where.exe node

# Garantir permissões corretas
icacls "C:\inetpub\wwwroot\sql_api" /grant "IIS AppPool\SqlApiPool:(OI)(CI)F" /T

# Verificar logs em: C:\inetpub\wwwroot\sql_api\iisnode\
```

### Problema: Erro 404 - Page Not Found

**Causa**: Regras de reescrita incorretas

**Solução**:
1. Instale o **URL Rewrite Module**: https://www.iis.net/downloads/microsoft/url-rewrite
2. Verifique o arquivo `web.config`
3. Reinicie o IIS: `iisreset`

### Problema: Aplicação lenta ou não responde

**Causa**: Configurações do Application Pool

**Solução**:
1. Aumentar `maxProcessCountPerApplication` no `web.config`
2. Verificar timeout do Application Pool
3. Monitorar uso de memória

### Problema: Erro de conexão com SQL Server

**Causa**: Credenciais ou permissões incorretas

**Solução**:
```powershell
# Testar conexão manualmente
cd C:\inetpub\wwwroot\sql_api
node
> const db = require('./db.js');
> // Testar conexão
```

### Problema: Arquivos estáticos (CSS/JS) não carregam

**Causa**: MIME types não configurados

**Solução**:
1. No IIS Manager, selecione o site
2. Abra **MIME Types**
3. Adicione se necessário:
   - `.css` → `text/css`
   - `.js` → `application/javascript`
   - `.json` → `application/json`

---

## 🔒 Configurações de Segurança (Produção)

### 1. SSL/HTTPS

```powershell
# Instalar certificado SSL
# No IIS Manager → Site → Bindings → Add
# Type: https
# Port: 443
# SSL certificate: [seu certificado]
```

### 2. Firewall

```powershell
# Permitir porta 80 e 443
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

### 3. Variáveis de Ambiente Seguras

Não armazene senhas no código! Use variáveis de ambiente:

```powershell
# Configurar variáveis de ambiente para o Application Pool
Set-ItemProperty IIS:\AppPools\SqlApiPool -Name processModel.environmentVariables -Value @{
    DB_SERVER="seu_servidor"
    DB_PASSWORD="sua_senha"
}
```

---

## 📊 Monitoramento

### Logs do IIS

```
C:\inetpub\logs\LogFiles\
```

### Logs da Aplicação (iisnode)

```
C:\inetpub\wwwroot\sql_api\iisnode\
```

### Event Viewer

```
Painel de Controle → Administrative Tools → Event Viewer
→ Windows Logs → Application
```

---

## 🔄 Atualização da Aplicação

Para atualizar a aplicação sem downtime:

```powershell
# 1. Parar o Application Pool
Stop-WebAppPool -Name SqlApiPool

# 2. Atualizar arquivos
# (copie novos arquivos para C:\inetpub\wwwroot\sql_api)

# 3. Atualizar dependências (se necessário)
cd C:\inetpub\wwwroot\sql_api
npm install

# 4. Iniciar o Application Pool
Start-WebAppPool -Name SqlApiPool

# 5. Limpar cache do IIS
iisreset
```

---

## 📞 Suporte

Para mais informações:

- **Documentação do iisnode**: https://github.com/Azure/iisnode
- **IIS Documentation**: https://docs.microsoft.com/en-us/iis/
- **Node.js Documentation**: https://nodejs.org/docs/

---

**Desenvolvido pela equipe BASIS Development Team**

