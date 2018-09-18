const express = require('express');
const passport = require("passport");
const authRoutes = express.Router();
const User = require('../models/user');




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

router.get('/userCreate', checkBoss, (req, res) => {
	res.render('private', {
		user: req.user
	});
});

router.get('/userCreate', checkTA, (req, res) => {
	res.render('private', {
		user: req.user
	});
});

authRoutes.get('/private', checkRoles('Boss'), (req, res) => {
	res.render('private', {
		user: req.user
	});
});