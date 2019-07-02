const passport = require("passport");
const { Router } = require("express");
const router = Router();
const {
  getLogin,
  postLogin,
  logout
} = require("../controllers/authControllers");

router.get("/login", getLogin);
router.post("/login", passport.authenticate("local"), postLogin);
router.get("/logout", logout);

module.exports = router;
