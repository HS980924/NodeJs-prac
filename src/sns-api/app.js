const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const v1 = require('./routes/v1');

dotenv.config();
const app = express();
passportConfig();

app.set('port',process.env.PORT || 8002);
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});

sequelize.sync({force:false})
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',indexRouter);
app.use('/auth',authRouter);
app.use('/v1',v1);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(err);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), ()=>{
    console.log("http://localhost:8002 서버 실행")
})