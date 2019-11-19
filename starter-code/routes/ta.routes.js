const express = require('express');
const router = express.Router();
const User = require('../models/user.models')

router.get("/", (req, res) => res.render("ta/index"))

module.exports = router;