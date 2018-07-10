const express = require('express');
const router  = express.Router();
//const role = require("../midleware/ensureLogin");
const { ensureLoggedIn, hasRole } = require('../midleware/ensureLogin');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/auth/bosspanel', [
  ensureLoggedIn('/auth/login'), 
  hasRole('BOSS')
] , (req,res) => {
  res.render('bosspanel');
})

module.exports = router;
