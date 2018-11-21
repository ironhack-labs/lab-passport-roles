const express = require('express');
const router  = express.Router();
const passport = require('passport');
const {isLoggedOut} = require('../middlewares/isLogged')


router.get("/login", isLoggedOut('/'), (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/auth/login",
  badRequestMessage: 'Las credenciales chavalxs!',
  failureFlash: true,
  passReqToCallback: true
}),(req,res) => {
  if(req.session.returnTo){
    return res.redirect(req.session.returnTo)
  }
  res.redirect('/');
});


router.get('/slack', passport.authorize('slack'));

router.get('/slack/callback',
  passport.authenticate('slack', {failureRedirect: '/login'}),
  (req, res) => res.redirect('/')
);


router.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/')
})

module.exports = router;
