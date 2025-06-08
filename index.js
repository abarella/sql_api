// index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const DatabaseFacade = require('./db'); // 👈 importa a classe
const db = new DatabaseFacade();        // 👈 cria a instância

const pedidosRoutes = require("./routes/Pedidos")(db); // 👈 passa a instância para as rotas

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

db.connect()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

app.use(express.static('public'));
app.use("/pedidos", pedidosRoutes);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
