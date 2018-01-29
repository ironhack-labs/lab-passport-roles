const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth.controller');
const secure = require('../configs/passport.config')

router.get("/", authController.index);
router.get("/login", authController.login);
router.post("/login", authController.doLogin);
router.get("/signup", authController.signup);
router.post("/signup", authController.doSignup);
router.get("/logout", secure.isAuthenticated, authController.logout)

module.exports = router;