import { NextFunction, Request, Response, Router } from 'express';
import { KeyManager } from './keygenerator';
import { getUser, addUser, User, UserDB } from './dbmanager';
import { Jwt, RawToken, Token } from './jwt';

// const { spawn } = require('child_process');
const PythonShell = require('python-shell').PythonShell;
var multer  =   require('multer');
const express = require('express');
const fs = require('fs');
// const formidable = require('formidable');

export const router: Router = Router();

Jwt.setSign("HiddenWatermarkProj");

let storage_path = './uploads';

const original_storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let userid = 'anomynous'
    if (req.headers.token){
      let token = JSON.parse(req.headers.token) as Token;
      let payload = Jwt.getPayload(token);
      payload ? userid = payload.userid : null;
    }
    let path = [storage_path, userid, 'original'].join('/');
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, 'img-' + Date.now());
  }
});

const wm_storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let userid = 'anomynous'
    if (req.headers.token){
      let token = JSON.parse(req.headers.token) as Token;
      let payload = Jwt.getPayload(token);
      payload ? userid = payload.userid : null;
    }
    let path = [storage_path, userid, 'wm'].join('/');
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, 'wm-' + Date.now());
  }
});

const upload_original = multer({ storage : original_storage});
const upload_wm = multer({ storage : wm_storage});


router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  console.log('received');
  // res.header("Access-Control-Allow-Origin", "*");
});


/** 
 * Header:
 * headers{
 *  token: Token
 * }
 * body{
 *  imageUrl: string,
 *  wmUrl: string
 * }
 */
router.post('/encode', async function (req: any, res: any, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  try {
    let userid = 'anomynous'
    if (req.headers.token){
      let token = JSON.parse(req.headers.token) as Token;
      let payload = Jwt.getPayload(token);
      payload ? userid = payload.userid : null;
    }
    console.log(req.body);
    let imgPath: string = req.body.imageUrl;
    let wmPath: string = req.body.wmUrl;
    let outputPath = ['uploads', userid, 'encoded'].join('\\');
    imgPath = imgPath.substring(2);
    wmPath = wmPath.substring(2);
    console.log(imgPath);
    console.log(wmPath);
    console.log(outputPath);
    if (!fs.existsSync(outputPath)){
      fs.mkdirSync(outputPath, { recursive: true });
    }
    var options = {
      mode: 'text',
      pythonPath: 'D:\\Python3\\python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'D:\\Angular\\Final-Evaluation\\HiddenWatermark\\backend\\src\\PythonCode',
      args: [imgPath, wmPath, outputPath]
    };
    try{
      PythonShell.run('encode.py', options, function (err, results) {
        if (err) throw err;
        console.log('finished');
        console.log('results: %j', results);
        fs.readFile(results[results.length-1] + '.png', (err, data)=>{
          if (err){
            console.log(err);
            res.end('File encode error');
            return;
          }
          else{
            res.send({res: data});
            res.end('File Encoded');
          }
        })
        
      });
    }
    catch(err){
      res.end('File encoded error');
      console.log(err);
    }
  }
  catch (err) {
    res.end('File encoded error');
    return next(err);
  }
});

router.get('/decode', async function (req: Request, res: Response, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  try {
    var options = {
      mode: 'text',
      pythonPath: 'D:\\Python3\\python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'D:\\Angular\\Final-Evaluation\\HiddenWatermark\\backend\\src\\PythonCode',
      args: ['TestImage.jpg', 'bwm_TestImage.png']
    };

    PythonShell.run('decode.py', options, function (err, results) {
      if (err) throw err;
      console.log('finished');
      console.log('results: %j', results);
    });
    
  }
  catch (err) {
    return next(err);
  }
});

/*
headers:{
  userid: string
}
body:{
  original_img: file
}
*/
router.post('/upload_original', upload_original.single('original_img'), function (req: any, res: any) {
  // send "url" back
  // console.log(req);
  // let token = JSON.parse(req.headers.token);
  try{
    // let payload = Jwt.getPayload(token)
    // let userid = payload ? payload.userid : 'anomynous';
    let filepath = [req.file.destination, req.file.filename].join('/');
    fs.readFile(filepath, (err, data) => {
      if (err){
        console.log(err);
       res.end('File upload failed') 
      }
      res.send({res: filepath});
      res.end('File uploaded')
    });
    
  }catch(err){
    console.log(err);
    res.end('File upload failed');
  }
  
});

router.post('/upload_wm', upload_wm.single('wm_img'), function (req: any, res: any) {
  // send "url" back
  // let token = JSON.parse(req.headers.token);
  try{
    // let payload = Jwt.getPayload(token)
    // let userid = payload ? payload.userid : 'anomynous';
    // res.send({imgurl: [process.cwd(), 'uploads', userid, 'wm', req.file.filename].join('\\')});
    // res.end('File uploaded')
    let filepath = [req.file.destination, req.file.filename].join('/');
    fs.readFile(filepath, (err, data) => {
      if (err){
        console.log(err);
       res.end('File upload failed') 
      }
      res.send({res: filepath});
      res.end('File uploaded')
    });

  }catch(err){
    console.log(err);
    res.end('File upload failed');
  }
});

router.get('/authenticateTest', async function (req: Request, res: Response, next: NextFunction) {
  // console.log(KeyManager.getServerKey());
  // let token = KeyManager.encrypt('testtest')
  // console.log(token);
  // console.log(KeyManager.decrypt(token));
  console.log(req);
  res.send(req.body);
  res.end();
});

/* headers:
{
  iv: {iv}
  token:
  {
    oath: HiddenWatermarkProj, 
    timestamp: {timestamp}
  }
}
*/
router.post('/authenticate', async function (req: Request, res: Response, next: NextFunction) {
  let token = JSON.parse(req.headers.token.toString());
  let isVerified = Jwt.verify(token);
  if (isVerified){
    res.send({res: 'permitted'});
    return res.end('User Verified.');
  }
  res.send({res: 'denied'})
  return res.end('User Not Verified.')
});

/*
headers:
{
  username: string
  password: string
}
*/
router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
  // console.log(req.headers);
  let user = getUser(req.headers.username.toString()) as User;
  if(user){
    if (req.headers.password.toString() === user.password){
      let token: Token = Jwt.genToken(user.id, user.username, user.type);
      res.send({ token: token, type: user.type, id: user.id});
      res.end(`User ${req.headers.username} logged in`);
    }
  }
  return res.end('User Denied')
});

/*
headers:
{
  username: string
  password: string
  type: string
}
*/
router.post('/register', async function (req: Request, res: Response, next: NextFunction) {
  let user = addUser(req.headers.username.toString(), req.headers.password.toString(), req.headers.type.toString());
  if (user){
    let token = Jwt.genToken(user.id, user.username, user.type);
    res.send({ token: token, type: user.type, id: user.id});
    res.end(`User ${req.headers.username} registered and logged in`);
  }
  return res.end('User Denied')
});
