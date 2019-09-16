const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const passport = require("passport");
const authSecurity = require("./../middlewares/sec.mid");
const Users = require ("./../models/Users.model")

router.use("/", authRoutes);

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    if (req.user.role === "BOSS") {
      res.render("pages/index", { user: req.user, isBoss: true });
      return;
    }
    res.render("pages/index", { user: req.user });
    return;
  } else {
    res.render("pages/index");
    return;
  }
});

module.exports = router;
