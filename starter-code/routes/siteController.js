const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
siteController.get("/", (req, res, next) => {
  res.render("index");
});


siteController.get("/signup",(req, res, next) =>{
  res.render("siteController/signup");

});

siteController.post("/signup",(req, res, next) =>{
  const username = req.body.username;
  const password = req.body.password;
  
})
module.exports = siteController;
