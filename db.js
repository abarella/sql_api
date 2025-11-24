// db.js
const sql = require('mssql');

class DatabaseFacade {
  constructor() {
    this.pool = null;
    this.config = {
      server: process.env.DB_SERVER || "UIRAPURU",
      database: process.env.DB_DATABASE || "VendasPelicano",
      user: process.env.DB_USER || "crsa",
      password: process.env.DB_PASSWORD || "cr9537",
      port: process.env.DB_PORT || 1433,
      options: {
        // 🔧 CONFIGURAÇÃO ESPECÍFICA PARA IIS
        trustedConnection: false, // 👈 MUDANÇA CRÍTICA PARA IIS
        enableArithAbort: false,
        trustServerCertificate: true,
        encrypt: process.env.DB_ENCRYPT === 'true' || false,
        useUTC: false,
        requestTimeout: 30000,
        connectionTimeout: 30000,
        abortTransactionOnError: true,
        // Configurações adicionais para IIS - CORRIGIDAS
        isolationLevel: sql.ISOLATION_LEVEL.READ_COMMITTED, // 👈 CORREÇÃO
        readOnlyIntent: false
      },
      pool: {
        max: 10,
        min: 1,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200
      }
    };
    
    // Log de configuração (sem senha) - mais detalhado para IIS
    const configLog = {
      server: this.config.server,
      database: this.config.database,
      user: this.config.user,
      port: this.config.port,
      trustedConnection: this.config.options.trustedConnection,
      encrypt: this.config.options.encrypt,
      // Informações do ambiente para debug
      nodeEnv: process.env.NODE_ENV,
      userProfile: process.env.USERPROFILE,
      computername: process.env.COMPUTERNAME
    };
    
    console.log('🔧 Configuração do banco:', configLog);
    
    // Log específico para identificar se está rodando no IIS
    if (process.env.SERVER_SOFTWARE && process.env.SERVER_SOFTWARE.includes('IIS')) {
      console.log('🌐 Detectado ambiente IIS');
    } else if (process.env.IISNODE_VERSION) {
      console.log('🌐 Detectado IISNode versão:', process.env.IISNODE_VERSION);
    }
  }

  async connect() {
    try {
      if (this.pool && this.pool.connected) {
        return this.pool;
      }
      
      console.log('🔄 Tentando conectar ao SQL Server...');
      this.pool = await sql.connect(this.config);
      
      this.pool.on('error', err => {
        console.error('❌ Erro no pool de conexões:', err);
        this.pool = null;
      });
      
      console.log('✅ Conectado ao SQL Server com sucesso');
      return this.pool;
    } catch (error) {
      console.error('❌ Erro ao conectar ao SQL Server:', error.message);
      this.pool = null;
      throw error;
    }
  }

  async executeQuery(query, values = [], paramNames = [], isStoredProcedure = true, outputParamName = null) {
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🔍 Executando ${isStoredProcedure ? 'procedure' : 'query'}: ${query}`);
        
        const pool = await this.connect();
        const request = pool.request();

        // Configurar timeout via options do request (compatível com todas as versões)
        if (request.timeout) {
          request.timeout(25000);
        }

        for (let i = 0; i < values.length; i++) {
          request.input(paramNames[i], values[i]);
          console.log(`📝 Parâmetro ${paramNames[i]}: ${values[i]}`);
        }

        if (outputParamName) {
          request.output(outputParamName, sql.Int);
        }

        let result = isStoredProcedure
          ? await request.execute(query)
          : await request.query(query);

        if (outputParamName) {
          result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
        }
        
        const executionTime = Date.now() - startTime;
        console.log(`✅ Query executada com sucesso em ${executionTime}ms`);
        
        return result;
      } catch (error) {
        retryCount++;
        console.error(`❌ Erro na tentativa ${retryCount}/${maxRetries}:`, error.message);
        
        // Se for erro de conexão, limpa o pool para forçar reconexão
        if (error.code === 'ECONNRESET' || error.code === 'ETIMEOUT' || error.code === 'ENOTFOUND') {
          this.pool = null;
          if (retryCount < maxRetries) {
            console.log(`🔄 Tentando reconectar em ${retryCount * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
            continue;
          }
        }
        
        if (retryCount >= maxRetries) {
          console.error('❌ Falha após todas as tentativas de reconexão');
          throw error;
        }
      }
    }
  }
  
  // Método para fechar conexões graciosamente
  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        console.log('🔒 Conexões do pool fechadas');
      }
    } catch (error) {
      console.error('❌ Erro ao fechar conexões:', error.message);
    }
  }
}

// ✅ Exportando a classe para poder usar com "new"
module.exports = DatabaseFacade;
