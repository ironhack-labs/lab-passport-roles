const express = require("express");
const router = express.Router();
const User = require("../models/User");
const checker = require("../middlewares/checker");

router.get("/alumni", checker.checkLogin, (req, res) => {
  if (req.user.role === "Student") {
    User.find()
      .sort({ username: 1 })
      .then(alumni => {
        return (students = alumni.filter(a => a.role === "Student"));
      })
      .then(alumni => {
        res.render("alumni/index", { alumni });
      });
  } else {
    req.flash("msg", "You are not allowed to visit this page");
    res.redirect("/private");
  }
});


router.get("/alumni/:id", checker.checkLogin, (req, res, next) => {
  User.findById(req.params.id)
  .select({ _id: 0, password: 0 })
    .then(alumni => {
      res.render("alumni/detail", { alumni });
    })
    .catch(error => next(error));
});

module.exports = router;
