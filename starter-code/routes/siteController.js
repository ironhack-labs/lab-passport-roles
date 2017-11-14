const express = require("express");
const siteController = express.Router();
const checkBoss = checkRoles('Boss');

siteController.get("/", (req, res, next) => {
  res.render("index");
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "Boss") {
      return next();
    } else {
      res.redirect('../views/Boss/plataform');
    }
  };
}

siteController.post('/index', checkBoss, (req, res) => {
  res.render('/Boss/plataform', {user: req.user});
});


module.exports = siteController;
