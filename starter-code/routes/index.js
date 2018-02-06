'use strict'

// routes/auth-routes.js
const express = require("express");
const index = express.Router();

// Render index
index.get("/", (req, res, next) => {
    res.render("index");
  });

module.exports = index;