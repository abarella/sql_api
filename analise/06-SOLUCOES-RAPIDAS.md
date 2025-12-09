# ?? Soluções Rápidas para Problemas Comuns

## ? Comandos Rápidos (PowerShell como Administrador)

### Reiniciar IIS
```powershell
iisreset
```

### Verificar se o site está rodando
```powershell
Get-WebSite | Where-Object {$_.State -eq "Started"}
```

### Verificar Application Pool
```powershell
Get-WebAppPoolState -Name "DefaultAppPool"  # Substitua pelo nome do seu pool
```

### Iniciar Application Pool
```powershell
Start-WebAppPool -Name "DefaultAppPool"
```

### Parar Application Pool
```powershell
Stop-WebAppPool -Name "DefaultAppPool"
```

### Verificar porta 84
```powershell
netstat -ano | findstr :84
```

### Verificar se iisnode está instalado
```powershell
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}
```

### Testar API rapidamente
```powershell
Invoke-WebRequest -Uri "http://localhost:84/api/status" -UseBasicParsing
```

## ?? Problemas e Soluções Rápidas

### ? Erro: "500.19 - Configuração inválida"

**Causa:** web.config malformado ou iisnode não instalado

**Solução rápida:**
1. Verifique se o iisnode está instalado (comando acima)
2. Se não estiver, instale: `Instalacao\iisnode-full-v0.2.26-x64.msi`
3. Reinicie IIS: `iisreset`
4. Verifique se o `web.config` está na raiz do projeto

### ? Erro: "500.19 - MIME type duplicado (.json, .woff, etc.)"

**Causa:** Tentativa de adicionar MIME types que ja existem no IIS

**Mensagem de erro:** "Nao e possivel adicionar a entrada de colecao duplicada do tipo 'mimeMap'"

**Solucao rapida:**
1. Remova a secao `<staticContent>` do `web.config`
2. O IIS ja tem esses MIME types configurados globalmente
3. Se realmente precisar adicionar um MIME type, use `<remove>` antes de `<add>`:
   ```xml
   <staticContent>
     <remove fileExtension=".json" />
     <mimeMap fileExtension=".json" mimeType="application/json" />
   </staticContent>
   ```
4. Reinicie IIS: `iisreset`

### ? Erro: "500.0 - Erro interno do servidor"

**Causa:** Erro na aplicação Node.js

**Solução rápida:**
1. Verifique os logs: `C:\PROJETOS\sql_api\iisnode\`
2. Teste localmente: `npm start`
3. Se funcionar localmente, verifique permissões da pasta
4. Verifique se `node_modules` está instalado: `npm install`

### ? Erro: "404 - Not Found"

**Causa:** Site não configurado ou web.config ausente

**Solução rápida:**
1. Verifique se o site existe no IIS Manager
2. Verifique se o Physical Path está correto: `C:\PROJETOS\sql_api`
3. Verifique se o `web.config` está na raiz
4. Reinicie o site no IIS Manager

### ? Erro: "503 - Service Unavailable"

**Causa:** Application Pool parado ou com erro

**Solução rápida:**
1. No IIS Manager, vá em Application Pools
2. Verifique se o pool está "Started"
3. Se estiver "Stopped", clique com botão direito ? Start
4. Se continuar parando, verifique os logs do Event Viewer

### ? Erro: "Cannot GET /"

**Causa:** Roteamento não configurado corretamente

**Solução rápida:**
1. Verifique se o `web.config` tem a regra de rewrite para `index.js`
2. Verifique se o `index.js` está na raiz
3. Reinicie o site: `iisreset`

### ? Erro: "ECONNREFUSED" ou erro de conexão com banco

**Causa:** SQL Server inacessível ou credenciais incorretas

**Solução rápida:**
1. Verifique se o SQL Server está rodando
2. Teste a conexão manualmente (SQL Server Management Studio)
3. Verifique credenciais em `db.js`
4. Verifique se a conta do Application Pool tem permissões no SQL Server

### ? Arquivos estáticos (CSS/JS) não carregam

**Causa:** Regra de rewrite ou permissões

**Solução rápida:**
1. Verifique se a pasta `public` existe e tem conteúdo
2. Verifique permissões da pasta `public`
3. Verifique o `web.config` - regra de StaticContent
4. Teste acesso direto: `http://localhost:84/style.css`

### ? Site não inicia

**Causa:** Porta em uso ou configuração incorreta

**Solução rápida:**
1. Verifique se a porta 84 está em uso: `netstat -ano | findstr :84`
2. Se estiver, mude a porta no IIS ou pare o processo
3. Verifique se o Physical Path está correto
4. Verifique permissões da pasta

## ?? Verificação Rápida em 5 Minutos

Execute estes comandos em sequência:

```powershell
# 1. Verificar Node.js
node --version

# 2. Verificar iisnode
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# 3. Verificar site
Get-WebSite | Select-Object Name, State, PhysicalPath

# 4. Verificar Application Pool
Get-WebAppPoolState -Name "DefaultAppPool"

# 5. Testar API
Invoke-WebRequest -Uri "http://localhost:84/api/status" -UseBasicParsing

# 6. Verificar logs recentes
Get-ChildItem "C:\PROJETOS\sql_api\iisnode\" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

## ?? Checklist Rápido

- [ ] iisnode instalado?
- [ ] web.config na raiz?
- [ ] Site configurado no IIS?
- [ ] Application Pool rodando?
- [ ] Porta 84 livre?
- [ ] Permissões da pasta OK?
- [ ] node_modules instalado?
- [ ] SQL Server acessível?

## ?? Se nada funcionar:

1. **Teste localmente primeiro:**
   ```powershell
   cd C:\PROJETOS\sql_api
   npm start
   ```
   Se funcionar localmente, o problema é de configuração do IIS.

2. **Verifique os logs:**
   - `C:\PROJETOS\sql_api\iisnode\`
   - Event Viewer ? Windows Logs ? Application

3. **Reinstale o iisnode:**
   - Desinstale: Programs and Features
   - Reinstale: `Instalacao\iisnode-full-v0.2.26-x64.msi`
   - Reinicie: `iisreset`

4. **Recrie o site:**
   - Delete o site no IIS Manager
   - Crie um novo seguindo `03-CONFIGURACAO-IIS.md`

## ?? Informações para Suporte

Se precisar de ajuda, tenha estas informações prontas:

- Versão do Node.js: `node --version`
- Versão do iisnode: Verificar em `C:\Program Files\iisnode\`
- Versão do Windows: `systeminfo | findstr /B /C:"OS Name" /C:"OS Version"`
- Últimos logs: `C:\PROJETOS\sql_api\iisnode\`
- Erro exato: (copie a mensagem completa)

