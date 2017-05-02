const bcrypt = require('bcrypt');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

const User = require('../models/user.js');

const userController = {};


// LIST
userController.list = route => (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log("req.user", req.user);
      console.log("users", users);
      res.render(route, { users, user: req.user });
    }
  });
};

// EDIT one user
userController.edit = route => (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
    } else {
      res.render(route, { user });
      console.log(user.password);
    }
  });
};

// UPDATE
userController.update = route => (req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const password = req.body.password;
  const hashPass = bcrypt.hashSync(password, salt);
  console.log(hashPass);
  User.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, username: req.body.username, password: hashPass, role: req.user.role } }, { new: true }, (err, user) => {
    if (err) {
      console.log(err);
      res.render('/admin/edit', { user });
    }
    res.redirect(route);
  });
};

// CREATE
userController.create = (req, res) => {
  res.render('admin/new');
};

// SAVE
userController.save = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;

  if (username === '' || password === '') {
    req.flash('error', 'Indicate username and password');
    res.render('admin/new');
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('admin/new', { error: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      role,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render('admin/new');
      } else {
        res.redirect('/admin');
      }
    });
  });
};

// DELETE
userController.delete = (req, res) => {
  User.remove({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
};

module.exports = userController;
