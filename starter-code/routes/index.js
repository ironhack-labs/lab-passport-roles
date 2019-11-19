const express = require('express');
const router  = express.Router();
const passport = require("passport");
const flash    = require('flash');





/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

  router.post(
    "/login",
    passport.authenticate("local", {
      successReturnToOrRedirect: "/users/",
      failureRedirect: "/login",
      failureFlash: true,
      passReqToCallback: true
    })
  );


module.exports = router;
