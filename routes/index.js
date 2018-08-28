const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res, next) => {
  if (!req.user) {
    res.render("index");
  }
  if (req.user && req.user.role === "Boss") res.render("logged-in/boss/index");
  else res.render("logged-in/index");
});

module.exports = router;
