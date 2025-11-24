// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const DatabaseFacade = require('./db'); // 👈 importa a classe
const db = new DatabaseFacade();        // 👈 cria a instância

const pedidosRoutes = require("./routes/Pedidos")(db); // 👈 passa a instância para as rotas

const app = express();
// Use a porta do ambiente (iisnode) ou 3000 para desenvolvimento local
const port = process.env.PORT || 3000;

// Middleware para charset UTF-8 em todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

db.connect()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch(() => {});

app.use(express.static('public'));
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

// Escuta em todas as interfaces de rede (0.0.0.0)
// Isso permite acesso via localhost, IP local e hostname
app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando na porta ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Acessível via:`);
  console.log(`  - http://localhost:${port}`);
  console.log(`  - http://${require('os').hostname()}:${port}`);
});
