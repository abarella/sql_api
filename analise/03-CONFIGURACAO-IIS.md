# ?? Configuração do Site no IIS

## ?? Pré-requisitos:

? iisnode instalado (ver `02-INSTALACAO-IISNODE.md`)
? Arquivo `web.config` na raiz do projeto
? Node.js instalado e no PATH

## ?? Passo a Passo:

### 1. Abrir IIS Manager

1. Pressione `Win + R`
2. Digite: `inetmgr` e pressione Enter
3. Ou procure por "IIS Manager" no menu Iniciar

### 2. Criar/Configurar o Site

#### Se o site já existe:

1. No painel esquerdo, expanda **"Sites"**
2. Clique com botão direito no site (provavelmente na porta 84)
3. Selecione **"Manage Application"** ? **"Advanced Settings"**
4. Verifique que o **Physical Path** aponta para: `C:\PROJETOS\sql_api`

#### Se precisa criar o site:

1. Clique com botão direito em **"Sites"**
2. Selecione **"Add Website"**
3. Configure:
   - **Site name**: `sql_api` (ou nome de sua preferência)
   - **Application pool**: Deixe o padrão ou crie um novo
   - **Physical path**: `C:\PROJETOS\sql_api`
   - **Binding**:
     - **Type**: `http`
     - **IP address**: `All Unassigned` ou `127.0.0.1`
     - **Port**: `84`
     - **Host name**: (deixe em branco)
4. Clique em **OK**

### 3. Configurar Application Pool

1. No painel esquerdo, clique em **"Application Pools"**
2. Selecione o pool do seu site (geralmente tem o mesmo nome)
3. Clique com botão direito ? **"Advanced Settings"**
4. Configure:
   - **.NET CLR Version**: `No Managed Code`
   - **Managed Pipeline Mode**: `Integrated`
   - **Identity**: 
     - Se usar autenticação SQL Server, configure para uma conta com permissões:
       - Clique em **"..."** ao lado de Identity
       - Selecione **"Custom account"**
       - Clique em **"Set"**
       - Digite uma conta com permissões (ex: conta de serviço ou sua conta de usuário)
       - Digite a senha
   - **Start Mode**: `AlwaysRunning` (opcional, mas recomendado)

### 4. Verificar Permissões da Pasta

A pasta do projeto precisa de permissões para o IIS:

```powershell
# Execute no PowerShell como Administrador
$folder = "C:\PROJETOS\sql_api"
$iisUser = "IIS_IUSRS"

# Dar permissões de leitura/execução
icacls $folder /grant "${iisUser}:(OI)(CI)RX" /T

# Se usar uma conta específica, adicione também:
# icacls $folder /grant "IIS AppPool\sql_api:(OI)(CI)RX" /T
```

### 5. Verificar se web.config está na raiz

Certifique-se de que o arquivo `web.config` está em:
```
C:\PROJETOS\sql_api\web.config
```

### 6. Reiniciar o Site

1. No IIS Manager, selecione o site
2. No painel direito, clique em **"Restart"**
   - Ou clique com botão direito no site ? **"Manage Website"** ? **"Restart"**

### 7. Verificar Logs (se houver erro)

Os logs do iisnode ficam em:
```
C:\PROJETOS\sql_api\iisnode\
```

Verifique os arquivos de log se a aplicação não iniciar.

## ?? Verificações Importantes:

### Verificar se o site está rodando:

1. No IIS Manager, selecione o site
2. No painel direito, verifique se aparece **"Started"** (verde)
3. Se aparecer **"Stopped"** (vermelho), clique em **"Start"**

### Verificar porta 84:

```powershell
# Verificar se a porta 84 está em uso
netstat -ano | findstr :84
```

### Testar acesso:

Abra o navegador e acesse:
- `http://localhost:84/`
- `http://localhost:84/api/status`

## ?? Problemas Comuns:

### Erro 500.19 - Configuração inválida
- **Causa**: web.config malformado ou iisnode não instalado
- **Solução**: Verifique se o iisnode está instalado e o web.config está correto

### Erro 500.0 - Erro interno
- **Causa**: Erro na aplicação Node.js
- **Solução**: Verifique os logs em `iisnode\` e o Event Viewer do Windows

### Site não inicia
- **Causa**: Porta em uso ou permissões
- **Solução**: Verifique porta e permissões da pasta

## ?? Próximo passo:

Após configurar, siga para:
- `04-TESTE-APLICACAO.md` - Testar se está funcionando



