const express = require('express');
const router  = express.Router();
const passport = require("passport");
const mongoose     = require('mongoose');
const User = require("../models/user");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkBoss  = checkRoles('Boss');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET delete-employee */
router.get('/delete-employee/:id', (req, res, next) => {
  User.deleteOne( { _id: req.params.id } )
  .then( res.redirect('/edit-employees'))
  .catch(error => { next(error) })
});


/* GET edit_employees */
router.get('/edit-employees', checkBoss, (req, res, next) => {
  User.find()
  .then( users => {
    res.render('passport/edit_employees', { users });
  })
  .catch(error => { next(error) })
});

router.post("/edit-employees", checkBoss, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "" || role === "" ) {
    res.render("passport/edit_employees", { message: "All fields are required" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/edit_employees", { message: "The username already exists" });
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
        res.render("passport/edit_employees", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  // failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;
