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
    res.render('courses/index', { courses: response })
  }).catch( err => { next(err) } )
});

//UPDATE
router.get("/:id/edit", checkTA, (req, res, next) => {
  const courseID = req.params.id
  Course.findById( courseID )
  .then( response => {
    res.render('courses/edit', {courseInfo: response})
  }).catch( err => {next(err)})
});

router.post('/:id/edit', (req, res, next) => {
  const courseId = req.params.id;

  const updates = {
        name: req.body.name,
        startingDate: req.body.startingDate,
        endDate: req.body.endDate,
        level: req.body.level,
        available: req.body.available
  };
  Course.findByIdAndUpdate(courseId, updates, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/courses');
  });
});


module.exports = router;
