// routes/auth-routes.js
const passport = require("passport");
const express = require("express");
const ensureLogin = require("connect-ensure-login");

const authRoutes = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", { message: "The username already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass
        });

        newUser.save((err) => {
            if (err) {
                res.render("auth/signup", { message: "Something went wrong" });
            } else {
                res.redirect("/");
            }
        });
    });
});

authRoutes.get("/boss", (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return next(err);
        }
        console.log(users);
        res.render("auth/boss", {
            users: users
        });
    });
});

authRoutes.get("/login", (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return next(err);
        }
        console.log(users);
        res.render("auth/login", {
            users: users
        });
    });
});

authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/boss",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}));



function checkRoles(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login')
        }
    }
}

var checkBoss = checkRoles('Boss');
var checkTA = checkRoles('TA');
var checkDeveloper = checkRoles('Developer');
var checkAlumni = checkRoles('Alumni');


authRoutes.post("/boss", (req, res, next) => {
    const userInfo = {
        username: req.body.username,
        name: req.body.name,
        familyName: req.body.familyName,
        password: req.body.password,
        role: req.body.role
    };

    // Create a new users with the params
    const newUser = new User(userInfo);
    newUser.save(err => {
        if (err) {
            return next(err);
        }
        // redirect to the list of users if it saves
        return res.redirect("/boss");
    });
});

authRoutes.post("/boss/:id/delete", (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    User.findByIdAndRemove(id, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/boss")
    });
});


authRoutes.get("/boss/:id/edit", (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) {
            return next(err);
        }
        res.render("/edit", { user: user });
    });
});



authRoutes.post("/boss/:id", (req, res, next) => {
    const userId = req.params.id;

    /*
     * Create a new object with all of the information from the request body.
     * This correlates directly with the schema of user
     */
    const updates = {
        username: req.body.username,
        name: req.body.name,
        familyName: req.body.familyName,
        password: req.body.password,
        role: req.body.role
    };

    User.findByIdAndUpdate(userId, updates, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/boss");
    });
});

//authRoutes.get('/', checkTA, (req, res) => {
//  res.render('', { user: req.user });
//});

module.exports = authRoutes;