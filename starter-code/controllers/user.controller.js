const User = require('../models/user.model');

module.exports.profileId = (req, res, next) => {
  if (req.params.id == req.session.passport.user) {
    User.findById(req.session.passport.user).then(user => {
      res.render('user/profile', {
        user: user
      });
    })
    .catch(error => next(error));
  } else {
    res.redirect("/");
  };
};

module.exports.update = (req, res, next) => {
  User.findById(req.session.passport.user).then(user => {
    if (req.body.username != user.username) {
      res.redirect("/");
    } else {
      const user = new User({
        _id: req.session.passport.user,
        name: req.body.name,
        email: req.body.email,
        familyname: req.body.familyname,
        username: req.body.username
      });
      User.findByIdAndUpdate(user._id, user)
        .then(currentUser => {
          res.redirect(`/profile/${req.session.passport.user}`);
        })
        .catch(error => next(error));
    }
  })
  .catch(error => next(error));  
};