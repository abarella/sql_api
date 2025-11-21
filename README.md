# SQL API - Sistema de Monitoramento de Produção e Notas Fiscais

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.21.2-blue.svg)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Uma API REST desenvolvida em Node.js para monitoramento em tempo real de produção e consulta de notas fiscais em andamento, conectando diretamente ao SQL Server para fornecer dados atualizados sobre operações comerciais e produtivas.

## 📋 Índice

- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Interface Web](#interface-web)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🚀 Características

- **Monitoramento em Tempo Real**: Dashboard com atualização automática a cada 5 segundos
- **API RESTful**: Endpoints organizados para diferentes tipos de consultas
- **Interface Web Responsiva**: Front-end com DataTables para visualização de dados
- **Conexão SQL Server**: Integração direta com banco de dados corporativo
- **Arquitetura Modular**: Código organizado em camadas (routes, database, frontend)
- **CORS Habilitado**: Permite integração com diferentes domínios
- **Tratamento de Erros**: Sistema robusto de captura e tratamento de exceções

## 🛠 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **mssql** - Driver oficial para SQL Server
- **cors** - Middleware para Cross-Origin Resource Sharing
- **body-parser** - Middleware para parsing de requisições
- **nodemon** - Ferramenta de desenvolvimento para restart automático

### Frontend
- **HTML5/CSS3** - Estrutura e estilização
- **jQuery** - Biblioteca JavaScript
- **DataTables** - Plugin para tabelas interativas
- **CSS Grid/Flexbox** - Layout responsivo

### Database
- **Microsoft SQL Server** - Sistema de gerenciamento de banco de dados

## ⚡ Funcionalidades

### 📊 Monitoramento de Produção
- **Produção do Dia**: Visualiza produtos em produção no dia atual
  - Exibe ID, Produto, Lote, Série e Quantidade
  - **Contador Total**: Soma automática de todas as quantidades em produção
  - Atualização automática a cada 5 segundos
- **Produção do Próximo Dia**: Planejamento de produção para o dia seguinte
  - Exibe Produto, Lote, Série e Quantidade
  - **Contador Total**: Soma automática das quantidades planejadas
  - Visão antecipada para organização da produção
- **Agrupamento por Lote/Série**: Organização inteligente dos dados de produção
- **Exclusão Automática**: Filtra produtos como 'EMB.GER.' e cliente específico

### 📄 Gestão de Notas Fiscais
- **Notas em Andamento**: Monitoramento de NFs que estão sendo processadas
  - Número da NF, Emissor, Tentativas de envio
  - UF de destino, Chave de acesso, Série
  - **Transportadora**: Informação da transportadora (campo p110trn2)
  - Chave NF e Atividade
  - **Contador de Registros**: Quantidade total de NFs em processamento
  - Atualização em tempo real a cada 5 segundos
- **Status de Autorização**: Acompanhamento do protocolo de autorização
- **Informações de Transporte**: Dados completos de transportadoras e destinos
- **Rastreamento por Chave**: Busca detalhada por chave de acesso

### 🔍 Consultas Avançadas
- **Busca por Lote**: Consulta específica via stored procedure (`usp_getPedidos`)
- **Filtros Automáticos**: 
  - Exclusão de registros não relevantes (p110situ = 0)
  - Produtos específicos descartados
  - Clientes específicos filtrados
- **Dados Consolidados**: Informações agregadas e organizadas por data e lote

### 📈 Contadores e Totalizadores
- **Soma de Quantidades**: Totalização automática de produtos em produção (hoje e amanhã)
- **Contagem de NFs**: Quantidade de notas fiscais em processamento
- **Atualização Dinâmica**: Todos os contadores são atualizados automaticamente

### 🔧 Operações de Atualização (PUT)
- **Zerar Tentativas de NF**:
  - Permite zerar o contador de tentativas de envio de uma NF específica
  - Busca por OID da nota fiscal
  - Validação de campos obrigatórios
  - Confirmação antes de executar
  - Feedback visual de sucesso/erro
  - Atualização automática da tabela após operação

- **Gravar Autorização**:
  - Grava protocolo de autorização de NF-e
  - Campos: Chave (44 caracteres), Autorização, Data/Hora
  - Validação de formato da chave de acesso
  - Data/hora pré-preenchida com valor atual
  - Conversão automática para formato SQL Server
  - Executa stored procedure `PNFE_GRAVA_AUTORIZACAO`
  - Mensagens temporárias (3 segundos) de sucesso/erro
  - Interface responsiva com desabilitação de botão durante processamento

## 📥 Instalação

### Pré-requisitos
- Node.js v14 ou superior
- Acesso ao SQL Server
- Git (opcional)

### Passo a Passo

1. **Clone o repositório** (ou baixe o código):
```bash
git clone https://github.com/abarella/sql_api.git
cd sql_api
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure a conexão com banco** (veja seção [Configuração](#configuração))

4. **Execute o projeto**:
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

## ⚙️ Configuração

### Configuração do Banco de Dados

Edite o arquivo `db.js` com suas credenciais do SQL Server:

```javascript
this.config = {
  server: "SEU_SERVIDOR",           // Ex: "localhost" ou "192.168.1.100"
  database: "SUA_BASE_DE_DADOS",    // Ex: "VendasPelicano"
  user: "SEU_USUARIO",              // Ex: "sa"
  password: "SUA_SENHA",            // Sua senha do SQL Server
  options: {
    trustedConnection: true,         // Para autenticação Windows
    enableArithAbort: false,
    trustServerCertificate: true,    // Para desenvolvimento local
  },
};
```

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env` para configurações sensíveis:
```env
DB_SERVER=seu_servidor
DB_DATABASE=sua_base
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
```

## 🖥 Uso

1. **Inicie o servidor**:
```bash
npm start
```

2. **Acesse a interface web**:
```
http://localhost:3000
```

3. **Use a API diretamente**:
```bash
# Exemplo: Consultar produção de hoje
curl http://localhost:3000/pedidos/producaohoje
```

## 📡 Endpoints da API

### Base URL: `http://localhost:3000`

| Método | Endpoint | Descrição | Campos Retornados |
|--------|----------|-----------|-------------------|
| `GET` | `/pedidos/todosPedidos` | Lista os últimos 20 pedidos | Todos os campos da tabela TCACP110 |
| `GET` | `/pedidos/lote/:p110chve` | Busca pedidos por chave específica via stored procedure | Resultado de `usp_getPedidos` |
| `GET` | `/pedidos/producaohoje` | Produção do dia atual agrupada | `id`, `p110prod`, `p110lote`, `p110serie`, `regs` (quantidade) |
| `GET` | `/pedidos/producaoamanha` | Produção do próximo dia agrupada | `p110prod`, `p110lote`, `p110serie`, `regs` (quantidade) |
| `GET` | `/pedidos/nfandamento` | Notas fiscais em processamento | `nNF`, `notafis_oid`, `emissor`, `tentativas`, `enderdest_UF`, `p110chve`, `p110serie`, `p110atv`, `chave_acesso`, `p110trn2` (transportadora) |
| `GET` | `/pedidos/cobrancablindagem` | Lista clientes para cobrança via stored procedure | Resultado de `sp_BlindagemListaCliente` |
| `PUT` | `/pedidos/zerartentativas/:notafis_oid` | Zera tentativas de envio de uma NF específica | `success`, `message`, `rowsAffected` |
| `PUT` | `/pedidos/gravarautorizacao` | Grava autorização de NF-e via stored procedure | `success`, `message`, `chave`, `autorizacao` |

### Exemplos de Uso

#### 1. Consultar Produção de Hoje
```bash
GET /pedidos/producaohoje
```

**Resposta**:
```json
[
  {
    "id": 1,
    "p110prod": "PRODUTO001",
    "p110lote": "L2024001",
    "p110serie": "S001",
    "regs": 15
  }
]
```

#### 2. Buscar por Lote Específico
```bash
GET /pedidos/lote/L2024001
```

#### 3. Notas Fiscais em Andamento
```bash
GET /pedidos/nfandamento
```

**Resposta**:
```json
[
  {
    "nNF": 12345,
    "notafis_oid": 2373763,
    "emissor": "EMPRESA XYZ",
    "tentativas": 1,
    "enderdest_UF": "SP",
    "p110chve": "L2024001",
    "p110serie": "001",
    "p110atv": "Ativo",
    "chave_acesso": "35240112345678000123550010000123451234567890",
    "p110trn2": "TRANSPORTADORA XYZ LTDA",
    "protocolo_autorizacao": "135240000123456",
    "dEmi": "2024-11-21",
    "dest_xNome": "CLIENTE ABC",
    "Tot_prod": 1500.00
  }
]
```

#### 4. Zerar Tentativas de NF
```bash
PUT /pedidos/zerartentativas/2373763
```

**Resposta (Sucesso)**:
```json
{
  "success": true,
  "message": "Tentativas zeradas com sucesso para o OID 2373763",
  "rowsAffected": 1
}
```

**Resposta (NF não encontrada)**:
```json
{
  "error": "Nenhum registro encontrado com OID 2373763 ou já possui protocolo de autorização"
}
```

#### 5. Gravar Autorização de NF-e
```bash
PUT /pedidos/gravarautorizacao
Content-Type: application/json
```

**Body**:
```json
{
  "chave": "35251000402552000550550010009100481023762234",
  "autorizacao": "135253141831197",
  "dataHora": "20251120 10:34:51"
}
```

**Resposta (Sucesso)**:
```json
{
  "success": true,
  "message": "Autorização gravada com sucesso!",
  "chave": "35251000402552000550550010009100481023762234",
  "autorizacao": "135253141831197"
}
```

**Resposta (Erro de Validação)**:
```json
{
  "error": "A chave de acesso deve ter 44 caracteres."
}
```

## 🌐 Interface Web

### Características do Frontend

- **Dashboard Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Atualização Automática**: Dados refreshados a cada 5 segundos
- **Tabelas Interativas**: 
  - Ordenação por colunas
  - Busca integrada
  - Paginação automática
- **Design Moderno**: 
  - Gradientes CSS
  - Borders customizados
  - Typography otimizada

### Layout do Dashboard

O dashboard é dividido em duas áreas principais:

#### Área de Visualização (58% da tela)
Contém as três tabelas de monitoramento em tempo real:

1. **📈 Produção Hoje (Total: X)**
   - Lista produtos em produção no dia atual
   - Colunas: ID, Produto, Lote, Série, Qtde
   - **Contador no título**: Soma total de todas as quantidades
   - Numeração automática de registros
   - Atualização a cada 5 segundos

2. **📋 Notas Fiscais Agora (X)**
   - Status de processamento de NFs
   - Colunas: nNf, **OID**, Emissor, Tentativas, UF, Chave, Serie, Atividade, Chave NF, **Transportadora**
   - **Contador no título**: Quantidade de NFs em processamento
   - Informações de transporte e destino
   - Chaves de acesso completas
   - Atualização em tempo real

3. **📅 Produção Amanhã (Total: X)**
   - Planejamento do próximo dia útil
   - Colunas: Produto, Lote, Série, Qtde
   - **Contador no título**: Soma total das quantidades planejadas
   - Visão antecipada para organização
   - Atualização automática

#### Área de Operações (38% da tela)
Painel lateral com operações de atualização de dados:

1. **🔄 Zerar Tentativas NF**
   - Campo de entrada: OID da nota fiscal (apenas números)
   - Botão com ícone 🔄
   - Validação de campo obrigatório
   - Confirmação antes de executar
   - Mensagens de feedback (sucesso/erro) com fade-out em 3 segundos
   - Recarrega automaticamente a tabela "Nfs Agora" após sucesso
   - **SQL Executada**: `UPDATE vendasInternet..TNFe_IDENTIFICACAO SET tentativas = 0 WHERE notafis_oid = ?`

2. **💾 Gravar Autorização**
   - **Chave de Acesso**: Campo texto (44 caracteres, monospace)
   - **Autorização**: Campo texto para número da autorização
   - **Data e Hora**: Campo datetime-local (pré-preenchido com data/hora atual)
   - Botão verde "💾 Gravar Autorização" em largura total
   - Validações:
     - Todos os campos obrigatórios
     - Chave deve ter exatamente 44 caracteres
   - Conversão automática de data para formato SQL Server (YYYYMMDD HH:mm:ss)
   - Confirmação antes de gravar
   - Limpa campos após sucesso
   - **Stored Procedure**: `EXEC vendasinternet..PNFE_GRAVA_AUTORIZACAO`
   - Feedback visual com mensagens temporárias

### Features da Interface
- **Contadores Dinâmicos**: Todos os títulos exibem quantidades/somas atualizadas
- **Auto-refresh**: Dados atualizados automaticamente a cada 5 segundos
- **DataTables**: Tabelas interativas com ordenação e busca
- **Design Responsivo**: Layout flexível 58/38 com gap e padding otimizados
- **Validações em Tempo Real**: Campos obrigatórios e formato de dados
- **Feedback Visual**: Mensagens de sucesso (verde) e erro (vermelho)
- **UX Otimizada**: 
  - Botões desabilitados durante processamento
  - Opacidade reduzida em ações assíncronas
  - Tooltips informativos
  - Favicon personalizado (📊 dashboard)
- **Acessibilidade via Hostname**: Suporte para acesso local e remoto
- **UTF-8**: Acentuação correta em todos os textos

## 📁 Estrutura do Projeto

```
sql_api/
├── 📄 package.json           # Dependências e scripts
├── 📄 index.js              # Servidor principal Express
├── 📄 db.js                 # Classe de conexão com banco
├── 📄 README.md             # Documentação (este arquivo)
├── 📁 routes/
│   ├── 📄 Pedidos.js        # Rotas da API de pedidos
│   └── 📄 Pedidos_ORIGINAL.js
├── 📁 public/               # Frontend estático
│   ├── 📄 index.html        # Interface principal (dashboard + operações)
│   ├── 📄 style.css         # Estilos CSS
│   ├── 📄 favicon.svg       # Ícone do site (SVG, melhor qualidade)
│   ├── 📄 favicon.ico       # Ícone do site (ICO, compatibilidade)
│   └── 📄 FAVICON_INFO.md   # Documentação do favicon
└── 📁 backup/               # Versões originais
    ├── 📄 db_ORIGINAL.js
    └── 📄 index_ORIGINAL.js
```

### Descrição dos Arquivos Principais

- **`index.js`**: Servidor Express principal
  - Configuração de middlewares (CORS, body-parser)
  - Inicialização da conexão com banco
  - Servidor de arquivos estáticos
  - Porta 3000

- **`db.js`**: Classe DatabaseFacade
  - Abstração da conexão SQL Server
  - Suporte a queries e stored procedures
  - Pool de conexões
  - Tratamento de erros

- **`routes/Pedidos.js`**: Rotas da API
  - 6 endpoints principais
  - Queries otimizadas com filtros
  - Parâmetros nomeados para stored procedures
  - Handler centralizado de requisições

- **`public/index.html`**: Interface Web
  - 3 tabelas DataTables
  - Contadores dinâmicos nos títulos
  - Auto-refresh a cada 5 segundos
  - Integração com jQuery e DataTables

- **`public/style.css`**: Estilos CSS
  - Design moderno e responsivo
  - Gradientes e borders customizados
  - Tipografia otimizada

## 🔧 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Atualizar dependências
npm update

# Executar em modo desenvolvimento (com nodemon - auto-reload)
npm run dev

# Executar em modo produção (node puro)
npm start

# Verificar dependências e vulnerabilidades
npm audit

# No Windows, use npm.cmd para evitar erros de ExecutionPolicy:
npm.cmd run dev
npm.cmd start
```

### Diferenças entre Dev e Produção

- **`npm run dev`** (Desenvolvimento):
  - Usa `nodemon` para reload automático
  - Detecta mudanças em arquivos .js
  - Reinicia o servidor automaticamente
  - Ideal para desenvolvimento ativo

- **`npm start`** (Produção):
  - Usa `node` diretamente
  - Mais rápido e estável
  - Sem reload automático
  - Ideal para ambiente de produção

## 🚀 Deploy e Produção

### Deploy no IIS (Windows)

Esta aplicação está configurada para rodar no IIS usando uma arquitetura híbrida:

- **IIS (Porta 84)**: Serve arquivos estáticos (HTML, CSS, JS) da pasta `public/`
- **Node.js (Porta 3000)**: Executa a API REST em segundo plano

#### Guias de Instalação Disponíveis:

- 📘 **`INSTALACAO_IIS.md`**: Guia completo de instalação no IIS com iisnode
- 📋 **Scripts PowerShell**:
  - `iniciar-node-background.ps1` - Inicia Node.js em background
  - `parar-node.ps1` - Para todos os processos Node.js
  - `liberar-firewall.ps1` - Configura firewall para acesso remoto

#### Configuração Rápida:

```powershell
# 1. Aponte o IIS para a pasta public
Caminho físico: C:\PROJETOS\sql_api\public
Porta: 84

# 2. Inicie o Node.js
.\iniciar-node-background.ps1

# 3. Acesse
http://localhost:84/              # Dashboard
http://localhost:3000/pedidos/*   # API direta
```

**Acesso via Hostname/Rede:**
- O frontend detecta automaticamente o hostname
- URLs da API ajustam-se dinamicamente
- Suporta acesso via `localhost`, hostname ou IP
- Exemplo: `http://ipen-d57398:84/`

### Recomendações para Produção

1. **Variáveis de Ambiente**:
   - Configure credenciais via variáveis de ambiente
   - Use `dotenv` para gerenciar configurações

2. **Processo Manager**:
   - Use PM2 para gerenciamento do processo (Linux/Mac)
   - Use serviços do Windows ou Task Scheduler (Windows)
   - Configure restart automático

3. **Segurança**:
   - Configure firewall adequadamente
   - Use HTTPS em produção
   - Limite CORS a domínios específicos
   - Não exponha porta 3000 externamente (use apenas no IIS)

4. **Monitoramento**:
   - Logs do Node.js: Verificar console ou redirecionar para arquivo
   - Logs do IIS: Pasta `iisnode/` no projeto
   - Implemente health checks

### Exemplo de Configuração PM2

```bash
# Instalar PM2
npm install -g pm2

# Executar com PM2
pm2 start index.js --name "sql-api"

# Salvar configuração
pm2 save
pm2 startup
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. `ERR_CONNECTION_REFUSED` ao acessar via hostname

**Problema**: Dashboard carrega, mas dados não aparecem.

**Causa**: Node.js não está rodando ou não está escutando em todas as interfaces.

**Solução**:
```powershell
# Verifique se Node.js está rodando
tasklist | findstr node

# Se não estiver, inicie
node index.js

# Ou use o script
.\iniciar-node-background.ps1
```

#### 2. Acentuação Quebrada

**Problema**: Caracteres especiais aparecem como `Ã§Ã£o`.

**Solução**: Já corrigido com:
- `<meta charset="UTF-8">` no HTML
- Middleware UTF-8 no Express
- Configuração de encoding no SQL Server

#### 3. Erro ao Zerar Tentativas

**Problema**: "Erro ao zerar tentativas" ao clicar no botão.

**Causa**: Node.js não foi reiniciado após atualização do código.

**Solução**:
```powershell
# Pare e reinicie o Node.js
taskkill /F /IM node.exe
node index.js
```

#### 4. Favicon não Aparece

**Problema**: Erro 404 para `favicon.ico`.

**Solução**: Já corrigido! Os arquivos `favicon.svg` e `favicon.ico` estão na pasta `public/`.

**Força o reload**:
- `Ctrl + F5` no navegador
- Ou abra em modo anônimo

#### 5. IIS Mostra Código HTML como Texto

**Problema**: IIS não processa, apenas mostra o código-fonte.

**Causa**: IIS apontando para pasta errada ou falta de módulos.

**Solução**:
- IIS deve apontar para `C:\PROJETOS\sql_api\public`
- Não instalar iisnode (não é necessário nesta configuração)
- Consulte `INSTALACAO_IIS.md` para detalhes

### Logs e Diagnóstico

**Verificar Node.js:**
```powershell
# Ver processos rodando
tasklist | findstr node

# Ver porta em uso
netstat -ano | findstr :3000
```

**Testar API diretamente:**
```powershell
curl http://localhost:3000/pedidos/producaohoje
```

**Logs do IIS:**
- Diretório: `C:\PROJETOS\sql_api\iisnode\`
- Arquivo mais recente: `*-stderr-*.txt` ou `*-stdout-*.txt`

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: alberto@abjinfo.com.br
- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte este README e os guias na pasta do projeto

---

**Desenvolvido com ❤️ pela equipe BASIS Development Team**

*Última atualização: Novembro 2025*
