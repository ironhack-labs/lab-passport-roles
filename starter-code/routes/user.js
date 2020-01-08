const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
const checkLogin = require("connect-ensure-login")

router.get("/home", checkLogin.ensureLoggedIn(), (req, res, next) => {

User.find()
.then((info) =>
  res.render("index", {info})
)
.catch(error => {
  console.log(error);
})
});
module.exports = router;