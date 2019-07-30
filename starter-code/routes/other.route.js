const express        = require('express');
const passport       = require("passport");
const ensureLogin    = require("connect-ensure-login");

const router = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10


/* GET home page */
router.get('/', (req, res, next) => res.render('index'))
router.post('/', (req, res, next) => {

  const { username, password } = req.body

  if (username === "" || password === "") {
      res.render("index", { message: "Rellena todo" });
      return;
  }

  User.findOne({ username })
      .then(user => {
          if (user) {
              res.render("index", { message: "El usuario ya existe" });
              return;
          }

          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = new User({
              username,
              password: hashPass
          });

          User.create(newUser)
          .then(() => res.redirect('/'))
          .catch(err => console.log('Hubo un error:', err))
      })
      .catch(error => {
          next(error)
      })
});

// //RUTA LOGIN
// passportRouter.get('/login', (req, res, next) => {
//   res.render('passport/login', {"message": req.flash("error")})
// })
// passportRouter.post('/login', passport.authenticate('local', {
// successRedirect: "/private-page",
// failureRedirect: "/login",
// failureFlash: true,
// passReqToCallback: true
// }));

// // RUTA PRIVADA QUE ES REDIRECT EN LOGIN -> successRedirect
// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
// res.render("passport/private", { user: req.user });
// });

// //LOGOUT
// passportRouter.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/login");
// });


module.exports = router
