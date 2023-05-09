const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models');

const router = express.Router();


router.post('/token', async(req,res,next)=>{
    const { clientSecret } = req.body;
    try{
        const domain = await Domain.findOne({
            where: {clientSecret},
            include: {
                model: User,
                attributes: ['nick', 'id'],
            },
        });
        if(!domain){
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        },process.env.JWT_SECRET,{
            expiresIn: '1m',
            issuer: 'HS980924',
        });
        return res.json({
            code: 200,
            message: '토큰 발급 완료',
            token,
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

router.get('/test', verifyToken, (req,res,next)=>{
    res.json(req.decoded);
});


module.exports = router;