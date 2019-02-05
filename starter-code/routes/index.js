const express = require('express');
const router  = express.Router();
const User    = require('../models/user')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

router.get('/private', checkBoss, (req, res) => {
  res.render('private', {user: req.user});
});

router.post('/login', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
    username
  })
  .then(user => {
    if (user !== null){
      throw new error("Username already Exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User ({
      username,
      password: hashPass,
    });

    return newUser.save()

  })

    .then (user => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("/login"), {
        errorMessage: err.message
      }
    })
}) 

module.exports = router;

passportRouter.get("/login", (req, res, next) => {
  res.render("../views/passport/login.hbs");
});

