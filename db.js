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
      },
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
        : await request.batch(query);

      if (outputParamName) {
        result = { ...result, [outputParamName]: request.parameters[outputParamName].value };
      }

      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

// ✅ Exportando a classe para poder usar com "new"
module.exports = DatabaseFacade;
