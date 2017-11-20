const express        = require("express");
const authController         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session       = require("express-session");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

const checkBoss  = checkRoles('Boss');
const checkDev = checkRoles('Developer');
const checkTA  = checkRoles('TA');


authController.get("/login", (req, res, next) => {
  res.render("login");
});

authController.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authController.get("/home", ensureLogin.ensureLoggedIn(),(req, res, next) => {
  res.render("home", {user: req.user});
});

authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authController.get("/profile", ensureLogin.ensureLoggedIn(),(req, res, next) => {
  if (req.user.role == "Boss"){
    res.render("boss/profile", {user: req.user, reqUsr: req.user});
  }
  else{
    res.render("team/profile", {user:req.user, reqUsr: req.user});
  }
});

authController.get("/newUser", checkBoss, ensureLogin.ensureLoggedIn(),(req, res) => {
  res.render("boss/newUser");
});

authController.post("/newUser", checkBoss, ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("boss/newUser", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("boss/newUser", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      name: req.body.name,
      familyName: req.body.familyName,
      password: hashPass,
      role: req.body.role
    });

    newUser.save((err) => {
      if (err) {
        res.render("boss/newUser", { message: "Something went wrong" });
      } else {
        return res.redirect('/');
      }
    });
  });
});

authController.get('/setupUsers', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err);}

    res.render('boss/setupUsers', {users: users});
  });
});

authController.get('/listUsers', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err);}

    res.render('team/listUsers', {users: users});
  });
});

authController.get('/:id/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('editProfile', { user: user });
  });
});

authController.get('/profile/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.id;

  User.findById (userId, (err, user) => {
    if (err) { return next(err); }
    res.render('team/profile', { user: user, reqUsr: req.user});
  });
});

authController.post('/user/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.params.id;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const updates = {};
  if(req.body.username !== ""){updates.username = req.body.username;}
  if(req.body.password !== ""){updates.password = bcrypt.hashSync(req.body.password, salt);}
  if(req.body.role !== ""){updates.role = req.body.role;}

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    return res.render('team/profile', { user: user, reqUsr: req.user});
  });
});

authController.post('/setupUsers/:id/delete', checkBoss, ensureLogin.ensureLoggedIn(),  (req, res, next) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, user) => {
    if (err){ return next(err); }
    return res.redirect('/');
  });

});

module.exports = authController;
