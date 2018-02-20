const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

router.get("/login", (req,res, next)=>{
    res.render("auth/login");
})

function checkRoles(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
};
router.get("/login"), (res,req,next) => {
  return res.render("/login", {
    message: req.flash("error")
  })
};

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/boss"), checkroles("Boss"), (req,res,next) => {
    User.find ({
        role: {
            $ne: "Boss"
        }
    },
    (err, users) => {
        if (err) {
            return next(err);
    }});
    return res.render("bosspage", {
        employees: users
    });
};

router.post('/boss', (req, res, next) => {
    User.findOne({
    username: req.body.username
    }, (err, user) => {
        if (err) return next(err);
        if (!user) {

            var salt = bcrypt.genSaltSync(bcryptSalt);
            const password = "ironhack";
            var encryptedPass = bcrypt.hashSync(password, salt);


            var employeeInfo = {
                username: req.body.username,
                role: req.body.role,
                password: encryptedPass
            };

            User.create(new User(employeeInfo), (err, user) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/boss');
            });
        } else {
            return res.redirect('/boss');
        }
    });
});

module.exports = router;

