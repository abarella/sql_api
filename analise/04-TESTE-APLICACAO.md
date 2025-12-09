# ?? Teste da Aplicação no IIS

## ? Checklist de Verificação:

Antes de testar, confirme:
- [ ] iisnode está instalado
- [ ] web.config está na raiz do projeto
- [ ] Site configurado no IIS na porta 84
- [ ] Application Pool está rodando
- [ ] Permissões da pasta configuradas

## ?? Testes Básicos:

### 1. Teste de Status da API

Abra o navegador e acesse:
```
http://localhost:84/api/status
```

**Resultado esperado:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "API SQL está funcionando",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Teste de Página Principal

Acesse:
```
http://localhost:84/
```

**Resultado esperado:**
- Página HTML carregando corretamente
- CSS e JavaScript funcionando
- Sem erros no console do navegador (F12)

### 3. Teste de Conectividade IIS (Endpoint Especial)

Acesse:
```
http://localhost:84/test-iis
```

**Resultado esperado:**
- JSON com informações do ambiente
- Logs de teste
- Confirmação de que está rodando no IIS

### 4. Teste de Rotas da API

Teste as rotas de pedidos:
```
http://localhost:84/pedidos/...
```

## ?? Testes via PowerShell:

### Teste 1: Verificar se o site responde

```powershell
# Teste básico de conectividade
Invoke-WebRequest -Uri "http://localhost:84/api/status" -UseBasicParsing
```

### Teste 2: Verificar conteúdo da resposta

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:84/api/status" -UseBasicParsing
$response.Content
$response.StatusCode  # Deve ser 200
```

### Teste 3: Verificar se Node.js está processando

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:84/test-iis" -UseBasicParsing
$json = $response.Content | ConvertFrom-Json
$json.environment.iisNode  # Deve mostrar versão do iisnode
```

## ?? Verificar Logs:

### Logs do iisnode:

Os logs ficam em:
```
C:\PROJETOS\sql_api\iisnode\
```

Verifique os arquivos mais recentes para erros.

### Event Viewer do Windows:

1. Pressione `Win + R`
2. Digite: `eventvwr.msc`
3. Navegue até: **Windows Logs** ? **Application**
4. Procure por erros relacionados ao IIS ou iisnode

### Logs do IIS:

1. No IIS Manager, selecione o site
2. No painel direito, clique em **"Failed Request Tracing Rules"**
3. Ou verifique os logs em:
   ```
   C:\inetpub\logs\LogFiles\W3SVC[ID_DO_SITE]\
   ```

## ?? Diagnóstico de Problemas:

### Problema: Erro 500 Internal Server Error

**Solução:**
1. Verifique os logs em `iisnode\`
2. Verifique o Event Viewer
3. Teste se a aplicação funciona localmente: `npm start`
4. Verifique se todas as dependências estão instaladas: `npm install`

### Problema: Erro 404 Not Found

**Solução:**
1. Verifique se o `web.config` está na raiz
2. Verifique se o site está apontando para a pasta correta
3. Verifique se o iisnode está instalado

### Problema: Erro de conexão com banco de dados

**Solução:**
1. Verifique as credenciais no arquivo `db.js`
2. Verifique se o SQL Server está acessível
3. Verifique se a conta do Application Pool tem permissões no SQL Server
4. Teste a conexão manualmente

### Problema: Arquivos estáticos não carregam (CSS/JS)

**Solução:**
1. Verifique se a pasta `public` existe e tem permissões
2. Verifique o `web.config` - regra de rewrite para arquivos estáticos
3. Verifique o console do navegador (F12) para erros 404

## ? Validação Final:

Se todos os testes passarem:
- ? API respondendo em `http://localhost:84/api/status`
- ? Página principal carregando em `http://localhost:84/`
- ? Rotas de API funcionando
- ? Sem erros nos logs

**A aplicação está funcionando corretamente no IIS!** ??

## ?? Próximos Passos (Opcional):

- Configurar HTTPS (SSL)
- Configurar domínio personalizado
- Otimizar performance
- Configurar backup automático



