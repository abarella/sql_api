// index.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const DatabaseFacade = require('./db'); // 👈 importa a classe
const db = new DatabaseFacade();        // 👈 cria a instância

const pedidosRoutes = require("./routes/Pedidos")(db); // 👈 passa a instância para as rotas

const app = express();
// Use a porta do ambiente (iisnode) ou 3000 para desenvolvimento local
const port = process.env.PORT || 3000;

// Configura Express para confiar em proxies (importante para IIS)
app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

db.connect()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch(() => {});

// Servir index.html na raiz - DEVE VIR ANTES do express.static
app.get('/', (req, res) => {
  try {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(htmlContent);
  } catch (error) {
    res.status(500).send('Erro ao carregar a página');
  }
});

// Servir arquivos estáticos da pasta public (CSS, JS, imagens, etc.)
app.use(express.static('public'));

// Rotas de API
app.use("/pedidos", pedidosRoutes);

// 🧪 Endpoint de teste específico para IIS
app.get("/test-iis", async (req, res) => {
  try {
    const testIIS = require('./iis-test');
    
    // Capturar logs
    const originalConsoleLog = console.log;
    let logs = [];
    
    console.log = function(...args) {
      logs.push(args.join(' '));
      originalConsoleLog.apply(console, args);
    };
    
    await testIIS();
    
    // Restaurar console
    console.log = originalConsoleLog;
    
    res.json({
      success: true,
      message: "Teste de conectividade IIS executado com sucesso",
      logs: logs,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        uptime: process.uptime(),
        user: process.env.USERNAME || process.env.USER,
        computername: process.env.COMPUTERNAME,
        iisNode: process.env.IISNODE_VERSION || 'Não detectado'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        user: process.env.USERNAME || process.env.USER
      }
    });
  }
});

// 🔍 Endpoint simples para testar se a API está respondendo
app.get("/api/status", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "API SQL está funcionando",
    environment: process.env.NODE_ENV || 'development',
    version: "1.0.0"
  });
});

