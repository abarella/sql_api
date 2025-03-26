
const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const cors = require('cors');
const bodyParser = require('body-parser');
const {connect} = require('./db.js')
const pedidosRoutes = require("./routes/Pedidos.js");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

connect()
    .then((connection)=>{
        console.log("Conectado no database");
    })
    .catch((error) =>{
        console.log("Erro connect database");
        console.log(error);
    })


app.use(express.static('public'));
app.use("/pedidos", pedidosRoutes.router);


app.get('/', (req, res)=>{
    //res.send('<h1>Olá API</h1>')
    res.sendFile(path.join(__dirname, 'public','index.html'));
})

app.listen(port, () => {
    console.log(`api rodando na porta ${port}`)
})