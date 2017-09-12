// const User = require("../models/User");
const Course = require("../models/Course");
// const bcrypt = require("bcrypt");
// const bcryptSalt = 10;
// const path = require('path');
const passport = require('passport');
const debug = require('debug')("app:auth:local");
const router = require('express').Router();
const checkRoles = require('../middlewares/checkRoles');
// const ensureLogin = require("connect-ensure-login");
// const isLoggedIn = require('../middlewares/isLoggedIn');
// const checkBoss  = checkRoles('Boss');
// const checkDeveloper = checkRoles('Developer');
const checkTA = checkRoles('TA');


router.get("/", checkTA, (req, res, next) => {
  Course.find({})
  .then( response => {
    console.log('cursos:',response)
    res.render('courses/index', { courses: response })
  }).catch( err => { next(err) } )
});



module.exports = router;
