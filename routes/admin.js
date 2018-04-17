const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middlewares/ensureLoggedIn")
const passport = require("passport");
const flash = require("connect-flash");
const isAdmin = require("../middlewares/isBoss")

router.get("/", [ensureLoggedIn('/auth/login'), isAdmin('/')], (req,res) => {
  res.render("../views/boss/index")
})

module.exports = router