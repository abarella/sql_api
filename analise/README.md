# ?? Documentacao - Deploy Node.js no IIS

Esta pasta contem toda a documentacao e solucoes para fazer a aplicacao Node.js funcionar no IIS.

## ? STATUS: APLICACAO FUNCIONANDO!

A aplicacao esta rodando corretamente no IIS na porta 84.
Consulte `00-RESUMO-FINAL.md` para um resumo completo do que foi configurado.

## ?? Índice de Documentos

### 1. [PROBLEMA PRINCIPAL](01-PROBLEMA-PRINCIPAL.md)
Identifica o problema principal: falta do arquivo `web.config`.

### 2. [INSTALAÇÃO IISNODE](02-INSTALACAO-IISNODE.md)
Como verificar e instalar o módulo iisnode, essencial para rodar Node.js no IIS.

### 3. [CONFIGURAÇÃO IIS](03-CONFIGURACAO-IIS.md)
Passo a passo completo para configurar o site no IIS Manager.

### 4. [TESTE APLICAÇÃO](04-TESTE-APLICACAO.md)
Como testar se a aplicação está funcionando corretamente.

### 5. [CHECKLIST COMPLETO](05-CHECKLIST-COMPLETO.md)
Checklist detalhado para garantir que tudo está configurado.

### 6. [SOLUÇÕES RÁPIDAS](06-SOLUCOES-RAPIDAS.md)
Solucoes rapidas para problemas comuns e comandos uteis.

### 7. [ERRO MIME TYPE DUPLICADO](07-ERRO-MIME-TYPE-DUPLICADO.md)
Solucao especifica para o erro 500.19 relacionado a MIME types duplicados.

### 8. [ERRO HANDLER IISNODE](08-ERRO-HANDLER-IISNODE.md)
Solucao para o erro na linha 7 do web.config relacionado ao handler do iisnode.

### 9. [INSTALAR IISNODE AGORA](09-INSTALAR-IISNODE-AGORA.md)
Guia passo a passo para instalar o iisnode e resolver o erro do handler.

### 10. [ERRO SCHEMA IISNODE](10-ERRO-SCHEMA-IISNODE.md)
Solucao para o erro de schema do iisnode - versao minima compativel do web.config.

### Scripts Utilitarios:
- `verificar-iisnode.ps1` - Script PowerShell para verificar se o iisnode esta instalado

## ?? Início Rápido

Se você quer começar rapidamente:

1. **Verifique se o `web.config` está na raiz do projeto**
   - Se não estiver, ele foi criado automaticamente
   - Localização: `C:\PROJETOS\sql_api\web.config`

2. **Siga a ordem dos documentos:**
   - Comece pelo `01-PROBLEMA-PRINCIPAL.md` para entender o problema
   - Depois `02-INSTALACAO-IISNODE.md` para verificar/instalar o iisnode
   - Em seguida `03-CONFIGURACAO-IIS.md` para configurar o IIS
   - Por fim `04-TESTE-APLICACAO.md` para testar

3. **Use o checklist:**
   - `05-CHECKLIST-COMPLETO.md` para não esquecer nada

4. **Se tiver problemas:**
   - Consulte `06-SOLUCOES-RAPIDAS.md` para soluções imediatas

## ?? Importante

- Todos os comandos PowerShell devem ser executados **como Administrador**
- Após qualquer mudança no IIS, **sempre reinicie** com `iisreset`
- O arquivo `web.config` é **ESSENCIAL** - sem ele, a aplicação não funciona no IIS

## ?? Status da Aplicação

- ? **Funciona localmente**: `npm start` (porta 3000)
- ? **IIS**: FUNCIONANDO (porta 84)
  - Arquivo `web.config` configurado ?
  - iisnode instalado e registrado ?
  - Aplicacao rodando em http://localhost:84/ ?

## ?? Links Úteis

- [Documentação oficial do iisnode](https://github.com/Azure/iisnode)
- [Documentação do IIS](https://docs.microsoft.com/en-us/iis/)
- [Documentação do Express.js](https://expressjs.com/)

## ?? Suporte

Se após seguir toda a documentação ainda houver problemas:

1. Verifique os logs em `C:\PROJETOS\sql_api\iisnode\`
2. Verifique o Event Viewer do Windows
3. Teste localmente com `npm start` para isolar o problema
4. Consulte `06-SOLUCOES-RAPIDAS.md` para problemas comuns

---

**Última atualização:** Documentação criada para resolver problemas de deploy no IIS
**Aplicação:** sql_api
**Porta IIS:** 84
**Porta Local:** 3000

