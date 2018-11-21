const express = require('express');
const router  = express.Router();
const {isLoggedIn} = require('../middlewares/isLogged');
const {roleCheck} = require('../middlewares/roleCheck');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', [isLoggedIn('/auth/login'), roleCheck("Boss")],(req,res) => {
  res.render('private');
});

router.get('/convertmetoadmin',(req,res) => {
  req.flash('error','You are boss now');
  req.user.role = "Boss";
  req.user.save().then( () => {
    res.redirect('/');
  });
});


module.exports = router;
