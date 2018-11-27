
const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTa  = checkRoles('TA');

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const email = req.user.email;
  const {id}=req.params
  //req.app.locals.user = req.user;
  res.redirect("/auth/detail/$(id)");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get('/detail/:id',(req,res,next)=>{
  const {id} = req.params
  User.findById(id)
  .then(user=>{
    res.render('auth/detail',user)
  }).catch(e=>next(e))
 })

    router.get("/signup", (req, res, next) => {
      const action = `/auth/signup}`
    res.render("auth/signup",{action});
  });

  router.post("/signup", (req, res, next) => {
    User.register(req.body, req.body.password)
      .then(user => {
        res.json(user);
      })
      .catch(e => next(e));
  });

  router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/auth/login");
  });


  router.get("/new", checkBoss, (req, res, next) => {
    res.render("auth/new");
  });

  router.post("/new",checkBoss, (req, res, next) => {
    User.register(req.body, req.body.password)
      .then(user => {
        res.json(user);
      })
      .catch(e => next(e));
  });

  router.get("/private", checkBoss, (req,res)=>{
    user.find()
    .then (usuarios=>{
      res.render("private", {usuarios})
    }).catch (e=>next(e))
    
  })


  router.get('/delete/:id', chechBoss ,(req,res,next)=>{
    const {id}= req.params
    User.findByIdAndRemove(id)
    .then(usuarios=>{
      res.redirect('/auth/private')
    }).catch(e=>next(e))
  })

  //
  router.get('/update/:id',(req,res,next)=>{

    const {id} = req.params
    const action = `/auth/update${id}`
    User.findById(id)
    .then(user=>{
      res.render('auth/signup',{user,action})
    }).catch(e=>{
      next(e)
    })
   })
   
   router.post('/update/:id',(req,res,next)=>{
    const {id} = req.params
    User.findByIdAndUpdate(id,{$set:req.body},{new:true})
    .then(user=>{
      res.redirect(`/auth/detail/${id}`)
    }).catch(error=>{
      res.render('auth/signup',{user:req.body,error})
    })
   })
  module.exports = router