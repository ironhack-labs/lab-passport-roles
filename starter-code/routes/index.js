const express = require ('express');
const router = express.Router ();
const User = require ('../models/User');
const bcrypt = require ('bcrypt');
const bcryptSalt = 10;
const passport = require ('passport');
const ensureLogin = require ('connect-ensure-login');


/* GET home page */
router.get ('/', (req, res, next) => {
  res.render ('index');
});

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post ('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync (bcryptSalt);
  const hashPass = bcrypt.hashSync (password, salt);

  const newUser = new User ({
    username,
    password: hashPass,
  });
  newUser
    .save ()
    .then (userSaved => {
      res.redirect ('/');
    })
    .catch (error => {
      res.render ('/signup', {message: 'Something is wrong'});
    });
});

router.get ('/login', (req, res, next) => {
  res.render ('passport/login');
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get (
  '/private-page',
  ensureLogin.ensureLoggedIn (),
  (req, res) => {
    res.render ('passport/private', {user: req.user});
  }
);

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("./passport/private", { user: req.user });
});

router.post('/private/:id/delete', (req, res, next) => {
  User.findByIdAndRemove(req.params._id)
      .then(() => {
        res.redirect('/private/')
      })
      .catch(err => {
        console.log(err);
        next();
  });
})

router.get("/allUsers", ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find().then(user => {
    res.render("allUsers", { user: req.user });
  });
});


module.exports = router;
