const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("signup");
});

function checkRoles(roles) {
  return function(req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
}

const checkBoss = checkRoles(["Boss"]);
const checkDeveloper = checkRoles(["Developer"]);
const checkTA = checkRoles(["TA"]);

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/success",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.json({
      message: "Indicate username and password"
    });
    return;
  }

  User
    .findOne({ username: req.body.username })
    .then(userExists => {
      if (userExists) {
        res.json({ alert: "Username already exists" })
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
          username: req.body.username,
          password: hashPass,
          role: req.body.role
        })

        newUser
          .save()
          .then(userCreated => {
            res.json({ alert: "User created sucessfully", userCreated })
          })
          .catch(err => {
            console.log(`Error saving new user in the db: ${err}`)
          })
      }
    })
})

router.get("/success", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("success", {
    user: req.user
  });
});

router.get("/update/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
  User
    .findById({ _id: req.params.id })
    .then(userProfile => {
      res.render('update', { 
        userProfile,
        user: req.user
      })
    })
})

router.get("/signup", checkBoss, (req, res) => {
  res.render("signup");
})

router.post("/update", ensureLogin.ensureLoggedIn(), (req, res) => {
  const plainPass = req.body.password;
  if (req.body.username.length > 0 && plainPass.length > 0) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(plainPass, salt);
    User.find({
        username: req.body.username
      })
      .then((a) => {
        console.log(req.session.passport.user);
        if (a.length <= 0) {
          User.findByIdAndUpdate(req.session.passport.user, {
              username: req.body.username,
              password: hash,
            })
            .then(() => {
              res.redirect("/success");
            })
        } else {
          res.render("update", {
            message: "The username already exists",
          });
        }
      })
  } else {
    res.render("update", {
      message: "You must fill both user name and password fields!"
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/profile/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.findById(req.params.id).then(user => res.render("profile", user))
})


module.exports = router;
