const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");


const checkDev = checkRoles('Developer');
const checkTA = checkRoles('TA');
const checkBoss = checkRoles('Boss');

passportRouter.get("/signup", (req, res) => res.render("passport/signup"))

passportRouter.post('/signup', (req, res, next) => {

  const {
    username,
    password,
    role
  } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: 'Rellena al menos Usuario y Contraseña!'
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render('passport/signup', {
          message: 'El usuario ya existe!'
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass,
        role
      })

      newUser.save()
        //.then(user => {console.log('usuario creado:', user); res.redirect("/")})
        .then(x => res.redirect("/"))
        .catch(err => res.render("passport/signup", {
          message: `Hubo un error: ${err}`
        }))
    })
})

// Login
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", {
    "message": req.flash("error")
  })
})

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})


// passportRouter.get('/private', ensureAuthenticated, (req, res) => {
//   res.render('passport/private', {
//     user: req.user
//   })
// })


passportRouter.get('/private', checkBoss, (req, res) => {
  res.render('private', {
    user: req.user
  });
});

function checkRoles(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}





function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/passport/login')
  }
}




// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", {
//     user: req.user
//   });
// });

module.exports = passportRouter;