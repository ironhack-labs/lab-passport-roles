const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



router.get("/signup",(req,res)=>{
  res.render("passport/signup")
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

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
      roles: req.body.roles
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        console.log(newUser)
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.roles === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
 }

router.get("/private-page", [ensureLogin.ensureLoggedIn(),checkRoles("Boss")], (req, res) => {
  User.find()
  .then(user => {
    res.render("passport/private/private", { user });
  })
  .catch(error => {
    console.log(error)
  })
});

//EDIT
router.get("/private/edit/:id", (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
  .then(user => {
      res.render("passport/private/edit", {user});
  })
  .catch(error => {
      console.log(error)
  })
});
router.post('/private/edit/:id', (req,res) => {
  const { username, roles} = req.body;
  console.log('entra a r')
  User.findByIdAndUpdate(req.params.id,{ username, roles })
      .then( () => {
        console.log('then')
        res.redirect('/')
      })
      .catch(e => console.log(e));
 })

//DELETE c
router.get("/private/delete/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, () => res.redirect('/'))
});



module.exports = router;
