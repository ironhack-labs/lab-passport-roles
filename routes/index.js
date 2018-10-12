const express = require('express');
const router  = express.Router();
const User = require('../models/User');

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

function checkRole(role){
  return function (req, res, next){
    if(req.isAuthenticated() && req.user.role === role) return next();
    res.redirect("/private");
  }
}

const checkAdmin = checkRole("BOSS");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("private", {user: req.user});
});

router.get("/admin", checkAdmin, (req, res) => {

  User.find()
    .then(users => {
      res.render("admin", {user: req.user, users: users});
    });
});

router.post('/admin/delete', (req, res) => {

});

router.get('/admin/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.render ('userdetail', {header: user.title, user})
    })
});


module.exports = router;
