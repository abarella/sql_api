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
- **Produção do Próximo Dia**: Planejamento de produção para o dia seguinte
- **Agrupamento por Lote/Série**: Organização inteligente dos dados de produção
- **Contadores Automáticos**: Quantidades e registros em tempo real

### 📄 Gestão de Notas Fiscais
- **Notas em Andamento**: Monitoramento de NFs que estão sendo processadas
- **Status de Autorização**: Acompanhamento do protocolo de autorização
- **Informações de Transporte**: Dados de transportadoras e destinos
- **Rastreamento por Chave**: Busca detalhada por chave de acesso

### 🔍 Consultas Avançadas
- **Busca por Lote**: Consulta específica via stored procedure
- **Filtros Automáticos**: Exclusão de registros não relevantes
- **Dados Consolidados**: Informações agregadas e organizadas

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

| Método | Endpoint | Descrição | Parâmetros |
|--------|----------|-----------|------------|
| `GET` | `/pedidos/todosPedidos` | Lista os últimos 20 pedidos | - |
| `GET` | `/pedidos/lote/:p110chve` | Busca pedidos por chave específica | `p110chve` (string) |
| `GET` | `/pedidos/producaohoje` | Produção do dia atual | - |
| `GET` | `/pedidos/producaoamanha` | Produção do próximo dia | - |
| `GET` | `/pedidos/nfandamento` | Notas fiscais em processamento | - |
| `GET` | `/pedidos/cobrancablindagem` | Lista clientes para cobrança | - |

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
    "chave_acesso": "35240112345678000123550010000123451234567890"
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

1. **📈 Produção Hoje**
   - Lista produtos em produção
   - Mostra lotes, séries e quantidades
   - Numeração automática

2. **📋 Notas Fiscais Agora**
   - Status de processamento
   - Informações de transporte
   - Chaves de acesso

3. **📅 Produção Amanhã**
   - Planejamento do próximo dia
   - Visão antecipada da produção

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

- **`index.js`**: Servidor Express principal com configuração de middlewares
- **`db.js`**: Classe DatabaseFacade para abstração do banco de dados
- **`routes/Pedidos.js`**: Endpoints organizados para consultas de pedidos
- **`public/index.html`**: Interface web com tabelas dinâmicas
- **`public/style.css`**: Estilos customizados para o dashboard

## 🔧 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em modo produção
npm start

# Verificar dependências
npm audit
```

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
