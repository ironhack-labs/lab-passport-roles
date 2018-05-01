const express     = require("express");
const router      = express.Router();
const passport    = require("passport");
const User        = require("../models/user");
const Room        = require("../models/courses");
const flash       = require("connect-flash");


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    res.redirect('/login')
  }
}


router.get('/courses/new', (req, res, next) => {
  res.render('courses/new')
});


router.post('/courses/create', ensureAuthenticated, (req, res, next) => {
  const newRoom = new Room ({
    name:  req.body.roomName,
    desc:  req.body.roomDescription,
    owner: req.user._id   // <-- we add the user ID
  });

  newRoom.save ((err) => {
    if (err) { return next(err); }
    else {
      res.redirect('/courses');
    }
  })
});


router.get('/courses', ensureAuthenticated, (req, res, next) => {

  Course.find({owner: req.user._id}, (err, myRooms) => {
    if (err) { return next(err); }

    res.render('courses/index', { rooms: myRooms });
  });

});




module.exports = router;