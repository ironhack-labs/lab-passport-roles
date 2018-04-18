const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const logged = require('../middlewares/logged');
const admin = require('../middlewares/admin');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index',{user:req.user});
});

router.get('/specialpage', (req, res, next) => {
  User.find()
    .then((users) => {
      console.log('Then de búsqueda de usuarios')
      console.log(users);
      res.render('specialpage', {
        user:req.user,
        allUsers: users,
      });
    })
    .catch((error) => {
      console.log('Error buscando usuarios')
      next(error);
    })
});

// , [logged('/pass/login'), admin('/')]
module.exports = router;
