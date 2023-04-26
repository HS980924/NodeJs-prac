// 라우터 접근 조건 만들기
// 로그인한 사용자는 회원가입과 로그인 라우터 접근 불가
// 로그인x 사용자 -> 로그아웃 라우터에 접근 불가
// 라우터에 접근 권한을 제어하는 미들웨어 필요
// Passport가 req 객체에 isAuthenticated 메서드를 추가
// 로그인 중이면 해당 값이 true  아니면  false
// 로그인 여부를 해당 메서드로 파악할 수 있음

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