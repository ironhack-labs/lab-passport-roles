const express = require('express')
const router = express.Router()
const User = require('../models/User')

function checkRole(role){
    return (req,res,next)=>{
        if(req.isAuthenticated()){
            if(req.user.role === 'BOSS')next()
            else if(req.user.role ==='TA') res.redirect('/TA')
            else if(req.user.role ==='DEVELOPER') res.redirect('/Course')
        }else{
            res.redirect('/login')
        }
    }
}
router.get('/',(req,res,next)=>{
    res.render('ironhack/home')
})

router.get('/boss',checkRole('BOSS'),(req,res,next)=>{
    User.find({role:{$ne:'BOSS'}})
    .then(users=>{
        res.render('ironhack/boss',{users})
    })
    .catch(e=>console.log(e))
})

module.exports= router