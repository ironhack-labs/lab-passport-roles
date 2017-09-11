const router = require("express").Router()
const User = require("../models/User")
const passport = require('passport')

router.get('/private', (req, res) => {
  res.render('private')
})

// router.get('/private', checkRoles('ADMIN'), (req, res) => {
//   res.render('private', {user: req.user});
// });

module.exports = router
