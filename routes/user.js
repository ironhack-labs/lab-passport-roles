'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const routeGuardMiddleware = require('./../controllers/route-guard-middleware');

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('login', {

  successRedirect: "/private",
  failureRedirect: "/"
}));


router.get('/private', routeGuardMiddleware, (req, res, next) => {
  res.render('private');
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
