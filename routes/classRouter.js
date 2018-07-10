const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Course = require("../models/Course");
const passport = require("passport");
const router = express.Router();
const bcryptSalt = 10;

router.get("/clase", (req, res, next) => {
  res.render("auth/clase");
});

router.post(
  "/clase",
  passport.authenticate("local", {
    successRedirect: "/auth/clasePrivate",
    failureRedirect: "/auth/clase",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/clasePrivate", (req, res, next) => {
  User.find({ role: { $ne: "Boss" } }).then(users => {
    res.render("auth/clasePrivate", { users });
  });
});

router.get("/edit/:id", (req, res) => {
  User.findById(req.params.id).then(user => {
    res.render("auth/edit", { user });
  });
});

router.post("/edit/:id", (req, res, next) => {
  const { username, password, role } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findByIdAndUpdate(req.params.id, { username, password: hashPass, role })
    .then(user => {
      res.redirect("/auth/clasePrivate");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/coursesta", (req, res, next) => {
    Course.find({}).then(courses => {
      res.render("auth/coursesta", { courses });
    });
  });

  // router.post("/edit/:id", (req, res, next) => {
  //   const { username, password, role } = req.body;
  //   const salt = bcrypt.genSaltSync(bcryptSalt);
  //   const hashPass = bcrypt.hashSync(password, salt);
  
  //   User.findByIdAndUpdate(req.params.id, { username, password: hashPass, role })
  //     .then(user => {
  //       res.redirect("/auth/clasePrivate");
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // });

module.exports = router;
