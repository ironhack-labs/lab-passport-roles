const express        = require("express");
const login          = express.Router();
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


login.use((req, res, next) => {
  if (req.user) {
    res.redirect('/private');
  } else {
    next();
  }
});

login.get("/", (req, res, next) => {
  res.render("passport/login", {"message" : req.flash("error")});
});

login.post("/", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


login.get("/facebook", passport.authenticate("facebook"));
login.get("/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private",
  failureRedirect: "/"
}));


module.exports = login;
