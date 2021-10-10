import * as express from 'express';
// import * as cors from 'cors';
// import * as bodyParser from 'body-parser';
// const bearerToken = require('express-bearer-token');
import {router as productRouter} from './controller'
// import {oktaAuth} from './auth'

const app = express()
  // .use(cors())
  // .use(bodyParser.json())
  // .use(bearerToken())
  // .use(oktaAuth)
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "userid, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  })
  .use(productRouter);

app.listen(3000, () => {
  return console.log('My Node App listening on port 3000');
});