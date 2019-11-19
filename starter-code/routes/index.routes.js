const express = require('express');
const router  = express.Router();
const passport = require('passport')



/* GET home page */
router.get('/', (req, res) => res.render('index'))
// router.get('/successLogin', (req, res) => res.render('successLogin'))

router.get('/login', (req, res) => res.render('login', { "message": req.flash("error") }))

router.post("/login", passport.authenticate("local", {

  successRedirect: "/successLogin",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req,res) => {

  req.logout()
  res.redirect("/login")
  })

const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { roleErrorMessage: `Necesitas ser un ${role} para acceder aquí` })

router.get('/successLogin', checkRole('BOSS'), (req, res) => res.render('bossLogin', { user: req.user }))



// router.get('/successLogin', checkRole('DEVELOPER'), (req, res) => res.render('developerLogin', { user: req.user }))
// router.get('/successLogin', checkRole('TA'), (req, res) => res.render('taLogin', { user: req.user }))





module.exports = router;
