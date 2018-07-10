const express = require('express');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const router  = express.Router();
const hasRole = require('../middleware/checkRoles');
const bcryptSalt = 10;


router.get('/add', (req, res, next) => {
  res.render('private/add');
});

router.post('/add', (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: [req.body.role]
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/user-list");
    })
    .catch(err => {
      console.log(err);
      res.render("private/add", {
        errorMessage: err.message
      });
    })
});

router.get('/platform', [
  hasRole('BOSS')
] , (req,res) => {
  res.render('private/platform');
})


router.get('/delete/:id',(req,res) => {
  User.findByIdAndRemove(req.params.id, () => res.redirect('/user-list'));
})

module.exports = router;
