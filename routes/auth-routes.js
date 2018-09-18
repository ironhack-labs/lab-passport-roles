const express = require('express');
const passport = require("passport");
const authRoutes = express.Router();



authRoutes.get("/userCreate", (req, res, next) => {
	res.render("auth/userCreate");
});

authRoutes.get("/login", (req, res, next) => {
	res.render("auth/login");
});


module.exports = authRoutes;
