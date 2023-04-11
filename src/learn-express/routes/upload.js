const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done){
            done(null,'uploads/');
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname);
            done(null,path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits : {fileSize: 5 * 1024 * 1024},
});


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../multipart.html'));
});

router.post('/',upload.single('image'), (req,res)=>{
    console.log(req.file, req.body);
    res.send('Ok');
})

module.exports = router;