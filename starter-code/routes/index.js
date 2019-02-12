const express = require('express');
const router  = express.Router();
const passport = require('passport')

// Session middleware
const isRole = role = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.res.redirect(`/${req.user.role}`.toLocaleLowerCase())
  }
  return next()
}

// Login
router.post('/login', passport.authenticate('local') , (req,res,next) => {
  req.app.locals.loggedUser = req.user
  return res.redirect(`/${req.user.role}`.toLocaleLowerCase())
})
// FB login
router.get('/facebook', passport.authenticate('facebook'))

/* GET home page */
router.get('/', isRole, (req, res, next) => {
  res.render('index');
});



module.exports = router;
