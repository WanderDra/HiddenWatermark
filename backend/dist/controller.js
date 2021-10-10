"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
// const { spawn } = require('child_process');
const PythonShell = require('python-shell').PythonShell;
var multer = require('multer');
const express = require('express');
const fs = require('fs');
// const formidable = require('formidable');
exports.router = express_1.Router();
// const app = express();
// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "userid, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   next();
// });
const original_storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = ['./uploads', req.headers.userid, 'original'].join('/');
        if (!fs.existsSync(path)) {
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
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        callback(null, path);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
const upload_original = multer({ storage: original_storage }).single('original_img');
const upload_wm = multer({ storage: wm_storage }).single('wm_img');
exports.router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('received');
        // res.header("Access-Control-Allow-Origin", "*");
    });
});
exports.router.get('/encode', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
                if (err)
                    throw err;
                console.log('finished');
                console.log('results: %j', results);
            });
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.get('/decode', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
                if (err)
                    throw err;
                console.log('finished');
                console.log('results: %j', results);
            });
        }
        catch (err) {
            return next(err);
        }
    });
});
exports.router.post('/upload_original', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // res.header("Access-Control-Allow-Origin", "*");
        upload_original(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file." + err);
            }
            res.end("File is uploaded");
        });
        console.log('file received');
    });
});
exports.router.post('/upload_wm', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // res.header("Access-Control-Allow-Origin", "*");
        upload_wm(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file." + err);
            }
            res.end("File is uploaded");
        });
        console.log('file received');
    });
});
