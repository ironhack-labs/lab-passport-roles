const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private', [
  ensureLoggedIn('/passport/login'), 
  hasRole('Boss'),
] , (req,res) => {
  res.render('private-page');
});

module.exports = router;
