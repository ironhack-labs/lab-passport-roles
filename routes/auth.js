const express           = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/login', (req, res, next) => {res.render ('auth/login', {"message": req.flash("error")})})

router.post('/login', (passport.authenticate("local", {
successRedirect: "/",
failureRedirect: "/auth/login",
failureFlash: true,
passReqToCallback: true
})))


module.exports = router;