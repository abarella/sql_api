# ? Checklist Completo - Deploy no IIS

Use este checklist para garantir que tudo está configurado corretamente.

## ?? Pré-requisitos

- [ ] **Node.js instalado**
  - Versão: _____
  - Comando de verificação: `node --version`
  - Path configurado corretamente

- [ ] **iisnode instalado**
  - Versão: _____
  - Arquivo verificado: `C:\Program Files\iisnode\iisnode.dll`
  - Módulo registrado no IIS

- [ ] **IIS instalado e funcionando**
  - IIS Manager acessível
  - Pelo menos um site rodando

- [ ] **SQL Server acessível**
  - Servidor: `UIRAPURU`
  - Database: `VendasPelicano`
  - Credenciais válidas

## ?? Arquivos do Projeto

- [ ] **web.config na raiz**
  - Caminho: `C:\PROJETOS\sql_api\web.config`
  - Conteúdo válido (XML bem formado)
  - Configuração do iisnode presente

- [ ] **index.js na raiz**
  - Arquivo principal da aplicação
  - Configurado para usar `process.env.PORT`

- [ ] **package.json presente**
  - Todas as dependências listadas
  - Scripts configurados

- [ ] **node_modules instalado**
  - Comando: `npm install` executado
  - Todas as dependências baixadas
  - Sem erros na instalação

- [ ] **Pasta public existe**
  - Contém `index.html`
  - Arquivos estáticos (CSS, JS) presentes

## ?? Configuração do IIS

- [ ] **Site criado/configurado**
  - Nome do site: _____
  - Porta: `84`
  - Physical Path: `C:\PROJETOS\sql_api`

- [ ] **Application Pool configurado**
  - .NET CLR Version: `No Managed Code`
  - Managed Pipeline Mode: `Integrated`
  - Identity configurada (com permissões adequadas)
  - Status: `Started`

- [ ] **Permissões da pasta**
  - `IIS_IUSRS` tem permissões de leitura/execução
  - Application Pool Identity tem permissões (se necessário)
  - Usuário atual tem permissões

- [ ] **Site iniciado**
  - Status no IIS Manager: `Started` (verde)
  - Porta 84 não está em uso por outro processo

## ?? Testes

- [ ] **Teste 1: Status da API**
  - URL: `http://localhost:84/api/status`
  - Status Code: `200 OK`
  - Resposta JSON válida

- [ ] **Teste 2: Página Principal**
  - URL: `http://localhost:84/`
  - HTML carrega corretamente
  - CSS aplicado
  - JavaScript funcionando

- [ ] **Teste 3: Teste IIS**
  - URL: `http://localhost:84/test-iis`
  - Retorna informações do ambiente
  - Detecta iisnode

- [ ] **Teste 4: Rotas da API**
  - URL: `http://localhost:84/pedidos/...`
  - Responde corretamente
  - Conecta ao banco de dados

- [ ] **Teste 5: Arquivos Estáticos**
  - CSS carrega: `http://localhost:84/style.css`
  - Imagens carregam (se houver)
  - JavaScript carrega

## ?? Logs e Monitoramento

- [ ] **Logs do iisnode**
  - Pasta existe: `C:\PROJETOS\sql_api\iisnode\`
  - Arquivos de log sendo gerados
  - Sem erros críticos nos logs

- [ ] **Event Viewer**
  - Sem erros relacionados ao IIS
  - Sem erros relacionados ao iisnode
  - Sem erros relacionados ao Node.js

- [ ] **Logs do IIS**
  - Logs sendo gerados em `C:\inetpub\logs\LogFiles\`
  - Requisições sendo registradas

## ?? Segurança (Opcional)

- [ ] **Credenciais do banco**
  - Não hardcoded no código (usar variáveis de ambiente)
  - Conta com permissões mínimas necessárias

- [ ] **Permissões de arquivos**
  - Arquivos sensíveis protegidos
  - `.env` ou arquivos de configuração não expostos

- [ ] **HTTPS configurado** (se necessário)
  - Certificado SSL instalado
  - Redirecionamento HTTP ? HTTPS

## ? Validação Final

- [ ] **Aplicação funciona localmente**
  - `npm start` executa sem erros
  - Acessível em `http://localhost:3000`

- [ ] **Aplicação funciona no IIS**
  - Acessível em `http://localhost:84`
  - Todas as rotas respondem
  - Banco de dados conecta

- [ ] **Performance aceitável**
  - Tempo de resposta < 2 segundos
  - Sem erros de timeout
  - Recursos sendo servidos corretamente

## ?? Notas Adicionais

Espaço para anotações:

```
Data do deploy: _____
Responsável: _____
Observações:
_____________________________________________
_____________________________________________
_____________________________________________
```

## ?? Se algo não funcionar:

1. Consulte os arquivos de solução:
   - `01-PROBLEMA-PRINCIPAL.md`
   - `02-INSTALACAO-IISNODE.md`
   - `03-CONFIGURACAO-IIS.md`
   - `04-TESTE-APLICACAO.md`

2. Verifique os logs:
   - `C:\PROJETOS\sql_api\iisnode\`
   - Event Viewer do Windows
   - Logs do IIS

3. Teste localmente primeiro:
   - `npm start`
   - Se funcionar localmente, o problema é de configuração do IIS

4. Verifique permissões:
   - Pasta do projeto
   - Application Pool Identity
   - SQL Server



