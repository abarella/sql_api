// routes/Pedidos.js
const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  async function handleRequest(res, query, values = [], paramNames = [], isStoredProcedure = false) {
    try {
      const result = await db.executeQuery(query, values, paramNames, isStoredProcedure);
      res.send(result.recordset);
    } catch (error) {
      res.status(500).send({ error: 'Erro ao executar a consulta.', detalhe: error.message });
    }
  }

  router.get("/todosPedidos", async (req, res) => {
    const query = "SELECT TOP 20 * FROM TCACP110 ORDER BY p110id DESC";
    await handleRequest(res, query);
  });

  // Adicione outras rotas aqui da mesma forma...
// Rota: Retorna pedidos por chave

router.get("/lote/:p110chve", async (req, res) => {
  const { p110chve } = req.params;
  if (!p110chve) {
    return res.status(400).send({ error: "O parâmetro 'p110chve' é obrigatório." });
  }
  const procedure = "usp_getPedidos";
  await handleRequest(res, procedure, [p110chve], ["p110chve"], true);
});


// Rota: Produção de hoje
router.get("/producaohoje", async (req, res) => {
  const query = `
    DECLARE @dia INT = DAY(GETDATE()),
            @mes INT = MONTH(GETDATE()),
            @ano INT = YEAR(GETDATE());
    SELECT 
      ROW_NUMBER() OVER (ORDER BY p110prod) AS id,
      p110prod, p110lote, p110serie, COUNT(*) AS regs
    FROM vendaspelicano..tcacp110
    WHERE p110situ = 0
      AND YEAR(p110said) = @ano
      AND MONTH(p110said) = @mes
      AND DAY(p110said) = @dia
      AND datausu_esteira IS NULL
      AND p110prod <> 'EMB.GER.'
      AND p110ccli <> '600055X'
    GROUP BY p110lote, p110prod, p110serie
    ORDER BY p110prod;
  `;
  await handleRequest(res, query);
});


// Rota: Produção de amanhã
router.get("/producaoamanha", async (req, res) => {
  const query = `
    DECLARE @dia INT = DAY(GETDATE()) + 1,
            @mes INT = MONTH(GETDATE()),
            @ano INT = YEAR(GETDATE());
    SELECT 
      p110prod, p110lote, p110serie, COUNT(*) AS regs
    FROM vendaspelicano..tcacp110
    WHERE p110situ = 0
      AND YEAR(p110said) = @ano
      AND MONTH(p110said) = @mes
      AND DAY(p110said) = @dia
      AND datausu_esteira IS NULL
      AND p110prod <> 'EMB.GER.'
      AND p110ccli <> '600055X'
    GROUP BY p110lote, p110prod, p110serie
    ORDER BY p110prod;
  `;
  await handleRequest(res, query);
});

// Rota: Notas fiscais em andamento
router.get("/nfandamento", async (req, res) => {
  const query = `
    DECLARE @dia INT = DAY(GETDATE()),
            @mes INT = MONTH(GETDATE()),
            @ano INT = YEAR(GETDATE());
    SELECT 
      a.nNF, a.emissor, tentativas, enderdest_UF, 
      case when b.p110prod <> 'EMB.GER.' then b.p110chve
        else b.p110lotekt end as p110chve,
      b.p110serie, p110atv,
      a.notafis_oid, a.chave_acesso, a.protocolo_autorizacao, dEmi, a.hSaiEnt,
      b.p110trn2, a.dest_xNome, d.p257_viatrans, b.p110ccli, c.Tot_prod,
      a.enderDest_UF
    FROM vendasInternet..TNFe_IDENTIFICACAO a
    INNER JOIN ipenfat..notafis c ON a.notafis_oid = c.notafis_oid
    LEFT JOIN vendaspelicano..TCACP110 b ON b.p110fisc = c.No_Nota
    LEFT JOIN vendaspelicano..T0257_TRANSPORTE2 d ON d.p257_viatransid = b.p257_viatransid
    WHERE 1=1
      AND protocolo_autorizacao IS NULL
      AND YEAR(dEmi) = @ano
      AND MONTH(dEmi) = @mes
      AND DAY(dEmi) = @dia
    ORDER BY a.nNF DESC;
  `;
  await handleRequest(res, query);
});



