const siteController = require("express").Router();

/* GET home */
siteController.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = siteController;
