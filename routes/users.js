const express = require("express");
const bcrypt = require('bcrypt');

const User = require("../models/user-model");
const passport = require('passport');
const router = express.Router();

router.get('/employees',(req,res, next) => {
  User.find()
    .then ((userDetails) =>{
      res.locals.userList = userDetails; 
      res.render('users');
    })
    .catch ((err) => {
      next(err);
    });

});




module.exports = router;