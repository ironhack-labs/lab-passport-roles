const express = require("express");
const router = express.Router();
const passport = require("passport");
const { get } = require("mongoose");
//const ensureLogin = require("connect-ensure-login")


//router.get('/boss', checkRole(['BOSS']), (req, res) => res.render('roles/boss'))

router.get('/boss', (req, res) => res.render())


module.exports = router;