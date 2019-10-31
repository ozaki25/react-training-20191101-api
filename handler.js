const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello');
});

module.exports.hello = serverless(app);
