

const express = require('express');
const router = express.Router();
const User  = require('../models/User');
const passport = require('passport');

const checkRole = (req,res,next)=>{
    User.findOne({username: res.body.username})
    .then(user=>{
        console.log(user)
        if(user.role === 'BOSS'){
            return next();
        }
        res.send("No tiene acceso");
    })
    .catch(e => console.log(e));
}
router.post('/signup',(req,res,bext)=>{
    if(req.body.password1!==req.body.password2){
        req.body.error = "Password incorrecto";
        return res.render('./auth/signup',req.body);
    }
    User.register(req.body, req.body.password1, (err, ser)=>{
        if(err) return next(err);
            res.redirect('/login');
    })
});

router.get('/signup', (req,res) =>{
    res.render('./auth/signup');
})

router.post("/login", checkRole, (req, res, next)=>{
    res.send("/boss");

    rouer.get('/boss', (req,res)=>{
        res.render('boss');
    })
})
module.exports = router;