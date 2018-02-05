const express = require("express");
const auth = express.Router();

auth.get("/", (req, res, next) => {
  res.render("index");
});

auth.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = auth;