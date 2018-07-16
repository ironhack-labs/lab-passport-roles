const express        = require("express");
const router         = express.Router();
const Courses        = require("../models/courses");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const checkTA        = checkRoles('TA');


router.get('/', ensureLogin.ensureLoggedIn, (req, res, next) => {
  Courses.find().then(courses =>{
    res.render('courses/courses', {courses});
  });
  // .catch(err => {
  //   console.log(err);
  //   next();
  // })
});

router.get('/add', checkTA, (req, res, next) => {
  res.render("courses/addCourse");
});

router.post('/add', (req, res, next) => {
  const {name} = req.body;
  const newCourse = new Courses({name});
  newCourse.save()
  .then((course) => {
    res.redirect('/courses');
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/courses/add');
  });
});

router.get('/:id/edit', checkTA, (req, res, next) => {
  let courseId = req.params.id;
  Courses.findById(courseId)
  .then((course) => {
    res.render("courses/editCourse", course)
  })
  .catch((error) => {
    console.log(error);
  })
});

router.post('/:id/edit', (req, res, next) => {
  let courseId = req.params.id;
  const { name } = req.body;
  Courses.update({_id: courseId}, { $set: { name }},{new: true})
  .then((e) => {
    res.redirect('/');
  })
  .catch((error) => {
    console.log(error);
  });
});

router.post('/:id/delete', checkTA, (req, res, next) => {

  let courseId = req.params.id;
  Courses.findByIdAndRemove(courseId)
  .then((course) => {
    if (!course) {
      return res.status(404).render('not-found');
  }
  console.log('Deleting succes!!');
  res.redirect('/');
    })
    .catch(next);
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  }
}

module.exports = router;