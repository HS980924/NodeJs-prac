const passport = require('passport');
const local = require('./localStrategy');
//const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    // serializeUser -> 로그인 시 실행되는 메서드
    // req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
    // 매개변수로 user(선택)와 done함수를 받음
    // done함수의 첫번째 인자 -> 에러 발생 시 사용
    // done함수의 두번째 인자 -> 저장할 데이터를 넣어준다.(설정한다.)
    // session 객체에 사용자 정보를 넣어 나중에 사용하기 위함
    // 지금은 로그인 시 req.session 객체에 사용자 정보를 넣는다 정도로만 알고 있으면 됨
    passport.serializeUser((user,done) =>{
        done(null, user.id);
    });

    // deserializeUser -> 매 요청 시 실행
    // passport.session 미들웨어가 해당 메서드를 호출
    // serializeUser의 done의 두번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 됨
    // 해당 매개변수로 사용자 정보를 조회하고 조회한 정보를 req.user에 저장
    passport.deserializeUser((id,done) =>{
        User.findOne({
            where:{id},
            include: [{
                model:User,
                attributes:['id','nick'],
                as: 'Followers',
            },{
                model: User,
                attributes:['id','nick'],
                as:'Followings'
            }],
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    // serializeUser -> 로그인 시 사용자 정보 객체를 세션에 아이디로 저장
    // deserializeUser -> 매 요청 시 세션에 저장된 아이디를 통해 사용자 정보 객체를 조회 및 불러옴

    local();
};