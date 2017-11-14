const express = require("express");
const adminController = express.Router();
// User model
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const checkRoles = require('../middlewares/checkRoles');
const checkBoss = checkRoles('BOSS');


adminController.get('/admin/create-user' , checkBoss, (req, res) => {
  res.render('admin/create-user');
});

adminController.post('/admin/create-user', (req, res) => {
  const { username, password, name, familyName, role } = req.body;

  if (username === "" || password === "") {
    res.render('/admin/create-user', { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render('/admin/create-user', { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      familyName,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render('/admin/create-user', { message: "Something went wrong" });
      } else {
        res.redirect("/profile/home");
      }
    });
  });
});

adminController.post('/admin/delete-user/:id',checkBoss, (req, res) => {
  let id = req.params.id;

  User.findByIdAndRemove(id, (err, course) => {
    if (err){ return next(err); }

    return res.redirect('/profile/home');
  });
});

module.exports = adminController;
