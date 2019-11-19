const express = require('express');
const router  = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const { check, validationResult } = require('express-validator');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login');
});


router.get("signup", (req, res) => {
  res.render("users/signup")
})

router.post("/signup", [
  check('name').isLength({ min: 1 }),
  check('password').isLength({ min: 1 }), // falta verificar el Boss
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const user = {
    name : req.body.name,
    role : req.body.role,
    password: hash 
  };
  User.create(user)
  .then(userCreated => {
    res.redirect("/loggin"); //// cambiar
  })
  .catch(error => {
    res.render(error)
  })

})

module.exports = router;
