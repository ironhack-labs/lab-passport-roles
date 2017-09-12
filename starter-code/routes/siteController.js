const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");
const siteController = require('express').Router();
const checkRoles = require('../middlewares/checkRoles');
// const ensureLogin = require("connect-ensure-login");
// const isLoggedIn = require('../middlewares/isLoggedIn');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const checkBoss  = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');


siteController.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get('/profile',(req,res) =>{
  userID = req.user.id
  res.redirect('/profile/'+userID)
});

siteController.get("/profile/:id", ensureAuthenticated(), (req, res, next) => {
  userID = req.params.id
  User.findById(userID)
  .then( response => {
    User.find({}, (err, users) => {
      if (err) { return next(err) }
        const userSession = req.user
        res.render("profile/show", { user:response, users: users, userSession: req.user })
      })
  }).catch( err => next(err))

})

// DELETE USER
siteController.get('/profile/:id/delete', checkBoss, (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId)
  .then( response => {
    return res.redirect('/profile');
  }).catch( err => { next(err) })
});

// BOSS: ADDING NEW USERS
siteController.get("/add", checkBoss, (req, res, next) => {
  User.find({})
  .then( response => {
    res.render('auth/signup', { users: response })
  }).catch( err => { next(err) } )
});

siteController.post("/add", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || name === "" || familyName === "" || password === "" || role === "") {
    res.render("auth/signup", { message: "Indicate all fields" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // debug("User created");

    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    })
    .save()
    .then(user => res.redirect('/profile'))
    .catch(e => res.render("auth/signup", { message: "Something went wrong" }));

  });
});

//LOGOUT
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// UPDATE PROFILE
siteController.get('/profile/:id/edit', (req, res, next) => {
  const profileId = req.params.id;
  User.findById(profileId)
  .then( (response) => {
    if( profileId == req.user.id){
      res.render('profile/edit',{personInfo: response})
    }else{
      res.redirect('/')
    }

  }).catch( err => next(err) )
});

siteController.post('/profile/:id/edit', (req, res, next) => {
  const profileId = req.params.id;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const updates = {
        username: req.body.username,
        name: req.body.name,
        familyName: req.body.familyName,
        password: hashPass,
        role: req.body.role,
  };
  User.findByIdAndUpdate(profileId, updates, (err, product) => {
    if (err){ return next(err); }
    return res.redirect(`/profile/${profileId}/`);
  });
});



module.exports = siteController;
