const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

router.get('/login', (req, res) => res.render('login',))   // console says req.flash is not a fuction when I add an error message??

router.post('/login', passport.authenticate('local', {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true 
}));

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", {
        user: req.user
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
});
module.exports = router;
