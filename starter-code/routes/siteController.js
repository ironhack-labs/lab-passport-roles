const express = require("express");
const siteController = express.Router();

siteController.get("/", (req, res, next) => {
  res.render("index");
});

router.post('/index', checkRoles('Boss'), (req, res) => {
  res.render('/Boss/plataform', {user: req.user});
});


module.exports = siteController;
