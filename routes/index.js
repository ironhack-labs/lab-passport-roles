const express = require('express');
const router  = express.Router();
const { User } = require('../models/user');
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', ensureLogin.ensureLoggedIn(), async function(req, res, next) {
    const { username, role } = req.user;
    let user = {username};
    let users;
    if(role === "Boss") {
        user = { ...user, role};
        users = await User.find({ role: {
            $ne:"Boss"
            }}).select('username role _id');
    }

    res.render('main', {
        user,
        employers: users

    });
});

module.exports = router;
