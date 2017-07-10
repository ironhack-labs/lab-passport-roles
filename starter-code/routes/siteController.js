const express = require("express");
const siteController = express.Router();
var path = require('path');
var debug = require('debug')('express-passport:'+path.basename(__filename));
const ensureLogin = require("connect-ensure-login");

siteController.get("/", (req, res, next) => {
  if(req.user){
    debug(req.user);
  }else{
    debug("User is not logged in");
  }
  res.render("index", {user: req.user});
});

module.exports = siteController;
