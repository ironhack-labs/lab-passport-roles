const express = require('express');
const passport = require("passport");
const authRoutes = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
	res.render("auth/login");
});

authRoutes.get("/userCreate", checkRoles("Boss"), (req, res, next) => {
	res.render("auth/userCreate"), {
		user: req.user
	};
});


function checkRoles(r) {
	return function (req, res, next) {
		if (req.isAuthenticated() && req.user.roles === r) {
			return next();
		} else {
			res.redirect('/login')
		}
	}
}

const checkBoss = checkRoles('Boss');
const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');

authRoutes.post("/login", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	let err = false;

	if (username === "" || password === "") {
		err = true;
		res.render("auth/login", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}
	

	User.findOne({
			"username": username
		})
		.then(user => {
			if (err || !user) {
				res.render("auth/login", {
					errorMessage: "The username doesn't exist"
				});
				return;
			}
			if (bcrypt.compareSync(password, user.password)) {
				// Save the login in the session!
				req.session.currentUser = user;
				res.render("./home");
			} else {
				res.render("auth/login", {
					errorMessage: "Incorrect password"
				});
			}
		})
		.catch(err => {
			next(err)
		})
});



module.exports = authRoutes;