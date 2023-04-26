const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

try{
    // 폴더를 읽어봄 만일 없으면 에러 발생
    fs.readdirSync('uploads');
}catch(err){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다');
    // 폴더를 만듦
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cd){
            cd(null, 'uploads/');
        },
        filename(req,file,cd){
            const ext = path.extname(file.originalname);
            cd(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5*1024*1024 },
});

