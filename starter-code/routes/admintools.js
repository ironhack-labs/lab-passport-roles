const express = require('express');
const router  = express.Router();

const User = require("../models/User")

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}

const boss = checkRoles("BOSS")
const ta = checkRoles("TA")
const developer = checkRoles("DEVELOPER")



const bcrypt = require('bcrypt')
const bcryptSalt = 10


router.get('/', boss, (req, res, next) => {
  res.render('admin-tools/tools');
});

router.post('/', boss, (req, res,next) => {
  const username = req.body.username
  const password = req.body.password
  const role = req.body.role

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  const newUser = new User (
    {username,
     password: hashPass,
     role })

  newUser.save()
    .then(user =>  res.render('admin-tools/tools'), {message: "Usuario creado"})
    .catch(err => console.log(`The user wasn't created ${err}`))
})

router.post('/delete', boss, (req, res, next) => {
  const id = req.body._id

  User.findByIdAndDelete(id)
    .then(user => res.redirect('/admintools', {message2: "Usuario borrado"}))
    .catch(err => console.log(err))
})

module.exports = router
