const router = require('express').Router();
const User = require('../models/User');
const Course = require('../models/Course')
const bcrypt = require('bcrypt');
const passport = require('passport');
const express = require('express');


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
        res.redirect('/private')    
    }else{
        next();
    }
}

router.post('/newCourse', (req,res,next)=>{
    const {name} = req.body;
    const newCourse = new Course(req.body)
    newCourse.save()
    .then((course)=> {
        res.redirect('/private')
    })
    .catch(e=>next(e));
})

router.get('/:id', (req,res,next) => {
    User.findById(req.params.id)
    .then(user=>{
        console.log(user);
        res.render('auth/profile', user)
    })

    .catch(err=> next())

})

router.post('/new', (req,res,next)=>{

    User.register(req.body, req.body.password)
    .then(user=>res.redirect('/private'))
    .catch(e=>next(e));
})

// router.get('/boss', (req,res,next) => {
//     User.find({})
//     .then(users=>{
//         res.render('boss', {users})
//     })
//     .catch(err=> next())
// })

router.get('/logout', (req,res,next)=>{
    req.logout();
    res.redirect('login');
});

router.get('/private', isAuthenticated, (req,res)=>{
    const boss = req.user.role === "BOSS";
    const ta = req.user.role === "TA";

    Promise.all([User.find(), Course.find()])
    .then(results=>{
        const ctx = {
            users: results[0],
            courses: results[1]
        }
        res.render('auth/private', ctx)
        })
    .catch(e=>next(e))
});

router.get('/login', isLoggedIn, (req,res)=>{
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
    req.app.locals.user = req.user; 
    res.redirect('/private');
});


router.get('/signup', (req,res)=>{
    res.render('auth/signup');
});


router.post('/signup', (req,res,next)=>{

    User.register(req.body, req.body.password)
    .then(user=>res.redirect('/login'))
    .catch(e=>next(e));
})


//UPDATE

router.post('/:id/edit', (req,res,next) => {
    User.findById(req.params.id)
    .then(user=>{
        console.log(user);
        res.render('/auth/edit', user)
    })
    .catch(err=> next())

})

//Facebook

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/private');
  });


module.exports = router;