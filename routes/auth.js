const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log(req.user)
        return next()
    }else{
        res.redirect('/login');
    }
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/boss')
    }else{
        next();
    }
}

router.get('/logout', (req,res,next)=>{
    req.logout();
    res.send('cerrado ??? ');
 
});

router.get('/boss', isAuthenticated, (req,res)=>{
    //se lo pongo para que se visualice el boton de admin y se le de permiso al usuario
    const admin = req.user.role === 'BOSS';
    res.render("privado", {admin});
});

router.get('/login', isLoggedIn, (req,res)=>{
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
    res.redirect('/boss');
});


router.get('/signup', (req,res)=>{
    res.render('auth/signup');
});

router.post('/signup', (req,res,next)=>{

    User.register(req.body, req.body.password)
    .then(user=>res.redirect('/login'))
    .catch(e=>next(e));
})


module.exports = router;