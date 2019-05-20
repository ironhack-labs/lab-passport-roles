const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = 10;

const isBoss = (req, res) => {
  if (req.user.rol === "Boss") return true;
};

const isTA = (req, res) => {
  if (req.user.rol === "TA") return true;
};
router.get("/signup", (req, res) => res.render("auth/signup"));
router.post("/signup", (req, res) => {
  const { username, password, rol } = req.body;
  if (username.length === 0 || password.length === 0) {
    res.render("signup", { message: "rellena todos los campos" });
    return;
  }
  User.findOne({ username }).then(user => {
    if (user) {
      res.render("signup", { message: "usuario exixte" });
      return;
    }

    const bSalt = bcrypt.genSaltSync(salt);
    const hashPass = bcrypt.hashSync(password, bSalt);

    const newUser = new User({
      username,
      password: hashPass,
      rol
    });
    newUser
      .save()
      .then(x => res.redirect("/"))
      .catch(err => res.render("passport/signup", { message: `Error ${err}` }));
  });
  // User.findOne({rol})
});

router.get("/login", (req, res, next) =>
  res.render("auth/login", { message: req.flash("error") })
);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/landing-page",
    failureRedirect: "/user/login",
    failureFlash: true,
    passReqToCallback: true
  })
);
const ensureLogin = require("connect-ensure-login");
router.get("/landing-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  // res.render("auth/landing-page", { user: req.user, boss: isBoss(req, res)
  User.find()
    .then(allUser => {
      res.render("auth/landing-page", {
        user: allUser,
        theU: allUser,
        data: req.user,
        boss: isBoss(req, res)
      });
    })
    .catch(error => console.log(error));
});

router.get("/user-edit/", (req, res) => {
  User.findById(req.user_id)
    .then(editUser => res.render("auth/user-edit", { edit: editUser }))
    .catch(error => console.log(error));
});

// router.post("/edit/:user_id", (req, res) => {
//   const { username } = req.body;
//   User.update(
//     { _id: req.params.user_id },
//     { $set: { username } }
//   )
//     .then(x => res.redirect("/users"))
//     .catch(error => console.log(error));
// });

router.get("/auth/:user_id", (req, res) => {
  User.findById(req.params.user_id)
    .then(theUser =>
      res.render("auth/user-detail", {
        detail: theUser,
        ta: isTA(req, res)
      })
    )
    .catch(error => console.log(error));
});

module.exports = router;
