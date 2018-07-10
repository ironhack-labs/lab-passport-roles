const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router  = express.Router();
const User = require('../models/User');
const Course = require('../models/Course')

/* GET home page */
router.get('/', (req, res, next) => {
   res.render('index');
 });

router.get('/auth/private', [
  ensureLoggedIn('/auth/login'), 
  hasRole('Boss', '/'),
] , (req,res) => {
  User.find({})
  .then(users => {
    res.render('auth/private', {users});
  })
})

router.get('/coursesCreate', (req, res, next) => {
  res.render('auth/coursesCreate');
});


router.post('/coursesCreate', (req, res, next) => {

  const {
    name,
    description,
  } = req.body;

 Course.findOne({
      name
    })
    .then(course => {
      if (course !== null) {
        throw new Error("Username Already exists");
      }


      const newCourse = new Course({
        name,
        description,
      });

      return newCourse.save()
    })
    .then(course => {
      res.redirect("/auth/clasePrivate");
    })
    .catch(err => {
      console.log(err);
      res.render("/auth/coursesCreate", {
        errorMessage: err.message
      });
    })
})


router.get('/courses', (req, res, next) => {

  Course.find({}).then(courses => {
    res.render("courses", { courses });
});
})


module.exports = router;
