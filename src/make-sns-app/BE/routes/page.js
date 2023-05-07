const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Post = require('../models/post');
const User = require('../models/user');
const Hashtag = require('../models/hashtag');

const router = express.Router();

router.use((req, res, next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});


router.get('/profile', isLoggedIn, (req,res) => {
    // 로그인이 되어 있다면 isLoggedIn 미들웨어에서 next()를 실행 다음 미들웨어인 (req,res) 를 실행
    res.render('profile',{title: "내 정보 - NodeBird"});
});

router.get('/join', isNotLoggedIn, (req,res) =>{
    // 로그인이 되어 있지 않다면  isNotLoggedIn 미들웨어에서 next()를 실행 다음 미들웨어인 (req,res) 를 실행
    res.render('join',{title: "회원가입 - NodeBird"});
});

router.get('/', async(req,res,next) => {
    try{
        const posts = await Post.findAll({
            include:{
                model: User,
                attributes:['id','nick'],
            },
            order: [['createdAt','DESC']],         
        });
        res.render('main',{
            title: 'NodeBird',
            twits: posts,
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/hashtag',async(req,res,next)=>{
    const query = req.query.hashtag;
    if(!query){
        return res.redirect('/');
    }
    try{
        const hashtag = await Hashtag.findOne({where:{title:query}});
        let posts = [];
        if(hashtag){
            posts = await hashtag.getPosts({include:[{model:User}]});
        }
        return res.render('main',{
            title: `${query} | NodeBird`,
            twits: posts,
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});


module.exports = router;