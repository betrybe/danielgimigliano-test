const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routers');

const app = express();

app.use(bodyParser.json());
app.use(router);
app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
