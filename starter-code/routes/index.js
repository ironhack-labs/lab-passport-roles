const express = require('express').Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});




module.exports = router;
