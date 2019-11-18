const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const User = require("../model/user");

/* GET home page */
router.get("/", (req, res) => {
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/main",
    failureRedirect: "/",
    passReqToCallback: true
  })
);

router.get("/main", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("main", {
    user: req.user
  });
});

router.get("/profiles", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find()
    .then(person => {
      console.log(person)
      if (req.user.role === 'BOSS'){
      res.render("delete-profiles", { person }
      )} else {
        res.render ('profiles', {person})
      }
    })
});

router.get('/edit/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      console.log(user)
      res.render('edit',
        user
      );
    })
    .catch(error => {
      next();
      console.log(error)
    });
});

router.post('/edit/:id', ensureLogin.ensureLoggedIn(),(req, res, next) => {
  User.updateOne({
    _id: req.params.id
  }, {
    username: req.body.username,

  })
  .then(() => {
    res.redirect("/main");
  })
    .catch(error => {
      next();
      console.log(error)
    });
});

function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect("/main");
      } else {
        res.redirect("/");
      }
    }
  };
}

const checkBoss = checkRoles(["BOSS"]);
const checkTa = checkRoles(["TA"]);

router.get('/signup', checkBoss, (req, res, next) => {
  res.render("signup");
});

router.post("/signup", checkBoss, (req, res, next) => {
  const {
    username,
    password,
    role
  } = req.body;
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

router.post("/:id/delete", checkBoss, (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/main");
    })
    .catch(error => {
      next();
      console.log(error)
    });
});

router.get('/courses', checkTa, (req, res, next) => {
  res.render("courses");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;