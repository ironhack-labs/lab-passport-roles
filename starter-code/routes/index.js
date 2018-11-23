const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLogged');
const {roleCheck} = require('../middlewares/roleCheck');
const User = require('../models/User');
const Course = require('../models/Course');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/users', [isLoggedIn('/login'), roleCheck(["Boss", "Developer", "TA", "Student"])],(req,res) => {
  // User.find((err, users) => {
  //   res.render('users', {users});
  // });
  User.find({role: 'Student'}, (err, students) => {
    User.find({role: {$ne: 'Student'}}, (err, users) => {
      res.render('users', {students, users});
    });
  });
});

router.get('/courses', [isLoggedIn('/login'), roleCheck(["Boss", "Developer", "TA", "Student"])],(req,res) => {
  Course.find((err, courses) => {
    res.render('courses', {courses});
  });
});

router.get('/main', [isLoggedIn('/login'), roleCheck(["Boss", "Developer", "TA", "Student"])],(req,res) => {
  res.render('main');
});


// router.get('/iamboss',(req,res) => {
//   req.flash('error','You are boss now');
//   req.user.role = "Boss";
//   req.user.save().then( () => {
//     res.redirect('/');
//   });
// });


module.exports = router;
