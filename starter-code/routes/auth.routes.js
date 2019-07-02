const passport = require("passport");
const { Router } = require("express");
const router = Router();
const { getLogin, postLogin, getLogout } = require("../controllers/auth.controllers");

router.get("/login", getLogin);
router.post("/login", passport.authenticate("local"), postLogin);

router.get("/logout", getLogout);

router.get('/slack', passport.authenticate('slack'))

router.get('/slack/callback', passport.authenticate('slack',{
	successRedirect: '/',
	failureRedirect: "/"
}))

module.exports = router;
