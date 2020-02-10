const express = require('express');
const router = express.Router();

const User = require("../models/user.model")


/* GET home page */
router.get('/', (req, res, next) => {

  User.find()  //Hacemos la lista de users
    .then(users => res.render('index', {
      users: users
    }))
    .catch(err => console.log(`Error al encontrar el usuario ${err}`))
});

module.exports = router;
