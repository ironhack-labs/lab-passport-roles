const express = require('express');
const staffRouter  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport'); 
const secure = require('../middlewares/secure');
const ensureLogin = require("connect-ensure-login");

staffRouter.get('/staff', secure.checkLogin, (req, res, next) => {
  User.find()
    .then(employee => {
      if (req.user.role === 'Boss') {
        res.render('employees/staff', {employee})
      } else {
        res.render('employees/staff-basic', {employee})
      }
    })
    .catch(err => console.log('Employee can not be found', err))
});

staffRouter.get('/staff/new', (req, res, next) => {
  res.render('employees/new');
});

staffRouter.get('/profile', secure.checkLogin, (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then(user => res.render('employees/profile', {user}))
    .catch(err => console.log('Invalid ID', err))
});

staffRouter.get('/staff/:id', secure.checkLogin, (req, res, next) => {
  const employeeId = req.params.id;
  User.findById(employeeId)
    .then(employee => res.render('employees/show', {employee}))
    .catch(err => console.log('Invalid ID', err))
});

staffRouter.post('/staff/new', secure.checkRole('Boss'), (req, res, next) => {
  const { username, name, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('employees/new', { message: 'Please indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('employees/new', { message: 'Username already exists'})
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User ({
        username,
        name,
        role,
        password: hashPass
      });

      newUser.save()
        .then(() => res.redirect('/staff'))
        .catch(error => next(error))
    }) 
    .catch(error => next(error))
});

staffRouter.post("/staff/delete/:id", secure.checkRole('Boss'), (req, res, next) => {
  const employeeId = req.params.id;
  User.findByIdAndRemove(employeeId)
    .then(() => {
      console.log('Removed employee');
      res.redirect("/staff");
    })
    .catch(err => {
      console.log("Couldn't delete this employee, sorry" ,err);
      next();
    });
});

staffRouter.get('/staff/edit/:id', secure.checkRole('Boss'), (req, res, next) => {
  const employeeId = req.params.id;
  User.findById(employeeId)
  .then(employee => res.render('employees/edit', {employee}))
  .catch(err => console.log('Couldnt edit:', err))
})

staffRouter.post('/staff/edit/:id', secure.checkRole('Boss'), (req, res, next) => {
  const employeeId = req.params.id;
  const { username, name, info, role } = req.body
  User.findByIdAndUpdate(employeeId, {$set: { username, name, info, role }}, {new: true})
    .then(() => res.redirect('/staff'))
    .catch(err => console.log('Couldnt update:', err))
})

staffRouter.get('/profile/edit', secure.checkLogin, (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then(user => res.render('employees/profile-edit', {user}))
    .catch(err => console.log('Invalid ID', err))
})

staffRouter.post('/profile/edit', secure.checkLogin, (req, res, next) => {
  const userId = req.user._id;
  const { username, name, info } = req.body
  User.findByIdAndUpdate(userId, {$set: { username, name, info }}, {new: true})
    .then(() => res.redirect('/profile'))
    .catch(err => console.log('Couldnt update:', err))
})

module.exports = staffRouter;