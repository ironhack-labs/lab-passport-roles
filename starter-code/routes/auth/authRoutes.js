const router = require("express").Router();
const User = require("../../models/User");
const passport = require("passport");
const validate = require("../../middleware/roles")

function checkIfIsHere(req, res, next) {
    console.log("logeado??", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/auth/login");
}

function checkIfIs(role) {
    return function(req, res, next) {
        if (req.user.role === role) return next();
        return res.send({ message: `No eres un ${role}` });
    };
}

router.get(
    "/callback/facebook",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.json(req.user);
    }
);

router.post("/facebook", passport.authenticate("facebook"), (req, res) => {});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/auth/login");
});



router.post("/login", passport.authenticate("local"), (req, res, next) => {
    const email = req.user.email;
    req.app.locals.user = req.user;
    res.send("Tu eres un usuario real con email: " + email);
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.get("/signup",checkIfIs('Boss'), (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
    User.register(req.body, req.body.password)
        .then(user => {
            res.json(user);
        })
        .catch(e => next(e));
});

module.exports = router;