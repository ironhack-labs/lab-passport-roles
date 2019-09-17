
const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


// Role Check functions

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss = checkRoles('BOSS')

router.get('/add-and-remove-employees', checkBoss, (req, res) => {
  res.render('add-and-remove-employees', {user: req.user});
});


module.exports = router;