const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const User = require("../model/user");

/* GET home page */
router.get("/", (req, res) => {
  res.render("layout", {
    section: "login"
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
  );

  router.get("/main", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("layout", {
      user: req.user,
      section: "main"
    });
  });



function checkRoles(roles) {
  return function(req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/main");
      } else {
        res.redirect("/login");
      }
    }
  };
}

const checkBoss = checkRoles(["BOSS"]);
const checkTa = checkRoles(["TA"]);

router.get('/signup', checkBoss, (req, res, next) => {
  res.render("layout", {
    section: "signup"
  });
});

router.post("/signup",checkBoss, (req, res, next) => {
  const { username, password, role } = req.body;

  if (username === "" || password === "") {
    res.render("error");
    return;
  }

  User.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        res.render("error");
        return;
      }
      const bcryptSalt = 2;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role
      });

      newUser.save((err) => {
        if (err) {
          res.render("error");
        } else {
          res.redirect("/main");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/remove", checkBoss, (req, res) => {
  res.render("layout", {
    user: req.user,
    section: "signup"
  });
});

router.get('/courses', checkTa, (req, res, next) => {
  res.render("layout", {
    section: "signup"
  });
});

module.exports = router;
