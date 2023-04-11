const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require("path");

// dotenv.config() 메서드는 무슨 역할이지?
dotenv.config();
const app = express(); // express모듈을 app 변수에 할당
app.set('port',process.env.PORT || 3000); // 서버가 실행될 포트를 설정
// process.env 객체에 PORT 속성이 있아면 그 값을 사용, 없다면, 3000번 포트를 이용
// app.set(키,값)을 사용하면 데이터를 저장할 수 있으며, app.get(키)로 가져올 수 있음

const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');

// 미들웨어 안에 미들웨어를 넣는 방식으로 기존 미들웨어의 기능을 확장할 수 있음
// 조건문에 따라 다른 미들웨어를 적용하는 코드
// 이렇게 사용할 경우 배포일 때랑, 개발모드일 때랑 구분할 수 있음
// app.use((req,res,next)=>{
//     if (process.env.NODE_ENV === 'production'){
//         morgan('combited')(req,res,next);
//     }else{
//         morgan('dev')(req,res,next);
//     }
// });
app.use(morgan('dev'));
app.use('/',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

const fs = require('fs');

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

app.use('/',indexRouter);
app.use('/user',userRouter);
app.use('/upload',uploadRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
    //res.status(400).send("Not Found");
});

// 미들웨어는 위에서 아래로 순서대로 실행
// next라는 세번째 매개변수를 사용 -> 이것이 다음 미들웨어로 넘어가는 함수
// 주소를 첫번째 인수로 넣어주지 않는다면 미들웨어는 모든 요청에서 실행됨
app.use((req,res,next) =>{
    console.log('모든 요청에 다 실행됩니다.');
    next(); // 다음 미들웨어로 넘어가는 함수 next를 실행하지 않으면, 다음 미들웨어가 실행되지 않음
})

// app.use나 app.get 같은 라우터에 미들웨어를 여러 개 장착할 수 있음
// 현재 밑에 있는 app.get 라우터에는 두 개의 미들웨어가 연결되어 있음
// 다만 이때도 next 함수를 호출해야 다음 미들웨어로 넘어감
// next 함수 호출이 매우매우 중요
// 해당 라우터는 첫번째 인수로 주소 '/'를 넣어서 '/'로 시작하는 요청에서 미들웨어가 실행
app.get('/',(req,res,next) =>{
    //res.send("Hello, World");
    //res.sendFile(path.join(__dirname,'/index.html'));
    console.log("GET / 요청에서만 실행됩니다.");
    next(); // next 함수를 호출함으로서 밑에 있는 미들웨어가 실행
}, (req,res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.') 
    // 해당 미들웨어가 실행되면서 에러를 일부러 발생시켜 에러를 밑에 있는 에러 처리 미들웨어에 전달
});

// 에러 처리 미들웨어
// 에러 처리 미들웨어는 항상, 반드시 매개변수가 4개여야 함
// 매개변수를 전부 사용하지 않더라도 반드시 4개여야 함
// 첫번째 매개변수 err => error에 관한 정보가 담김
// res.status 메서드를 통해 HTTP 상태 코드를 지정할 수 있음
// 에러 처리 미들웨어는 특별한 경우가 아니라면 가장 아래에 위치하도록 함
// app.use((err,req,res,next) => {
//     console.error(err);
//     res.status(500).send(err.message);
// });

app.use((err,req,res,next)=>{
    console.log(err.message);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err:{};
    res.status(err.status || 500);
    res.render('error');
});


// listen을 하는 부분은 포트를 연결하고 서버를 실행
// 포트는 app.get(키)로 포트값을 가져옴
// 즉, app.listen(포트, 미들웨어)
app.listen(app.get('port'),() => {
    console.log(app.get('port'),'번 포트에서 대기 중');
})
