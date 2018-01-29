const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');
const secure = require('../configs/passport.config')

router.get("/", authController.index);
router.get("/login", authController.login);
router.post("/login", authController.doLogin);
router.get("/signup", secure.checkRole("BOSS") || secure.checkRole("GOD"), authController.signup);
router.post("/signup", secure.checkRole("BOSS"), authController.doSignup);
router.get("/logout", secure.isAuthenticated, authController.logout)

module.exports = router;