const express = require('express');
const path = require('path');
const morgan = require('morgan');

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
// require('./models'); == require('./models/index.js');
// 폴더 내의 index.js 파일은 require 시 이름을 생략할 수 있음

const app = express();
app.set('port',process.env.PORT || 3001);

// force: false => 해당 옵션은 서버 실행 시마다 테이블을 재생성하지 않겠다는 의미
sequelize.sync({ force: false })
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/',indexRouter);
app.use('/users',userRouter);
app.use('/comments',commentRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});
