const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
   res.render('index');
 });

router.get('/auth/private', [
  ensureLoggedIn('/auth/login'), 
  hasRole('Boss', '/'),
] , (req,res) => {
  res.render('auth/private');
})

module.exports = router;
