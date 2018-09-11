const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const { username, role } = req.user;
    let user = {username};
    if(role === "Boss") {
        user = { ...user, role}
    }

    res.render('main', {
        user
    });
});

module.exports = router;
