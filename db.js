const sql = require('mssql');

class DatabaseFacade {
  constructor() {
    this.config = {
      server: "TICOTECO",
      database: "VendasPelicano",
      user: "crsa",
      password: "cr9537",
      options: {
        trustedConnection: true,
        enableArithAbort: true,
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

      if (values && paramNames) {
        for (let i = 0; i < values.length; i++) {
          request.input(paramNames[i], values[i]);
        }
      }

      if (outputParamName) {
        request.output(outputParamName, sql.Int);
      }

      values.forEach((val, index) => {
        if (typeof val === 'undefined') {
          console.error(`Undefined value for param ${paramNames[index]}`);
        }
      });

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

  async executeTableValuedQuery(query, table, paramName, isStoredProcedure = true, outputParamName = null) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      if (table instanceof sql.Table) {
        request.input(paramName, table);
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
      console.error("Error executing table-valued query:", error);
      throw error;
    }
  }
}

module.exports = {
  DatabaseFacade,
  sql, // opcional: exportado para criação de tipos ou Table externamente
};
