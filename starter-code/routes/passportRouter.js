const express = require("express");
const passportRouter = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");



function checkRoles(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        } else {
            res.redirect('/login')
        }
    }
}



passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});


passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(null, false, { message: "Incorrect username" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: "Incorrect password" });
        }
        console.log(user)
        return next(null, user);
    });
}));


passportRouter.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
}));




passportRouter.use(passport.initialize());
passportRouter.use(passport.session());


passportRouter.get('/signup', (req, res) => {
    res.render('passport/signup', { user: req.user });

});


passportRouter.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if (username === "" || password === "") {
        res.render("passport/signup", { message: "Indicate username and password" });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (user !== null) {
                res.render("passport/signup", { message: "The username already exists" });
                return;
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username,
                password: hashPass,
                role
            });

            newUser.save((err) => {
                if (err) {
                    res.render("passport/signup", { message: "Something went wrong" });
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch(error => {
            next(error)
        })
});




//get-post login
passportRouter.get("/login", (req, res, next) => {
    res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))




//get-post all profiles
passportRouter.get("/allProfiles", ensureLogin.ensureLoggedIn(), (req, res) => {
    User.find({})
        .then(users => {
            res.render("allUsers/allProfiles", { users })
        })
        .catch(err => console.log(err))
});







//logout
passportRouter.get("/logout", (req, res, next) => {
    req.logout()
    res.redirect("/login")
})

//boss en private
passportRouter.get('/private', checkRoles('BOSS'), (req, res) => {
    res.render('passport/private', { user: req.user });
});



module.exports = passportRouter;