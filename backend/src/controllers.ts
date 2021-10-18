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
const resolve = require('path').resolve

export const router: Router = Router();

Jwt.setSign("HiddenWatermarkProj");

let storage_path = './uploads';

const checkUser = (req: Request, res: Response) => {
  let token: Token = JSON.parse(req.headers.token.toString());
  if (!Jwt.verify(token)){
    res.send('User Error.');
    res.sendStatus(401);
    res.end('User Error.');
    return false;
  }
  let payload = Jwt.getPayload(token);
  if (payload.userid !== req.params.userid){
    res.send('User Error.');
    res.sendStatus(401);
    res.end('User Error.');
    return false;
  }
  return true;
}

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

const encoded_storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let userid = 'anomynous'
    if (req.headers.token){
      let token = JSON.parse(req.headers.token) as Token;
      let payload = Jwt.getPayload(token);
      payload ? userid = payload.userid : null;
    }
    let path = [storage_path, userid, 'encoded'].join('/');
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, 'bwm-' + Date.now());
  }
});

const upload_original = multer({ storage : original_storage});
const upload_wm = multer({ storage : wm_storage});
const upload_encoded = multer({storage : encoded_storage});


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
    // console.log(imgPath);
    // console.log(wmPath);
    // console.log(outputPath);
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
      res.end('File encode error');
      console.log(err);
    }
  }
  catch (err) {
    res.end('File encode error');
    return next(err);
  }
});

router.post('/decode', async function (req: any, res: any, next: NextFunction) {
  try {
    let userid = 'anomynous'
    if (req.headers.token){
      let token = JSON.parse(req.headers.token) as Token;
      let payload = Jwt.getPayload(token);
      payload ? userid = payload.userid : null;
    }
    console.log(req.body);
    let originalUrl: string = req.body.originalUrl;
    let encodedUrl: string = req.body.encodedUrl;
    let outputPath = ['uploads', userid, 'decoded'].join('\\');
    originalUrl = originalUrl.substring(2);
    encodedUrl = encodedUrl.substring(2);
    // console.log(imgPath);
    // console.log(wmPath);
    // console.log(outputPath);
    if (!fs.existsSync(outputPath)){
      fs.mkdirSync(outputPath, { recursive: true });
    }
    var options = {
      mode: 'text',
      pythonPath: 'D:\\Python3\\python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'D:\\Angular\\Final-Evaluation\\HiddenWatermark\\backend\\src\\PythonCode',
      args: [originalUrl, encodedUrl, outputPath]
    };
    try{
      PythonShell.run('decode.py', options, function (err, results) {
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
            res.end('File Decoded');
          }
        })
        
      });
    }
    catch(err){
      res.end('File decode error');
      console.log(err);
    }
  }
  catch (err) {
    res.end('File decode error');
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

router.post('/upload_encoded', upload_encoded.single('encoded_img'), function (req: any, res: any) {
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
router.get('/authenticate', async function (req: Request, res: Response, next: NextFunction) {
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
router.get('/check', function(req: any, res: Response, next: NextFunction) {
  // Frequency check can be done here.
  let user = getUser(req.headers.username.toString()) as User;
  if (user){
    if (req.headers.password.toString() === user.password){
      res.send({res: 'pass'});
    } else{
      res.send({res: 'password'});
    }
  }
  else{
    res.send({res: 'username'});
  }
  res.end();
})

/*
headers:
{
  username: string
  password: string
}
*/
router.get('/login', async function (req: Request, res: Response, next: NextFunction) {
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
router.get('/register', async function (req: Request, res: Response, next: NextFunction) {
  let user = addUser(req.headers.username.toString(), req.headers.password.toString(), req.headers.type.toString());
  if (user){
    let token = Jwt.genToken(user.id, user.username, user.type);
    res.send({ token: token, type: user.type, id: user.id});
    res.end(`User ${req.headers.username} registered and logged in`);
  }
  return res.end('User Denied')
});

/**
 * headers:
 * {
 *  token: Token
 * }
 */
router.get('/album/:type/:userid', function(req: any, res: Response, next: NextFunction){
  if (checkUser(req, res)){
    // let testpath = 'D:/Angular/Final-Evaluation/HiddenWatermark/backend/uploads'
    fs.readdir([storage_path, req.params.userid, req.params.type].join('/'), (err: Error, files: string[])=>{
      // res.sendFile([testpath, req.params.userid, req.params.type, files[0]].join('/'));
      res.send(files);
      res.end('Files read successfully.');
    })
  }
});

/**
 * headers:
 * {
 *  token: Token
 * }
 */
router.get('/album/:type/:userid/:filename', function(req: any, res: Response, next: NextFunction){
  // console.log(req.headers.token);
  if (checkUser(req, res)){
    // console.log(resolve([storage_path, req.params.userid, req.params.type, req.params.filename].join('/')));
    res.sendFile(resolve([storage_path, req.params.userid, req.params.type, req.params.filename].join('/')), (err: Error)=>{
      if (err){
        console.log(err);
        res.sendStatus(403);
        res.end('File transfer error.');
        next(err);
      } else{
        res.end('File transfer successfully');
      }
    });
  }
});

router.get('/album/remove/:type/:userid/:filename', function(req: any, res: Response, next: NextFunction){
  if(checkUser(req, res)){
    let path = resolve([storage_path, req.params.userid, req.params.type, req.params.filename].join('/'));
    fs.stat(path, (err, stats) => {
      if (err){
        console.log('No file founded.')
        res.send('Error');
        res.end('No file founded.');
        return;
      }
      fs.unlink(path, (err)=>{
        if(err){
          console.log('Delete failed.')
          res.send('Error');
          res.end('Delete failed.');
        }else{
          res.send('Success');
          res.end('Delete successfully.');
        }
      })
    })
  }

})
