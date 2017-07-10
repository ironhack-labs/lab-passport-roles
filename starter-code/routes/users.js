const express = require("express");
const userController = express.Router();
const User = require('../models/User');
const ensureLogin = require("connect-ensure-login");

userController.get('/', (req, res, next) => {
    User.find({}).exec().then(users => {
    return res.render('users/show', {
      title: `Usuarios de la plataforma`,
      users: users
    });
  }).catch(e => console.log(e));
});


userController.get('/:id', (req, res, next) => {

    return res.render('users/edit');

});

userController.post('/:id', function(req, res, next) {


    let updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone

    };
    let id = req.params.id;
    console.log(req.params);
    User.findByIdAndUpdate(req.params.id, updates, (err, p) => {
      if(err){
        console.log("fallo");

      }
      res.redirect(`/`);
    });
});
