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
| `GET` | `/pedidos/nfandamento` | Notas fiscais em processamento | `nNF`, `emissor`, `tentativas`, `enderdest_UF`, `p110chve`, `p110serie`, `p110atv`, `chave_acesso`, `p110trn2` (transportadora), e mais |
| `GET` | `/pedidos/cobrancablindagem` | Lista clientes para cobrança via stored procedure | Resultado de `sp_BlindagemListaCliente` |

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

### Seções do Dashboard

1. **📈 Produção Hoje (Total: X)**
   - Lista produtos em produção no dia atual
   - Colunas: ID, Produto, Lote, Série, Qtde
   - **Contador no título**: Soma total de todas as quantidades
   - Numeração automática de registros
   - Atualização a cada 5 segundos

2. **📋 Notas Fiscais Agora (X)**
   - Status de processamento de NFs
   - Colunas: nNf, Emissor, Tentativas, UF, Chave, Serie, Atividade, Chave NF, **Transportadora**
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

### Features da Interface
- **Contadores Dinâmicos**: Todos os títulos exibem quantidades/somas atualizadas
- **Auto-refresh**: Dados atualizados automaticamente a cada 5 segundos
- **DataTables**: Tabelas interativas com ordenação e busca
- **Design Responsivo**: Adaptável a diferentes resoluções

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
│   ├── 📄 index.html        # Interface principal
│   └── 📄 style.css         # Estilos CSS
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

### Recomendações para Produção

1. **Variáveis de Ambiente**:
   - Configure credenciais via variáveis de ambiente
   - Use `dotenv` para gerenciar configurações

2. **Processo Manager**:
   - Use PM2 para gerenciamento do processo
   - Configure restart automático

3. **Proxy Reverso**:
   - Configure Nginx como proxy
   - Implemente HTTPS

4. **Monitoramento**:
   - Adicione logs estruturados
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

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: alberto@abjinfo.com.br
- **Issues**: Abra uma issue no GitHub
- **Documentação**: Consulte este README

---

**Desenvolvido com ❤️ pela equipe BASIS Development Team**
