const express = require("express");
const siteController = express.Router();
const User = require('../models/User');
const ensureLogin = require("connect-ensure-login");



siteController.get("/", (req, res, next) => {
  if(req.user){
    res.render('index', { title: 'Express', user:req.user });

}else{
  res.redirect('auth/login');
}

});


module.exports = siteController;
