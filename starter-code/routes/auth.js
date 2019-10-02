const express = require("express");
const router = express.Router();
const User = require("../models/User")
const passport = require("passport");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// =======================================================================================================================================
// Middleware checkRoles
function checkRoles(role) {
  return function(req, res, next) {    
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss  = checkRoles('BOSS');
const checkDeveloper = checkRoles('DEVELOPER');
const checkTA  = checkRoles('TA');

// =================================================================== SIGN IN ==========================================================
router.get("/signup", checkBoss, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", checkBoss, (req, res, next) => {
  const { username, password, role } = req.body;
  
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

// =================================================================== LOG IN ==========================================================
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// =================================================================== EDIT ==========================================================
router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render("auth/edit", { user })
    })
    .catch(err => {throw new Error(err)});
})

router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const { username, role } = req.body
  User.findByIdAndUpdate(id, { username, role })
    .then(user => {
      res.redirect('/')
    })
    .catch(err => {throw new Error(err)});
})


module.exports = router;