const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')

router.get('/login',(req,res,next)=>{
    res.render('auth/login')
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>{
    res.redirect('/boss')
})

router.get('/signup',(req,res,next)=>{
    res.render('auth/signup')
})

router.post('/signup',(req,res,next)=>{
    User.register(req.body,req.body.password)
    .then(user=>{
        res.redirect('/boss')
    })
    .catch(e=>{
        console.log(e)
    })
})

module.exports= router