const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./event.js');

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'user',
    password: 'hashhard',
    database: 'codePdv'
});

// Conectar ao banco de dados
connection.connect();

const port = process.env.PORT || 3000;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});