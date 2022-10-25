const express = require('express');
const route = express.Router();
const server = require('./src/controller/rotas');

route.get('/', server.home);
route.post('/authentic', server.auth);
route.post('/user', server.login);
route.get('/user/:id', server.priv);

module.exports = route;