const router = require('express').Router();
const User = require('../models/User');
//const bcrypt = require('bcrypt');
const passport = require('passport');

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()) {
        req.user
        return next()
    } else {
        res.redirect('/login')
    }
}



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/profile')
    } else {
        next();
    }
}

router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('login')
    }
)

router.get('/profile', isAuthenticated, (req,res)=>{
    // const admin = req.user.role === '';
    res.render('profile', {username: req.username})     
})

router.get('/login', isLoggedIn, (req,res)=>{
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
    //creando una llave de usuario
    //locales es un espacio de almacenamiento de variables. variables para cualquier view
    req.app.locals.user = req.user;
    res.redirect('/profile')

});


router.get('/signup', (req,res)=>{
    res.render('auth/signup')
})

//1 crear la ruta post (recibe)
//2 checar las contraseñas que coinciden
//3 crear al usuario en la bd

router.post('/signup', (req,res,next)=>{

    User.register(req.body, req.body.password)
    .then(user=>res.redirect('/login'))
    .catch(e=>next(e))
})

module.exports = router;