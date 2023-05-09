// 라우터 접근 조건 만들기
// 로그인한 사용자는 회원가입과 로그인 라우터 접근 불가
// 로그인x 사용자 -> 로그아웃 라우터에 접근 불가
// 라우터에 접근 권한을 제어하는 미들웨어 필요
// Passport가 req 객체에 isAuthenticated 메서드를 추가
// 로그인 중이면 해당 값이 true  아니면  false
// 로그인 여부를 해당 메서드로 파악할 수 있음
const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        next();
    }else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req,res,next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        next();
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료',
            });
        }
        return res.status(401).json({
            code: 401,
            message: "유효하지 않은 토큰"
        });
    }
};