const express = require("express");
const router = express.Router();
const { executeQuery } = require("../db.js");


router.get("/todosPedidos", async (req, res) => {
  const query = "SELECT top 20 * FROM TCACP110 order by p110id desc ";
  const values = [];
  const paramNames = [];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(
      query,
      values,
      paramNames,
      isStoredProcedure
    );
    res.send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

/** chamando uma ddl */
/*
router.get("/Pedidos/:chave", async (req, res) => {
  const {chave} = req.params; // Pega o parâmetro da URL
    if (!chave) {
    return res.status(400).send({ error: "O parâmetro 'chave' é obrigatório." });
  }
  const query = "SELECT top 20 * FROM TCACP110 where p110chve = @chave order by p110id desc ";
  const values = [chave];
  const paramNames = ["chave"];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(
      query,
      values,
      paramNames,
      isStoredProcedure
    );
    res.send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
*/

router.get("/lote/:p110chve", async (req, res) => {
  const { p110chve } = req.params; // Pega o parâmetro da URL

  if (!p110chve) {
    return res.status(400).send({ error: "O parâmetro 'p110chve' é obrigatório." });
  }

  // Nome da procedure
  const procedureName = "usp_getPedidos";
  const values = [p110chve];
  const paramNames = ["p110chve"];
  const isStoredProcedure = true; // Indicando que é uma procedure

  try {
    const result = await executeQuery(
      procedureName,
      values,
      paramNames,
      isStoredProcedure
    );
    res.send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});



router.get("/producaohoje", async (req, res) => {
    var xquery =  "declare @dia int = day(getdate()) ";
        xquery += "declare @mes int = month(getdate()) ";
        xquery += "declare @ano int = year(getdate()) ";
        xquery += "select ROW_NUMBER() OVER (ORDER BY p110prod) AS id, p110prod, p110lote, p110serie, count(*) regs ";
        xquery += "from vendaspelicano..tcacp110 ";
        xquery += "where 1=1 ";
        xquery += "and p110situ = 0 ";
        xquery += "and year(p110said) = @ano ";
        xquery += "and month(p110said) = @mes ";
        xquery += "and day(p110said) = @dia ";
        xquery += "and datausu_esteira is  null ";
        xquery += "and p110prod <> 'EMB.GER.'  ";
        xquery += "and p110ccli <> '600055X' ";
        xquery += "group by p110lote, p110prod,p110serie ";
        xquery += "order by p110prod ";
  const query = xquery;
  const values = [];
  const paramNames = [];
  const isStoredProcedure = false;
  try {
    const result = await executeQuery(
      query,
      values,
      paramNames,
      isStoredProcedure
    );
    res.send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/producaoamanha", async (req, res) => {
  var xquery =  "declare @dia int = day(getdate())+1 ";
      xquery += "declare @mes int = month(getdate()) ";
      xquery += "declare @ano int = year(getdate()) ";
      xquery += "select p110prod, p110lote, p110serie, count(*) regs ";
      xquery += "from vendaspelicano..tcacp110 ";
      xquery += "where 1=1 ";
      xquery += "and p110situ = 0 ";
      xquery += "and year(p110said) = @ano ";
      xquery += "and month(p110said) = @mes ";
      xquery += "and day(p110said) = @dia ";
      xquery += "and datausu_esteira is  null ";
      xquery += "and p110prod <> 'EMB.GER.'  ";
      xquery += "and p110ccli <> '600055X' ";
      xquery += "group by p110lote, p110prod,p110serie ";
      xquery += "order by p110prod ";
const query = xquery;
const values = [];
const paramNames = [];
const isStoredProcedure = false;
try {
  const result = await executeQuery(
    query,
    values,
    paramNames,
    isStoredProcedure
  );
  res.send(result.recordset);
} catch (error) {
  console.error(error);
  res.status(500).send(error);
}
});




router.get("/nfandamento", async (req, res) => {
  var xquery =  "declare @dia int = day(getdate()) ";
      xquery += "declare @mes int = month(getdate()) ";
      xquery += "declare @ano int = year(getdate()) ";
      xquery += "select a.nNF, a.emissor,tentativas, enderdest_UF,b.p110chve, b.p110serie, p110atv, ";
      xquery += "a.notafis_oid, a.chave_acesso, a.protocolo_autorizacao, dEmi, a.hSaiEnt, ";
      xquery += "b.p110trn2, a.dest_xNome, d.p257_viatrans, b.p110ccli, c.Tot_prod ";
      xquery += ",a.enderDest_UF ";
      xquery += "from vendasInternet..TNFe_IDENTIFICACAO a ";
      xquery += "inner join ipenfat..notafis             c on a.notafis_oid = c.notafis_oid ";
      xquery += "left join vendasPelicano..TCACP110      b on b.p110fisc    = c.No_Nota ";
      xquery += "left join vendasPelicano..T0257_TRANSPORTE2 d on d.p257_viatransid = b.p257_viatransid ";
      xquery += "where 1=1 ";
      xquery += "and protocolo_autorizacao is null ";
      xquery += "and year(dEmi)  = @ano	 ";
      xquery += "and month(dEmi) = @mes ";
      xquery += "and day(dEmi)   = @dia ";
      xquery += "order by a.nNF desc ";
const query = xquery;
const values = [];
const paramNames = [];
const isStoredProcedure = false;
try {
  const result = await executeQuery(
    query,
    values,
    paramNames,
    isStoredProcedure
  );
  res.send(result.recordset);
} catch (error) {
  console.error(error);
  res.status(500).send(error);
}
});


router.get("/cobrancablindagem", async (req, res) => {

  // Nome da procedure
  const procedureName = "ipenfat.dbo.sp_BlindagemListaCliente";
  const isStoredProcedure = true; // Indicando que é uma procedure
  const values = [];
  const paramNames = [];
  try {
    const result = await executeQuery(
      procedureName,
      values,
      paramNames,
      isStoredProcedure
    );
    
    res.send(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});



module.exports = { router };