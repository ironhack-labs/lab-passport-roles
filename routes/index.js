const express = require('express');
const router  = express.Router();
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const isAdmin = require('../middlewares/isAdmin')

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user);
  console.log(req);
  res.render('index',{user:req.user});
});

router.get('/signup', isAdmin('Boss'), (req, res, next) => {
  res.render('passport/signup',{user:req.user});
});

module.exports = router;