// Rota: Cobrança Blindagem (via procedure)
router.get("/cobrancablindagem", async (req, res) => {
  const procedure = "ipenfat.dbo.sp_BlindagemListaCliente";
  await handleRequest(res, procedure, [], [], true);
});

// Rota PUT: Zerar tentativas de uma NF específica
router.put("/zerartentativas/:notafis_oid", async (req, res) => {
  const { notafis_oid } = req.params;
  
  // Validação do parâmetro
  if (!notafis_oid || isNaN(notafis_oid)) {
    return res.status(400).send({ error: "O parâmetro 'notafis_oid' deve ser um número válido." });
  }

  const query = `
    UPDATE vendasInternet..TNFe_IDENTIFICACAO 
    SET tentativas = 0
    WHERE 1=1
      AND protocolo_autorizacao IS NULL
      AND notafis_oid = @notafis_oid
  `;

  try {
    const result = await db.executeQuery(query, [notafis_oid], ["notafis_oid"], false);
    
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      res.send({ 
        success: true, 
        message: `Tentativas zeradas com sucesso para o OID ${notafis_oid}`,
        rowsAffected: result.rowsAffected[0]
      });
    } else {
      res.status(404).send({ 
        error: `Nenhum registro encontrado com OID ${notafis_oid} ou já possui protocolo de autorização` 
      });
    }
  } catch (error) {
    res.status(500).send({ 
      error: 'Erro ao zerar tentativas.', 
      detalhe: error.message 
    });
  }
});

// Rota: Gravar autorização de NF
router.put("/gravarautorizacao", async (req, res) => {
  const { chave, autorizacao, dataHora } = req.body;
  
  // Validação dos parâmetros
  if (!chave || !autorizacao || !dataHora) {
    return res.status(400).send({ 
      error: "Os campos 'chave', 'autorizacao' e 'dataHora' são obrigatórios." 
    });
  }
  
  // Validação do formato da chave (44 caracteres)
  if (chave.length !== 44) {
    return res.status(400).send({ 
      error: "A chave de acesso deve ter 44 caracteres." 
    });
  }
  
  const query = "vendasInternet.dbo.PNFE_GRAVA_AUTORIZACAO";
  
  // Par�metros conforme a defini��o da procedure:
  // @recibo_numero, @protocolo_autorizacao, @data_retorno, @envio_data, 
  // @data_processamento, @envio_lote, @recibo_data, @status_nf, @chave_acesso
  const values = [
    autorizacao,           // @recibo_numero (protocolo)
    autorizacao,           // @protocolo_autorizacao (protocolo)
    dataHora,              // @data_retorno
    dataHora,              // @envio_data
    dataHora,              // @data_processamento
    chave,                 // @envio_lote (usando a chave como lote)
    dataHora,              // @recibo_data
    100,                   // @status_nf
    chave                  // @chave_acesso
  ];
  
  const paramNames = [
    "recibo_numero",
    "protocolo_autorizacao",
    "data_retorno",
    "envio_data",
    "data_processamento",
    "envio_lote",
    "recibo_data",
    "status_nf",
    "chave_acesso"
  ];
  
  // Log para debug
  console.log('?? Par�metros sendo enviados:');
  paramNames.forEach((name, index) => {
    console.log(`  @${name} = ${values[index]}`);
  });
  
  // Monta a query formatada para exibi��o
  let queryFormatada = `EXEC ${query}`;
  const paramsFormatados = paramNames.map((name, index) => `@${name} = '${values[index]}'`).join(', ');
  queryFormatada += ` ${paramsFormatados}`;
  
  try {
    const result = await db.executeQuery(
      query,
      values,
      paramNames,
      true  // É stored procedure
    );
    
    res.send({ 
      success: true, 
      message: "Autorização gravada com sucesso!",
      chave: chave,
      autorizacao: autorizacao
    });
  } catch (error) {
    // Log detalhado do erro
    console.error('? Erro ao executar procedure:', error.message);
    console.error('?? Par�metros enviados:', paramNames.map((name, index) => `@${name} = ${values[index]}`).join(', '));
    
    res.status(500).send({ 
      error: 'Erro ao gravar autoriza��o.', 
      detalhe: error.message,
      query: queryFormatada,
      parametrosEnviados: paramNames.map((name, index) => ({ nome: name, valor: values[index] }))
    });
  }
});

  return router;
};
