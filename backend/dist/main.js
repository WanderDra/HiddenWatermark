"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// import * as cors from 'cors';
const bodyParser = require("body-parser");
// const bearerToken = require('express-bearer-token');
const controllers_1 = require("./controllers");
const keygenerator_1 = require("./keygenerator");
// import {oktaAuth} from './auth'
const boot = new Promise((res, rej) => {
    try {
        res(keygenerator_1.KeyManager.genKey
            .then(() => {
            console.log("Key Generated.");
        })
            .catch(err => {
            console.log(err);
            rej(err);
        }));
    }
    catch (err) {
        console.log(err);
        rej(err);
    }
})
    .then(() => {
    // Jwt.setSign("HiddenWatermarkProj");
    // console.log(Jwt.oath);
    const app = express()
        // .use(cors())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: true }))
        // .use(bearerToken())
        // .use(oktaAuth)
        .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "userid, password, username, type, token, iv, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    })
        .use(controllers_1.router);
    app.listen(3000, () => {
        return console.log('My Node App listening on port 3000');
    });
})
    .catch((err) => {
    console.log(err);
});
// KeyManager.genKey
//   .then(()=>{
//     console.log("Key Generated.")
//   })
//   .then(() => {
//       const app = express()
//     // .use(cors())
//     // .use(bodyParser.json())
//     // .use(bearerToken())
//     // .use(oktaAuth)
//     .use(function(req, res, next) {
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "userid, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
//       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//       next();
//     })
//     .use(productRouter);
//   app.listen(3000, () => {
//     return console.log('My Node App listening on port 3000');
//   });
// });
