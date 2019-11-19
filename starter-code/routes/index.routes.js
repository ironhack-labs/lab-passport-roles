const express = require('express');
const router = express.Router();
const passport = require('passport')
const ensureLogin = require("connect-ensure-login");

router.get('/', (req, res) => res.render('index'))

router.get('/boss', (req, res) => { res.render('boss') });

router.get("/login", (req, res) => res.render("login"))




router.get('/login', (req, res) => res.render('login', { "message": req.flash("error") }))
router.post("/login", passport.authenticate("local", {
  successRedirect: "/boss",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")

})
const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { roleErrorMessage: `Necesitas ser un ${role} para acceder aquí ` })
router.get('/boss', checkRole('BOSS'), (req, res) =>
  res.render('/boss', { user: req.user }))

module.exports = router;
