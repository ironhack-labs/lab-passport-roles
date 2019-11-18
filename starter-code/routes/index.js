const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");

function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/list");
      } else {
        res.redirect("/login");
      }
    }
  };
}

const checkBoss = checkRoles(["BOSS"]);
const checkDeveloper = checkRoles(["DEVELOPER"]);
const checkTA = checkRoles(["TA"]);

/* GET home page */
router.get('/', (req, res, next) => {
  res.redirect('/login');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/list",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/create", checkBoss, (req, res) => {
  res.render("create");
})

router.post("/create", checkBoss, (req, res) => {
  const plainPass = req.body.password;
  if (req.body.username.length > 0 && plainPass.length > 0) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(plainPass, salt);
    User.find({
        username: req.body.username
      })
      .then((a) => {
        if (a.length <= 0) {
          User.create({
              username: req.body.username,
              password: hash,
              role: req.body.role
            })
            .then(newUser => {
              res.redirect("/list");
            })
        } else {
          res.render("create", {
            message: "The username already exists",
          });
        }
      })
  } else {
    res.render("create", {
      message: "You must fill both user name and password fields!"
    });
  }
});

router.get("/list", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find().then(users => {
    res.render("list", {
      users
    })
  });
})

router.get("/delete/:id", checkBoss, (req, res) => {
  User.findByIdAndDelete(req.params.id).then(() => res.redirect("/list"))
})

router.get("/update/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.session.passport.user === req.params.id) {
    User.findById(req.params.id).then(user => res.render("update", user))
  } else {
    res.redirect("/list");
  }
})

router.get("/create", checkBoss, (req, res) => {
  res.render("create");
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
            .then(newUser => {
              res.redirect("/list");
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