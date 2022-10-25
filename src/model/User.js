const mongoose = require('mongoose');

//criando o schema do banco de dados 
const DbUser = new mongoose.Schema({
    name: String,
    email: String,
    pass: String
});

//criando o model como schema inserido
const DbCad = new mongoose.model('User', DbUser);

module.exports = DbCad;