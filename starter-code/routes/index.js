const express = require('express');
const authRoutes  = express.Router();

/* GET home page */
authRoutes.get('/', (req, res, next) => {
  res.render('./../views/index.hbs');
});

module.exports = authRoutes;
