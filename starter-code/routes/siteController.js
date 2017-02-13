const express = require("express");
const siteController = express.Router();
const passport      = require("passport");
const ensureLogin = require("connect-ensure-login");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require("../models/user");

siteController.get("/bosshome", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("users/boss/bossHome", { user: req.user });
});

siteController.get("/", (req, res, next) => {
  res.render("index");
});

siteController.get("/login", (req, res, next) => {
  res.render("users/login", {"message": req.flash("error") });
});

var checkClereance = function (req, res) {
  var user = req.body.username;
  User.findOne({username: user}, (err, user) => {
    if(err) {
      next(err);
    }
    else if (user.role === "Boss") {
      return passport.authenticate("local", {
        successRedirect: "/bosshome",
        failureRedirect: "/login",
        failiureFlash: true,
        passReqToCallback: true
      });
    }else if (user.role === "TA") {
      return passport.authenticate("local", {
        successRedirect: "/TAhome",
        failureRedirect: "/login",
        failiureFlash: true,
        passReqToCallback: true
      });
    }else if (user.role === "Developer"){
      return passport.authenticate("local", {
        successRedirect: "/DevHome",
        failureRedirect: "/login",
        failiureFlash: true,
        passReqToCallback: true
      });
    }
  });
};

siteController.post("/login", (req, res) => {
  res.send(siteController.post("/login", checkClereance(req, res)));
});

siteController.get("/addservant", (req, res, next) => {
  res.render("users/boss/addServant");
});

siteController.post("/addservant", (req, res, next) => {
  let password = req.body.password;
  let username = req.body.username;
  User.findOne({username: username}, (err, user) => {
    if (err) {
      next(err);
    } else {
      if(!user) {
        var salt = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);

        var newSlave = User({
          username: req.body.username,
          name: req.body.name,
          familyName: req.body.familyName,
          password: hashPass,
          role: req.body.role
        });
        var newUser = new User(newSlave);
        newUser.save((err) => {
          if (err) {
            next(err);
          } else {
            res.redirect("bosshome");
          }
        });
      } else {
        res.redirect("/addservant", {
            errorMessage: "User name for servant is not unique, oh boss."
        });
      }
    }
  });
});

siteController.get("/removeservant", (req, res, next) => {
  User.find({role:"TA"}, {username: 1, role: 1}, (err, employees) => {
    if(err) {
      next(err);
    } else {
      res.render("users/boss/removeServant", {servants: employees});
    }
  });
});

siteController.get("/delete/:id", (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/removeservant");
    }
  });
});

module.exports = siteController;
