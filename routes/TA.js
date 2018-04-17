const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const passport = require("passport");
const flash = require("connect-flash");
const isAdmin = require("../middlewares/isBoss");
const User = require("../models/user");

router.get("/", [ensureLoggedIn("/login"), isAdmin("/")], (req, res) => {
  res.render("../views/boss/index");
});

router.get("/new", [ensureLoggedIn("/login"), isAdmin("/")], (req, res) => {
  res.render("../views/boss/new");
});

router.post("/new", (req, res) => {
  let { username, password, role } = req.body;
  const user = new User({ username, password, role });
  user.save().then(() => res.redirect("/admin"))
  .catch(err => res.render("error", err))
});

module.exports = router;