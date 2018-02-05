const express = require('express');
const siteController = express.Router();

siteController.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = siteController;
