const express = require('express');
const router  = express.Router();
const { User } = require('../models/user');
const { Course } =  require('../models/course');
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', ensureLogin.ensureLoggedIn(), async function(req, res, next) {
    const { username, role, _id } = req.user;

    let users;
    let courses = await Course.find();
    let user = {username, _id};

    try {
        if(role === "Boss") {
            users = await User.find({ role: {
                    $ne:"Boss"
                }}).select('username role _id');
            user.role = role;
        } else {
            users = await User.find()
                .select('username role _id');
        }

        res.render('main', {
            user,
            employers: users,
            courses

        });
    } catch(ex) {
        next(ex);

    }

});

module.exports = router;
