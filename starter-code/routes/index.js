const express = require('express');
// const router  = express.Router();

const passport = require("passport");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");

// const User = require("../models/user");

/* GET home page */
  passportRouter.get('/', (req, res, next) => {
  res.render('index');
});

////AUTHENTICATED

passportRouter.get('/private', ensureAuthenticated, (req, res) => {
  res.render('private', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

////LOG IN

passportRouter.get("/login", (req, res, next) => {
  res.render("login"); // { "message": req.flash("error") });
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

////ONE PRIVATE-ROOM FOR ALL

passportRouter.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("private", 
    // { user: req.user });
     ) }
);


////EDIT



module.exports = passportRouter;
