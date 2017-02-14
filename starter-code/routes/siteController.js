const express = require("express");
const siteController = express.Router();
const User           = require("../models/user");

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

const ensureLogin = require("connect-ensure-login");
const passport    = require("passport");
const flash = require("connect-flash");

siteController.get("/",(req,res) => {
	res.redirect("/private-page");
})

siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

siteController.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.get("/employees", ensureLogin.ensureLoggedIn(), (req, res) => {
	var data = {
		user: req.user,
	}
	User.find({},"username name familyName role following",(req,employees) => {
		data.employees = employees;
		res.render("passport/employees", data);
	});

});

siteController.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

siteController.post("/signup", (req, res, next) => {
  var username	 	= req.body.username;
	var name 				= req.body.name;
	var familyName 	= req.body.familyName;
  var password 		= req.body.password;
	var role 				= req.body.role;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
			name,
			familyName,
      password: hashPass,
			role
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "The username already exists" });
      } else {
        res.redirect("/employees");
      }
    });
  });
});

siteController.get("/employees/:username/remove", (req, res) => {
  User.findOneAndRemove({"username" : req.params.username},(err, user) => {
		if (err){ return next(err); }
		return res.redirect("/employees");
	})
});

siteController.post("/employees/:username/edit", (req, res) => {

	const updates = {
		 name: req.body.name,
		 familyName: req.body.familyName,
 };

  User.findOneAndUpdate({"username" : req.params.username},updates,(err, user) => {
		if (err){ return next(err); }
		return res.redirect("/employees");
	})
});

siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = siteController;
