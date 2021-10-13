import { NextFunction, Request, Response, Router } from 'express';
import { KeyManager } from './keygenerator';
import { getUser, addUser, User, UserDB } from './dbmanager';
import { Jwt, Token } from './jwt';

// const { spawn } = require('child_process');
const PythonShell = require('python-shell').PythonShell;
var multer  =   require('multer');
const express = require('express');
const fs = require('fs');
// const formidable = require('formidable');

export const router: Router = Router();

Jwt.setSign("HiddenWatermarkProj");
console.log(Jwt.oath);

const original_storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let path = ['./uploads', req.headers.userid, 'original'].join('/');
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

const wm_storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let path = ['./uploads', req.headers.userid, 'wm'].join('/');
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true });
    }
    callback(null, path);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

const upload_original = multer({ storage : original_storage}).single('original_img');
const upload_wm = multer({ storage : wm_storage}).single('wm_img');


router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  console.log('received');
  // res.header("Access-Control-Allow-Origin", "*");
});

router.get('/encode', async function (req: Request, res: Response, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  try {
    var options = {
      mode: 'text',
      pythonPath: 'D:\\Python3\\python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'D:\\Angular\\Final-Evaluation\\HiddenWatermark\\backend\\src\\PythonCode',
      args: ['TestImage.jpg', 'TestSign.jpg']
    };

    PythonShell.run('encode.py', options, function (err, results) {
      if (err) throw err;
      console.log('finished');
      console.log('results: %j', results);
    });
    
  }
  catch (err) {
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

router.post('/upload_original', async function (req: Request, res: Response, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  upload_original(req,res,function(err) {
    if(err) {
        return res.end("Error uploading file." + err);
    }
    res.end("File is uploaded");
  });
  console.log('file received');
});

router.post('/upload_wm', async function (req: Request, res: Response, next: NextFunction) {
  // res.header("Access-Control-Allow-Origin", "*");
  upload_wm(req,res,function(err) {
    if(err) {
        return res.end("Error uploading file." + err);
    }
    res.end("File is uploaded");
  });
  console.log('file received');
});

router.get('/authenticateTest', async function (req: Request, res: Response, next: NextFunction) {
  console.log(KeyManager.getServerKey());
  let token = KeyManager.encrypt('testtest')
  console.log(token);
  console.log(KeyManager.decrypt(token));
  
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
  let iv = req.headers.iv.toString().split(',').reduce((acc, cur) => {
    acc.push(Number.parseInt(cur));
    return acc;
  }, []);
  let isVerified = Jwt.verify({token: req.headers.token.toString(), iv: Buffer.from(iv)});
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
      let token: Token = Jwt.genToken(user.username, user.type);
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
    let token = Jwt.genToken(user.username, user.type);
    res.send({ token: token, type: user.type, id: user.id});
    res.end(`User ${req.headers.username} registered and logged in`);
  }
  return res.end('User Denied')
});
