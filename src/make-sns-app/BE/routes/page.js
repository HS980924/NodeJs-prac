const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next)=>{

});


router.get('/profile', isLoggedIn, (req,res) => {
    // 로그인이 되어 있다면 isLoggedIn 미들웨어에서 next()를 실행 다음 미들웨어인 (req,res) 를 실행
    res.send('내정보');
})

router.get('/join', isNotLoggedIn, (req,res) =>{
    // 로그인이 되어 있지 않다면  isNotLoggedIn 미들웨어에서 next()를 실행 다음 미들웨어인 (req,res) 를 실행
    res.send('회원가입')
})