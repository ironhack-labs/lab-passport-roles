const express        = require("express");
const siteController = express.Router();

// Home Page
siteController.get("/", (req, res, next) => {
  console.log(req.session);
  res.render("index");
});


// Sign-up Page

module.exports = siteController;
