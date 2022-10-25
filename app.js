//connection string
require("dotenv").config();

//dependency
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const rotas = require('./routes');

//conectando com o mongoDB atlas

mongoose.connect(process.env.CONNECT).then(()=> {
    console.log('conectado com sucesso');

    //porta de acesso
    app.listen(3000);

}).catch((er)=> console.log(er));

// get Json / middlewares
app.use(express.urlencoded({extended: true})); //config leitura json
app.use(express.json());
app.use(rotas); //utilizando as rotas 
