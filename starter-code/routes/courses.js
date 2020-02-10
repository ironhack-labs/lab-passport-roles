const express        = require("express");
const passportRouter = express.Router();
const Course = require('../models/Course');
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

const checkTA  = checkRoles('TA');


passportRouter.get('/create-course', checkTA, (req, res) => {
  res.render('courses/create-course');
});

passportRouter.post('/create-course', checkTA, (req, res) => {
  const title = req.body.title;
  const duration = req.body.duration;

  if (title === "" || duration === "") {
    res.render("courses/create-course", {
      message: "Indicate title and duration"
    });
    return;
  }

  Course.findOne({
      title
    })
    .then(course => {
      if (course !== null) {
        res.render("courses/create-course", {
          message: "The title already exists"
        });
        return;
      }


      const newCourse = new Course({
        title,
        duration
      });

      newCourse.save((err) => {
        if (err) {
          res.render("courses/create-course", {
            message: "Something went wrong"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});

passportRouter.get('/list-courses', checkTA, ensureLogin.ensureLoggedIn(), (req, res) => {
  Course.find()
    .then(courses => {
      const response = {courses};
      const role = req.user.role[0];
      response[role] = role;

      res.render('courses/list-courses', {response})
    })
    .catch(err => next(err))
});

passportRouter.get('/edit-course/:id', checkTA, (req, res, next) => {
  const id = req.params.id;
  
  Course.findById(id)
  .then(course => {
    res.render("courses/edit-course", { course })
  })
  .catch(err => next(err))
});

passportRouter.post('/edit-course/:id', checkTA, (req, res, next) => {
  const id = req.params.id;
  const {title, duration} = req.body;
  
  Course.findByIdAndUpdate(id, {$set: {title, duration}})
  .then(user => {
    res.redirect("/list-courses")
  })
  .catch(err => next(err))
});

passportRouter.get('/delete-course/:id', checkTA, (req, res, next) => {
  const id = req.params.id;
  
  Course.findByIdAndDelete(id)
  .then(user => {
    res.redirect("/list-courses")
  })
  .catch(err => next(err))
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role[0] === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = passportRouter;