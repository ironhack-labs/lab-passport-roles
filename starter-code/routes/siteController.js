const express = require("express");
const siteController = express.Router();
const User = require('../models/users')
const Course = require('../models/courses')
const mongoose = require('mongoose')
const Snip = require('../models/snips')
const passport = require("passport");
const session = require('express-session')
const saltRounds = 15
const bcrypt = require('bcrypt')
const ensureLogin = require("connect-ensure-login");



const snip = {
	errorMessage: '<% if (typeof(errorMessage) != "undefined") { % > < div class = "error-message" > <%= errorMessage %> < /div><% } %>',
}

siteController.get("/", (req, res, next) => {
	res.render("login", { snip });
});

siteController.get("/admin", Snip.check('3'), (req, res, next) => {
	res.render("admin/admin", { snip, user: req.user });
});

siteController.get("/login", (req, res, next) => {
	res.render("login", { "errorMessage": req.flash("error"), snip });
});

siteController.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/login",
	failureFlash: true,
	passReqToCallback: true
}));

siteController.post("/newUser", (req, res, next) => {
	const { password, username, firstName, familyName, role } = req.body

	console.log(role)


	if (username === "" || password === "" || firstName === "" || familyName === "") {
		return res.render("admin/admin", {
			errorMessage: "Please fill all the fields to signup"
		});
	}



	User.findOne({ "username": username }, "username", (err, user) => {
		if (user !== null) {
			return res.render("admin/admin", {
				errorMessage: "This username already exists"
			});
		}
		const salt = bcrypt.genSaltSync(saltRounds);
		const hashPass = bcrypt.hashSync(password, salt);

		const newUser = User({
			username: username,
			password: hashPass,
			name: firstName,
			familyName: familyName,
			role: Snip.roleParser(role),
		});

		console.log(newUser)

		newUser.save((err) => {
			if (err) {
				res.render("admin/admin", {
					errorMessage: "Something went wrong when signing up"
				});
			} else {
				res.redirect('/admin')
			}
		});
	});
})



siteController.get("/profile?id=:id", (req, res, next) => {

	res.render("users/profile", { snip });
});

siteController.get("/home", ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render("home", { user: req.user, "snip": Snip })
});

module.exports = siteController;