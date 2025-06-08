// routes/Pedidos.js
const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  async function handleRequest(res, query, values = [], paramNames = [], isStoredProcedure = false) {
    try {
      const result = await db.executeQuery(query, values, paramNames, isStoredProcedure);
      res.send(result.recordset);
    } catch (error) {
      console.error(error);
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
      a.nNF, a.emissor, tentativas, enderdest_UF, b.p110chve, b.p110serie, p110atv,
      a.notafis_oid, a.chave_acesso, a.protocolo_autorizacao, dEmi, a.hSaiEnt,
      b.p110trn2, a.dest_xNome, d.p257_viatrans, b.p110ccli, c.Tot_prod,
      a.enderDest_UF
    FROM vendasInternet..TNFe_IDENTIFICACAO a
    INNER JOIN ipenfat..notafis c ON a.notafis_oid = c.notafis_oid
    LEFT JOIN vendaspelicano..TCACP110 b ON b.p110fisc = c.No_Nota
    LEFT JOIN vendaspelicano..T0257_TRANSPORTE2 d ON d.p257_viatransid = b.p257_viatransid
    WHERE protocolo_autorizacao IS NULL
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

  return router;
};
