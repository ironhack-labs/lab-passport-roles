const express = require('express');
const router  = express.Router();
const passport = require('passport');
const {isLoggedOut} = require('../middlewares/isLogged')


router.get("/login", isLoggedOut('/'), (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  badRequestMessage: "Indicate username and password",
  failureFlash: true,
  passReqToCallback: true
}),(req,res) => {
  if(req.session.returnTo){
    return res.redirect(req.session.returnTo);
  }
  res.redirect('/');
});


router.get('/slack', passport.authorize('slack'));

router.get('/slack/callback',
  passport.authenticate('slack', {
    successRedirect: "/",
    failureRedirect: '/login'
  }),
  (req, res) => {res.redirect('/')}
);

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback",
passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login"
}),
  (req, res) => {res.redirect('/')}
);


router.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/')
})

module.exports = router;
