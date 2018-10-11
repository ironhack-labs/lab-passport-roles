const express = require('express');
const siteRoutes  = express.Router();
const
  User = require(`../models/User`),
  Course = require(`../models/Course`)
;

/* GET home page */
siteRoutes.get('/', (req, res, next) => {
  res.render('index');
});

function isLogged(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login`);
}

function checkRole(role) {
  return (req,res,next) => {
    if (req.isAuthenticated() && req.user.role === role) return next()
    res.redirect(`/user`);
  }
}

const checkBoss = checkRole(`boss`);

siteRoutes.get( `/boss`, checkBoss, (req,res) => {
  User
    .find({role: {$ne: `boss`}})
    .then( users => {
      res.render(`private/boss`, {users, user: req.user, boss:true})
    })
  ;
});

siteRoutes.get(`/boss/delete/:id`, (req,res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => res.redirect(`/boss`))
  ;
});

siteRoutes.get( `/user`, isLogged, (req,res) => {
  User
    .find({role: {$ne: `boss`}})
    .then( users => {
      Course
        .find()
        .then( courses => {
          if (req.user.role === `ta`) return res.render(`private/user`, {users, courses, user: req.user, ta:true});
          res.render(`private/user`, {users, courses, user: req.user})
        })
      ;
    })
  ;
});

siteRoutes.post(`/user`, (req,res) => {
  User
    .findByIdAndUpdate(req.body.id, {$set: req.body})
    .then(() => res.redirect(`/user`))
  ;
});

siteRoutes.post(`/user/create`, (req,res) => {
  Course
    .create(req.body)
    .then(() => res.redirect(`/user`))
  ;
})


module.exports = siteRoutes;