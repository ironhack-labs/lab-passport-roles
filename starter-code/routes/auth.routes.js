const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/// SIGN UP FORM

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", { message: "Introduce un usuario y contraseña" });
    return;
  }

  User.findOne({ username })

    .then(user => {
      if (user) {
        res.render("auth/signup", { message: "El usuario ya existe, merluzo" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(x => res.redirect("/"))
        .catch(err => {
          console.log(err);

          res.render("auth/signup", {
            message: "Algo fue mal, inténtalo más tarde. Oopsy!"
          });
        });
      
      
      
    })
    .catch(error => {
      next(error);
    });
});

//BOSS PAGE ADD / LIST & DELETE
router.get("/boss-page", (req, res, next) => {
  // res.render('celebrities')
  User.find()
    .then(allUser =>
      res.render("boss", { bobi: allUser })
    )
    .catch(err => console.log("Error en el DB: ", err));
});


router.get("boss-page/:id", (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    console.log('ciao')
    .then(x => res.redirect("/boss-page"))
    .catch(err => console.log("error en el DB", err));
});




// LOG IN FORM


router.get("/login", (req, res) =>
  res.render("auth/login", { message: req.flash("error") })
);

//// En caso de succes coe hacer un redirect dinamico a cada pagina del rol como indicata en roles.route ?
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) =>
  res.render("private", { user: req.user })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;
