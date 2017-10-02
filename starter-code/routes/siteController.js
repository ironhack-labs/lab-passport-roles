const express = require("express");
const siteController = express.Router();

const User = require("../models/user");
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


siteController.get("/", (req, res, next) => {
	res.render("index");
});


siteController.get("/new", (req, res, next) => {
	res.render("auth/new");
});

siteController.post("/new", (req, res, next) => {
	const username = req.body.username;
	const name = req.body.name;
	const familyName = req.body.familyName;
	const password = req.body.password;
	const role = req.body.role;

	if (username === "" || password === "") {
		res.render("auth/new", { message: "Indicate username and password" });
		return;
	}

	User.findOne({ username }, "username", (err, user) => {
		if (user !== null) {
			res.render("auth/new", { message: "The username already exists" });
			return;
		}

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);

		const newUser = new User({
			username,
			name,
			familyName,
			password: hashPass,
			role
		});

		newUser.save((err) => {
			if (err) {
				res.render("auth/new", { message: "Something went wrong" });
			} else {
				res.redirect("/private");
			}
		});
	});
});

siteController.get("/login", (req, res, next) => {
	res.render("auth/login", { "message": req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
	successRedirect: "/private",
	failureRedirect: "/login",
	failureFlash: true,
	passReqToCallback: true
}));

siteController.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});


siteController.get('/private', ensureAuthenticated, (req, res) => {
	res.render('auth/private', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	} else {
		res.redirect('/login')
	}
}

var checkBoss  = checkRoles('Boss');
var checkDev = checkRoles('Developer');
var checkTA  = checkRoles('TA');

siteController.get('/private', checkBoss, (req, res) => {
	res.render('auth/private', {user: req.user});
});

siteController.get('/private', checkDev, (req, res) => {
	res.render('auth/private', {user: req.user});
});

siteController.get('/private', checkTA, (req, res) => {
	res.render('auth/private', {user: req.user});
});

function checkRoles(role) {
	return function(req, res, next) {
		if (req.isAuthenticated() && req.user.role === role) {
			return next(); 
		} else {
			res.redirect('auth/login')
		}
	}
}


// siteController.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("private", { user: req.user });
// });


siteController.get("/users", ensureAuthenticated, (req, res, next) => {
	User.find({}, (err, users) => {
		if(err) {return next(err)}
			console.log("users");
			res.render("users", {
				users
			});
		});
	});





module.exports = siteController;
