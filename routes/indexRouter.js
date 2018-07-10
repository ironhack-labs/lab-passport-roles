const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET private page */
router.get('/private', [
  ensureLoggedIn('/auth/login'), 
  hasRole('Boss'),
] , (req,res) => {
  res.render('private-page');
})

module.exports = router;
