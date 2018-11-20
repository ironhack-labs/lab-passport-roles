const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");


passportRouter.get('/list-users', ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find()
    .then(users => {
      const response = {users};
      const role = req.user.role[0];
      response[role] = role;

      res.render('list-users', {response})
    })
    .catch(err => next(err))
});



passportRouter.get('/edit-user/:id', (req, res, next) => {
  const id = req.params.id;
  
  User.findById(id)
  .then(user => {
    const response = {user};
    const role = req.user.role[0];
    response[role] = role;


    res.render("edit-user", { response })
  })
  .catch(err => next(err))
});

passportRouter.post('/edit-user/:id', (req, res, next) => {
  const id = req.params.id;
  const {username, password, role} = req.body;

  const query = password.length ? {$set: {username, password, role}} : {$set: {username, role}};
  
  User.findByIdAndUpdate(id, query)
  .then(user => {
    console.log("edited");
    res.redirect("/list-users")
  })
  .catch(err => next(err))
});

module.exports = passportRouter;