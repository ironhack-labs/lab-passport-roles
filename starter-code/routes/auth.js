const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

//Logout
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/login");
});

//Login
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  const email = req.user.email;
  const role = req.user.role;
  req.app.locals.user = req.user;
  res.send("Tu eres un usuario real con email: " + email + " y tu role es: " + role);
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

//Signup
router.get("/signup", (req, res, next) => {
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