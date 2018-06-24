const express = require('express');
const router = express.Router();
const passport= require('passport');
const bcrypt  = require('bcrypt');
const bcryptSalt    = 10;
const ensureLogin = require('connect-ensure-login');
const Users   = require('../models/user');



function checkRoles(role){
    return function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/login');
      }
    };
  }
  
  router.get('/editemployees', checkRoles('Boss'), (req, res) => {
    Users.find()
      .then(user => {
        res.render('editEmployees', {user});
      })
      .catch(err => {
        console.log('The Whackamole has struck again');
        next();
      });
  });
  
  router.get('/editemployee/:id', checkRoles('Boss'), (req, res, next) => {
    Users.findOne({_id: req.params.id})
    .then(user => {
      // res.send(user)
      res.render('editEmployee', {user});
    })
    .catch(err => {
      console.log('Oopsie Daisy you must be crazy: ', err);
      next();
    });
  });
  
  router.post('/editemployee/:id', (req, res, next) => {
    const {name, username, password, role, profile} = req.body;
    Users.findByIdAndUpdate({_id: req.params.id}, {name, username, password, role, profile})
      .then(user => {
        if (req.user.role == 'Boss'){
          res.redirect('/editemployees');
        } else {
          res.redirect('/');
        }
        // res.send(user)
      })
      .catch(err => {
        console.log('Couldn\'t update employee because they\'re currently on strike:', err);
        next();
      });
  });
  
  router.get('/delete/:id', (req, res, next) => {
    Users.findByIdAndRemove({_id: req.params.id})
      .then(user => {
        res.redirect('/editemployees');
      })
      .catch(err => {
        console.log('Just TRY to catch me but I\'ll run faster than you ever have: ', err); 
      });
  });
  
  router.get('/addemployee', checkRoles('Boss'), (req, res) => {
    res.render('addEmployee', {user: req.user});
  });
  
  router.post('/addemployee', (req, res, next) => {
    const {name, username, password, role, profile} = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(password, salt);
  
    const newUser = new Users({name, username, password: hash, role, profile})
    newUser.save()
      .then(user => {
        res.redirect('/');
      })
      .catch(err => {
        console.log('Wreck em Ralph: ', err);
        next();
      });
  });
  
  router.get('/employees', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Users.find()
    .then(user => {
      res.render('show', {user});
    })
    .catch(err => {
      console.log('Ya dun goofed check yo code: ', err);
      next();
    });
  });
  
  router.get('/edit', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Users.findOne({_id: req.user._id})
      .then(user => {
        res.render('editEmployee', {user})
      })
      .catch(err => {
        console.log('YEEEEHAWWW it\'s DEBUGGING TIME!!: ', err);
        next();
      });
  });

  module.exports = router;