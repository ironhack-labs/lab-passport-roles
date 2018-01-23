const User = require('../models/user.model');

module.exports.formCourses = (req, res, next) => {
  res.send("YOU ARE IN COURSES");
  
  // if (req.params.id == req.session.passport.user) {
  User.findById(req.params.id).then(user => {
      res.render('user/profile', {
        user: user
      });
    })
    .catch(error => next(error));
  // } else {
  // res.redirect("/");
  // };
};