// Endpoint para obter o nome do usuario logado
app.get("/api/usuario", (req, res) => {
  let username = null;
  let maquinaIdentificada = null;
  
  // Obtem o hostname da URL que o cliente esta acessando
  const hostname = req.headers['host'] ? req.headers['host'].split(':')[0].toUpperCase() : null;
  
  // Obtem o IP real do cliente (considera proxies e IIS)
  // No IIS, o iisnode pode nao passar o IP diretamente, entao tentamos varias fontes
  let clientIP = null;
  
  // 1. Tenta headers que o IIS pode passar (configurados no web.config)
  if (req.headers['x-real-ip']) {
    clientIP = req.headers['x-real-ip'];
  } else if (req.headers['x-forwarded-for']) {
    clientIP = req.headers['x-forwarded-for'].split(',')[0].trim();
  }
  
  // 2. Tenta variaveis de ambiente do IIS (iisnode pode passar aqui)
  if (!clientIP) {
    clientIP = process.env.REMOTE_ADDR || process.env.HTTP_X_FORWARDED_FOR || process.env.HTTP_X_REAL_IP;
  }
  
  // 3. Tenta propriedades do request (pode nao funcionar no IIS)
  if (!clientIP) {
    if (req.socket && req.socket.remoteAddress) {
      clientIP = req.socket.remoteAddress;
    } else if (req.connection && req.connection.remoteAddress) {
      clientIP = req.connection.remoteAddress;
    } else if (req.ip) {
      clientIP = req.ip;
    }
  }
  
  // Remove prefixo IPv6 mapeado para IPv4 (::ffff:)
  if (clientIP && clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.replace('::ffff:', '');
  }
  
  // Remove porta se presente (ex: "192.168.1.1:12345" -> "192.168.1.1")
  if (clientIP && clientIP.includes(':') && !clientIP.startsWith('::')) {
    const parts = clientIP.split(':');
    if (parts.length === 2 && parts[1].match(/^\d+$/)) {
      clientIP = parts[0];
    }
  }
  
  // Se ainda nao tem IP valido, usa desconhecido
  if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === 'localhost' || clientIP === 'undefined') {
    clientIP = 'Desconhecido';
  }
  
  // Tenta obter nome da maquina via Windows Authentication (IIS)
  // Verifica varios headers possiveis do IIS/Windows Auth
  let clientMachineName = null;
  const logonUser = req.headers['x-iisnode-logon-user'] || 
                    req.headers['x-iis-windows-auth-user'] ||
                    req.headers['x-logon-user'] ||
                    req.headers['logon-user'] ||
                    req.headers['remote-user'];
  
  if (logonUser) {
    // Formato: DOMINIO\COMPUTADOR$ ou DOMINIO\usuario
    const parts = logonUser.split('\\');
    if (parts.length === 2) {
      const machineOrUser = parts[1];
      // Se termina com $, e o nome da maquina
      if (machineOrUser.endsWith('$')) {
        clientMachineName = machineOrUser.replace('$', '').toUpperCase();
      }
    }
  }
  
  try {
    // Tenta ler o arquivo de mapeamento
    const usuariosPath = path.join(__dirname, 'usuarios.json');
    if (fs.existsSync(usuariosPath)) {
      const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
      const mapeamento = usuariosData.mapeamento || {};
      
      // Identifica a maquina do CLIENTE (quem esta acessando)
      // 1. PRIORIDADE: Nome da maquina enviado pelo cliente via header
      const clientMachineHeader = req.headers['x-client-machine'];
      if (clientMachineHeader && clientMachineHeader !== 'Desconhecido') {
        const machineUpper = clientMachineHeader.toUpperCase();
        if (mapeamento[machineUpper]) {
          username = mapeamento[machineUpper];
          maquinaIdentificada = machineUpper;
        }
      }
      
      // 2. Tenta pelo nome da maquina do cliente (via Windows Auth)
      if (!username && clientMachineName && mapeamento[clientMachineName]) {
        username = mapeamento[clientMachineName];
        maquinaIdentificada = clientMachineName;
      }
      
      // 3. Tenta pelo IP do cliente
      if (!username && clientIP && clientIP !== 'Desconhecido') {
        // Procura o IP no mapeamento (exato)
        if (mapeamento[clientIP]) {
          username = mapeamento[clientIP];
          maquinaIdentificada = clientIP;
        }
      }
      
      // 4. Tenta pelo hostname da URL (servidor - fallback)
      if (!username && hostname && mapeamento[hostname]) {
        username = mapeamento[hostname];
        maquinaIdentificada = hostname;
      }
    }
  } catch (error) {
    // Erro ao ler usuarios.json - ignora silenciosamente
  }
  
  // Se nao encontrou no mapeamento, tenta obter de outras fontes
  if (!username) {
    // Verifica headers
    if (req.headers['x-iis-windows-auth-user']) {
      username = req.headers['x-iis-windows-auth-user'];
    } else if (req.headers['x-forwarded-user']) {
      username = req.headers['x-forwarded-user'];
    } else if (req.connection && req.connection.remoteUser) {
      username = req.connection.remoteUser;
    } else if (req.user) {
      username = req.user;
    }
    
    // Verifica variaveis de ambiente
    if (!username) {
      username = process.env.REMOTE_USER || process.env.AUTH_USER || process.env.LOGON_USER;
    }
    
    // Remove o dominio se presente (ex: DOMINIO\usuario -> usuario)
    if (username && username.includes('\\')) {
      username = username.split('\\').pop();
    }
    
    // Se nao encontrou, usa o usuario do processo como fallback
    // MAS so se nao for conta de servico (termina com $)
    if (!username) {
      const serverUser = process.env.USERNAME || process.env.USER;
      if (serverUser && !serverUser.endsWith('$')) {
        username = serverUser;
      } else {
        username = 'Usuario';
      }
    }
  }
  
  
  res.json({
    usuario: username,
    maquina: maquinaIdentificada || 'Nao mapeada',
    ipCliente: clientIP,
    hostname: hostname,
    nomeMaquinaCliente: clientMachineName,
    debug: {
      headers: {
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-iisnode-logon-user': req.headers['x-iisnode-logon-user'],
        'x-iis-windows-auth-user': req.headers['x-iis-windows-auth-user'],
        'x-logon-user': req.headers['x-logon-user'],
        'host': req.headers['host']
      },
      reqIp: req.ip,
      socketRemoteAddress: req.socket?.remoteAddress,
      logonUser: logonUser
    },
    timestamp: new Date().toISOString()
  });
});

// Escuta em todas as interfaces de rede (0.0.0.0)
// Isso permite acesso via localhost, IP local e hostname
app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Acessível via:`);
  console.log(`  - http://localhost:${port}`);
  console.log(`  - http://${require('os').hostname()}:${port}`);
});
