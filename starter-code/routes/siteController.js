const passport = require("passport");
const express = require("express");
const siteController = express.Router();
const mongoose = require('mongoose');

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

siteController.get("/", (req, res, next) => {
	res.render("auth/login");
});

siteController.get("/login", (req, res, next) => {
	res.render("auth/login");
});

siteController.post("/login", passport.authenticate("local", {
	successRedirect: "/users-management",
	failureRedirect: "/login",
	failureFlash: true,
	passReqToCallback: true
}));

siteController.get("/users-management", checkRoles("Boss"), (req, res, next) => {
	User.find((err, users) => {
		if (err) {
			next(err);
		} else {
			res.render("users-management/index", { users });
		}
	});
});

siteController.get("/users-management/new", checkRoles("Boss"), (req, res, next) => {
	User.find((err, users) => {
		if (err) {
			next(err);
		} else {
			res.render("users-management/edit", { roles: User.schema.path('role').enumValues, user: {} });
		}
	});
});

siteController.get("/users-management/:id", checkRoles("Boss"), (req, res, next) => {
	User.findById({_id: req.params.id},(err, user) => {
		if (err) {
			next(err);
		} else {
			res.render("users-management/edit", { roles: User.schema.path('role').enumValues, user });
		}
	});
});

siteController.post("/users-management", checkRoles("Boss"), (req, res, next) => {
	const oldPassword = req.body.oldPassword;
	const id = req.body.id;

	let newUser = {
		username: req.body.username,
		password: req.body.password,
		name: req.body.name,
		familyName: req.body.familyName,
		role: req.body.role
	};

	if (newUser.username === "" || newUser.password === "") {
		res.render("users-management/edit", {
			errorMessage: "Enter a name and password", roles: User.schema.path('role').enumValues, user: newUser
		});
		return;
	}

	if (!bcrypt.compareSync(newUser.password, oldPassword)) {
		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(newUser.password, salt);

		newUser.password = hashPass;
	}
	const query = id ? { _id: id } : { _id: new mongoose.Types.ObjectId() };
	User.findByIdAndUpdate(query, { $set: newUser }, { upsert: true }, (err) => {
		if (err) {
			if (err.name === "ValidationError") {
				res.render("users-management/edit", {
					errorMessage: err.message
				});
			} else {
				next(err);
			}
		} else {
			res.redirect("/users-management");
		}
	});
});

siteController.post("/users-management/delete", checkRoles("Boss"), (req, res, next) => {
	const id = req.body.id;

	User.findByIdAndRemove({ _id: id }, (err, result) => {
		if (err || !result) {
			next(err || new Error("Empty result"));
		} else {
			res.redirect("/users-management");
		}
	});
});

function checkRoles(role) {
	return function (req, res, next) {
		if (req.isAuthenticated() && req.user.role === role) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
}

module.exports = siteController;