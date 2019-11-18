const express = require('express');
const router = express.Router();
const Users = require('../models/User')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* Login page*/
router.get(('/login'), (req, res, next) => {
  res.render('login')
})

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/platform",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.post(('/'), (req, res, next) => {
  //if fields are empty
  if (req.body.username === "" || req.body.password === "") {
    console.log({ alert: "Fields can't be empty" })
  }

  Users
    .findOne({ username: req.body.username })
    .then(userExists => {
      if (userExists) {
        res.json({ alert: "Username already exists" })
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new Users({
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



// Checkroles curry function
function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.redirect('/');
    }
  }
}

const checkBoss = checkRoles(["Boss"]);


router.get("/platform", ensureLogin.ensureLoggedIn(), checkBoss, (req, res) => {
  res.render("platform", {
    user: req.user,
  });
});




//If boss let access to platform
router.get("/employees", ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  Users.find()
    .then(allUsers => {
      res.render('employees', { allUsers })
    })
})

router.post("/employees", ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {

  Users
    .findOne({ username: req.body.username })
    .then(userFound => {
      Users.findByIdAndUpdate({_id: userFound.id}, req.body)
        .then(() => {
          res.redirect('employees')
        })
    })
})


router.get(('/employees/:id/edit'), ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  Users
    .findById({ _id: req.params.id })
    .then(userProfile => {
      res.render('edit', { userProfile })
    })
})


router.post(('/employees/:id/delete'), ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  Users
    .findByIdAndDelete({ _id: req.params.id })
    .then(userDeleted => {
      console.log({ alert: "User has been deleted" }, userDeleted);
      res.redirect('/employees')
    })
})


/* Boss Signup Page */
router.get('/signup', ensureLogin.ensureLoggedIn(), checkBoss, (req, res, next) => {
  res.render('signup');
})


module.exports = router;
