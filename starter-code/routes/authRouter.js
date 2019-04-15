const express = require("express");
const authRouter = express.Router();
const passport = require("passport");

// Require user model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRouter.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRouter.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/boss')
			}	else {
				res.redirect('/login')
			}
		}
	}
}

// js curry
// const checkAdminOrEditor = checkRoles(['ADMIN', 'EDITOR']);
const checkAdmin = checkRoles(['BOSS']);

// app.get("/private-page-admin-editors", checkAdminOrEditor, (req, res) => {
// 	res.render("onlyforadminseditors", {
// 		user: req.user,
// 		"section": "private"
// 	});
// });

authRouter.get("/private-page-admin", checkAdmin, (req, res) => {
	res.render("boss", {
		user: req.user,
		"section": "private"
	});
});

// Add passport 
authRouter.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


const ensureLogin = require("connect-ensure-login");

authRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRouter;