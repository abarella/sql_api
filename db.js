// db.js
const sql = require('mssql');

class DatabaseFacade {
  constructor() {
    this.config = {
      server: "UIRAPURU",
      database: "VendasPelicano",
      user: "crsa",
      password: "cr9537",
      options: {
        trustedConnection: true,
        enableArithAbort: false,
        trustServerCertificate: true,
        encrypt: false,
        // Garante que os dados venham com a codificação correta
        useUTC: false,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };
  }

  async connect() {
    return sql.connect(this.config);
  }

  async executeQuery(query, values = [], paramNames = [], isStoredProcedure = true, outputParamName = null) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      for (let i = 0; i < values.length; i++) {
        request.input(paramNames[i], values[i]);
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

      return result;
    } catch (error) {
      throw error;
    }
  }
}

// ✅ Exportando a classe para poder usar com "new"
module.exports = DatabaseFacade;
