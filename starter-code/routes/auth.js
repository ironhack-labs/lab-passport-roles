const express = require('express');
const router  = express.Router();
const passport      = require("passport");


router.post(
  "/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get('/login', (req,res,next) => {
  res.render('auth/login');
})

module.exports = router;
