const express = require('express');
const router  = express.Router();
const User = require('../models/user.js');

// function checkRoles(role) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect('/login')
//     }
//   }
// }

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect('/login')
//   }
// }

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/private', checkRoles('BOSS'), (req, res) => {
//   User.find()
//   .then(users => {
//     res.render('private', {users});
//   })
//   .catch(error => {
//     console.log(error)
//   })
// });
module.exports = router;
