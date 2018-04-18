const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const isBoss = require("../middleware/isBoss")
//const ensureLogin = require("connect-ensure-login");

router.get("/", (req, res, next) => {
  if(req.user){
    let user = req.user
    res.render("index", {user});
  }else{
    res.render("index")
  }

});

router.get(
  "/boss",
  [ensureLoggedIn("/passport/login"), isBoss("/")],
  (req, res, next) => {
    res.render("boss", { user: req.user });
  }
);
module.exports = router;
