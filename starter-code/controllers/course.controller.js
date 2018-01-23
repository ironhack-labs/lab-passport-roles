const User = require('../models/user.model');
const Course = require('../models/course.model');

module.exports.formCourses = (req, res, next) => {
  Course.find().sort({
    createdAt: -1
  })
  .then(courses => {
    res.render('course/show', {
      courses: courses,
      role: "TA"
    });
  });

  // if (req.params.id == req.session.passport.user) {
  // User.findById(req.params.id).then(user => {
  //     res.render('user/profile', {
  //       user: user
  //     });
  //   })
  //   .catch(error => next(error));
  // } else {
  // res.redirect("/");
  // };
};

module.exports.createCourse = (req, res, next) => {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;
  if (!name || !startingDate || !endDate || !level || !available) {
    res.render('course/show', {
      course: {
        name: name
      },
      error: {
        name: name ? '' : 'Name is required',
        startingDate: startingDate ? '' : 'startingDate is required',
        endDate: endDate ? '' : 'endDate is required',
        level: level ? '' : 'level is required',
        available: available ? '' : 'available is required'
      }
    });
  } else {
    Course.findOne({
        username: req.body.name
      })
      .then(course => {
        if (course != null) {
          res.render('course/show', {
            course: course,
            error: {
              name: 'coursename already exists'
            }
          });
        } else {
          course = new Course(req.body);
          course.save()
            .then(() => {
              // req.flash('info', 'Successfully sign up, now you can login!');
              // res.send("GO TO LOGIN");
              Course.find().sort({
                  createdAt: -1
                })
                .then(courses => {
                  res.render('course/show', {
                    courses: courses,
                    role: "TA"
                  });
                });
              // res.redirect('/login');
            }).catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                res.render('course/show', {
                  course: course,
                  error: error.errors
                });
              } else {
                next(error);
              }
            });
        }
      }).catch(error => next(error));
  }
};