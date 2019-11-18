const express = require('express');
const router = express.Router();
const passport = require('../passport/passport');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/login/:id',
  passport.authenticate('local', {
    failureRedirect: '/error'
  }), (req, res, next) => {
    res.redirect('/success?username=' + req.user.username);
  });

module.exports = router;