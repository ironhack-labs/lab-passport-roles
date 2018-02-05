const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureLogin = require("connect-ensure-login");

module.exports = router;
