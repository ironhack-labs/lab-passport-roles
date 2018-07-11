const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET private page */  // todos los usuarios que se identifiquen pueda entrarr a la private page
router.get('/private', [
  ensureLoggedIn('/auth/login'), 
] , (req,res) => {
  res.render('private-page');
})

module.exports = router;
