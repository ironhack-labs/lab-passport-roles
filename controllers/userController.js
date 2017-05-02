const mongoose = require('mongoose');

const User = require('../models/user.js');

const UserController = {};

UserController.list = function (req, res) {
  User.find({}).exec((err, users) => {
    if (err) {
      console.log('Error:', err);
    } else {
      res.render('admin/index', { users });
    }
  });
};

module.exports = UserController;
