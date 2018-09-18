const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;

function CheckTheRole (role) {
  return function (req, res, next) {
    console.log(req.user);
    if(req.user.role==role){
      next()
    }
  }
}


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/login", (req, res, next) => {
  res.render("login")
})
// router.post("/login", (req, res) => {
  
//   console.log(req.body)
//   res.render("login");
// })
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

router.get("/add", [ensureLogin.ensureLoggedIn(), CheckTheRole('Boss')], (req, res, next) => {
  console.log('entra')
  res.render("add")
})

router.post("/add", (req, res, next) => {
  const { name, password, role } = req.body;
  if (name === "" || password === "" || role === "") {
    res.render("add", {
      error: "UNO DE LOS CAMPOS NO SE HA INTRODUCIDO CORRECTAMENTE"
    })
    return;
  }

  User.findOne({ name })
    .then(user => {
      if (user != null) {
        res.render("add", {
          error: "El usuario ya existe"
        })
        return;
      }

      
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        password: hashPass,
        role
      });

      newUser.save(err => {
        if (err) {
          res.render("add", {
            error: "Error en la Base de Datos"
          })
        } else {
          res.render("index");
        }
      })
    })
    .catch(err => next(err))
})



module.exports = router;
