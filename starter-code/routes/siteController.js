const express = require("express");
const siteController = express.Router();

siteController.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/private', ensureAuthenticated, (req, res, next) => {

  Room.find({owner: req.user._id}, (err, myRooms) => {
    if (err) { return next(err); }

    res.render('rooms/index', { rooms: myRooms });
  });

});

module.exports = siteController;
