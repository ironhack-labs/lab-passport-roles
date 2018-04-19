const express = require("express");
const bcrypt = require('bcrypt');

const User = require("../models/user-model");
const passport = require('passport');
const router = express.Router();

  router.get('/admin/add-user', (req, res, next) => {
   if (!req.user || req.user.role !== "boss"){
    next();
    return;
   }   
    res.render('admin-views/add-user-form');
  });
  
  router.post ('/process-adduser', (req, res, next) => {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    User.create ( { name, email, encryptedPassword, role : "Ta" } )
    .then (() => {
      res.redirect("/");
    })
    .catch((err)=>{
      next(err);
    });
  });

  router.get('/login', (req, res, next) => {
    res.render('login-form');
  });

  router.post('/process-login', (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({email})
    .then( (userDetails) => {
      if(!userDetails) {
        res.redirect('/login');
        return;
      }
      const { encryptedPassword } = userDetails;
      if(!bcrypt.compareSync(password, encryptedPassword)) {
        res.redirect('/login');
        return;
      }
      req.login(userDetails, () => {
          res.redirect('/')
      });
    })
    .catch( (err) => {
      next(err);
    });
  });

  router.get('/logout', (req, res, next) => {
      req.logout();
      res.redirect('/');
  })

  router.get ("/userProfile/:userId", (req, res, next) => {
    User.findById (req.params.userId)
    .then ((userDetails)=>{
      res.locals.user = userDetails 
      res.render("userProfile");
    })
    .catch ((err) => {
      next(err);
    });
  });
module.exports = router;