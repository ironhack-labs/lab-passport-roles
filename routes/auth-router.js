const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");


// Routes -----

router.get("/signup", (req, res, next) => {
    res.render("auth-views/signup-form");
});

router.post("/process-signup", (req, res, next) => {
    if (req.user.role === "Boss"){
        const {fullName, email, password, role} = req.body;
        if (password === "" || password.match(/[0-9]/) === null){
            // "req.flash()" is defined by the "flash" package
            req.flash("error", "Your password must have at least one number");
            res.redirect("/signup");
            return;
        }
        
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(password, salt);
    
        User.create({fullName, email, encryptedPassword, role})
            .then(() => {
                    // "req.flash()" is defined by the "flash" package
                req.flash("success", "You have signed up! Try logging in.");
                res.redirect("/");
            })
            .catch((err) => {
                next(err);
            });

        return;
    };
    
    
    
    
    const {fullName, email, password} = req.body;

    // password can't be blank and requires a number
    if (password === "" || password.match(/[0-9]/) === null){
        // "req.flash()" is defined by the "flash" package
        req.flash("error", "Your password must have at least one number");
        res.redirect("/signup");
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    User.create({fullName, email, encryptedPassword})
        .then(() => {
             // "req.flash()" is defined by the "flash" package
            req.flash("success", "You have signed up! Try logging in.");
            res.redirect("/");
        })
        .catch((err) => {
            next(err);
        });
    });

router.get("/login", (req, res, next) => {
    res.render("auth-views/login-form");
});

router.post("/process-login", (req, res, next) => {
    const {email, password} = req.body;

    User.findOne({email})
        .then((userDetails) => {
            if (!userDetails){
                req.flash("error", "Wrong email.");
                res.redirect("/login");
                return;
            } 

            const {encryptedPassword} = userDetails;
            if (!bcrypt.compareSync(password,encryptedPassword )){
                req.flash("error", "Wrong password");
                res.redirect("/login");
                return;
            } 
            
            // req.session.isLoggedIn = true;
            // "req.login()" is Passport's method for logging a user in
            req.flash("success", "Log in successful!");
            req.login(userDetails, (userDetails) => {
                res.redirect("/");
            });
            
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/logout", (req, res, next) => {
    // "req.logout()" is Passport's method for logging a user OUT
    req.logout();
    req.flash("success", "Log out successful!");
    res.redirect("/");
})

router.get("/google/login", 
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"
        ]
    }));
router.get("/google/success", 
    passport.authenticate("google", {
        successRedirect: "/",
        successFlash: "Google lig in success!",
        failureRedirect: "/login",
        failureFlash: "Google log in failure."
    }));


router.get("/github/login", passport.authenticate("github"));
router.get("/github/success", passport.authenticate("github", {
    successRedirect: "/",
    successFlash: "Github log in success!",
    failureRedirect: "/login",
    failureFlash: "Github log in failure"
}));

module.exports = router;