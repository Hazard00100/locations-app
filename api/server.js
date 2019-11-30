/**
 * @auth: tpt2213@gmail.com
 * @data: 05/31/2018
 * @explain: init web api server and socket io
 * @contact: Any question can send an email to me
*/

require('dotenv').config();
const express             = require('express');
const app                 = express();
const port                = process.env.DEV_PORT || 3000;
const bodyParser          = require('body-parser');
const users               = require('./routes/users');
const locations           = require('./routes/locations');
const { socketInit }      = require('./3rdParty/Socket/index');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

app.use('/', users);
app.use('/', locations);

const webServer = app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log('Web server listening at http://%s:%d', 'localhost', port)
});

socketInit(webServer);