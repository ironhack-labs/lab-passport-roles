const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const bcrypt  = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const checkBoss = checkRoles("BOSS");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//SignUp
router.get("/signup", (req, res, next) =>{
  res.render("signup");
})

router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashPass
    });

     newUser.save((err) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  });
});

router.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/courses",
  failureRedirect: "/"
}));


router.get('/private', checkBoss, (req, res) =>{
  User.find().then(roles =>{
    res.render('roles/private',{user: req.user, roles});
  })
  .catch((error)=>{
    console.log(error);
    res.redirect('/login');
  })
});

router.post('/private', (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;
  const role     = req.body.role;
  
  if(username === "" || password === ""){
    res.render("roles/private", {message: "Enter username and password"});
    return;
  }

  User.findOne({username})
  .then(user =>{
    if (user !== null){
      res.render("roles/private", {message:"Username already exists"});
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User ({
      username, 
      password: hashPass,
      role
    });
    newUser.save((err)=>{
      if (err){
        res.render("roles/private", { message: "Something went wrong" });
      } else {
        res.redirect("/private");
      }
    });
  })
  .catch(error => {
    next(error);
  })
});

router.post('/private/:id/delete', (req, res, next) => {

  let employeeId = req.params.id;
  User.findByIdAndRemove(employeeId)
  .then((employee) => {
    if (!employee) {
      return res.status(404).render('not-found');
  }
  console.log('Successful Deletion!!');
  res.redirect('/private');
    })
    .catch(next);
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/');
    }
  }
}
  

module.exports = router;
