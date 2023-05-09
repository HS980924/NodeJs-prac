const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


// 회원가입
router.post('/join', isNotLoggedIn, async(req,res,next)=>{
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        // 회원 가입 시 비밀번호는 암호화해서 저장
        // bcrypt의 두번째 인수는 암호알고리즘 반복 횟수, 숫자가 커질 수록 비밀번호를 알기 어려움
        // but, 암호화 시간도 오래 걸림
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }catch(err){
        console.error(err);
        return next(err);
    }
});


// 로그인 라우터
// 로그인 요청 시 passport.authenticate('local') 미들웨어가 로컬 로그인 전략 수행
// 미들웨어 인데 라우터 미들웨어 안에 들어 있음
// 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 이렇게 사용
// 내부 미들웨어에 (req,res,next)를 인수로 호출
// 전략이 성공하거나 실패하면 authenticate 메서드의 콜백 함수가 실행
// passport.authenticate 미들웨어의 두번째 인수는 콜백함수
// 콜백 함수의 첫 번쨰 매개변수(authError)값이 있다면 실패
// 두번 째 매개변수(user)값이 있다면 성공
// req.login 메서드를 호출
// passport는 req 객체에 login과 logout 메서드를 추가
// req.login은 passport.serializeUser 메서드를 호출
// req.login에 제공하는 user 객체가 serializeUser로 넘어감
router.post('/login', isNotLoggedIn, (req,res,next) =>{
    passport.authenticate('local', (authError, user, info) =>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) =>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req,res,next);
});


// 로그아웃 라우터
// req.logout() 메서드는 req.user 객체를 제거
// req.session.destroy 메서드는 객체의 내용을 제거, 세션 정보를 지운다.
// 메인 페이지로 돌아감
router.get('/logout', isLoggedIn, (req,res)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.session.destroy();
        res.redirect('/');
    });
});

module.exports = router;