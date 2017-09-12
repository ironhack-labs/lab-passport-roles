const express        = require("express");
const courses        = express.Router();
const Course         = require("../models/course");
const ensureLogin    = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login');
    }
  };
}

const checkTA  = checkRoles('TA');

// Render view courses page
courses.get('/view', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  Course.find({}, (err, courses) => {
    if (err) {return next(err);}
    else {
      res.render('courses/view', {courses});
    }
  });
});


// Render create new course page
courses.get('/new', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  res.render('courses/new');
});


// Edit Course
courses.get('/:courseId/edit', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId, (err, course) => {
    if (err) { return next(err); }
    else {
      let formattedStartingDate = '';
      let formattedEndDate = '';
      if (course.startingDate) {
        formattedStartingDate = course.startingDate.toISOString().substr(0, 10);
      }
      if (course.endDate) {
        formattedEndDate = course.endDate.toISOString().substr(0, 10);
      }
      res.render('courses/edit', {course, formattedStartingDate, formattedEndDate});
    }
  });
});

courses.post('/:courseId/edit', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;

  const updates = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    level: req.body.level,
    available: req.body.available
  };

  Course.findByIdAndUpdate(courseId, updates, (err, course) => {
    if (err) { return next(err); }
    else {
      res.redirect('/courses/view');
    }
  });
});



// Delete Course
courses.get('/:courseId/delete', ensureLogin.ensureLoggedIn(), checkRoles('TA'), (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findByIdAndRemove(courseId, (err, course) => {
    if (err) { return next(err); }
    else {
      res.redirect('/courses/view');
    }
  });
});



module.exports = courses;
