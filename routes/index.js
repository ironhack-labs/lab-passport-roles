const express = require('express');
const hasRole = require('../middleware/checkRoles');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', [
  hasRole('BOSS')
] , (req,res) => {
  res.render('private/profile');
})

module.exports = router;
