const express = require("express");
const siteController = express.Router();
const User         = require("../models/user")
const bcrypt       = require("bcrypt")
const bcryptSalt   = 10
const ensureLogin  = require("connect-ensure-login")
const passport     = require("passport")
const debug        = require('debug')('app')

siteController.get("/", (req, res, next) => {
  res.render("index");
});

//user profile
siteController.get('/private', ensureAuthenticated, (req, res) => {
  res.render('private', {user: req.user, name:req.user.name, username:req.user.username, role:req.user.role,
  password:req.user.password});
});

//user update itself
siteController.get("/edit", (req, res, next) => {
  res.render("edit", {user: req.user});
  });

siteController.post('/edit', (req, res, next) => {
  const userId = req.params.id;

  const updates = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
  };
  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

//login

siteController.get('/login',(req,res) =>{
  res.render('passport/login',{ message: req.flash("error") });
});

siteController.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

siteController.post('/logout',(req,res) =>{
  req.logout();
  res.redirect("/");
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

//only the boss
function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


var checkGuest  = checkRoles('GUEST');
var checkEditor = checkRoles('EDITOR');
var checkAdmin  = checkRoles('Boss');

siteController.get('/list', checkAdmin, (req, res) => {
  User.find({}).exec(function(err, users) {
       if (err) throw err;
       res.render('list.ejs', { "users": users });
   })
});

siteController.get('/posts', checkEditor, (req, res) => {
  res.render('list', {user: req.user});
});

//delete

siteController.get("/delete/:id", (req, res, next) => {
  const userId = req.params.id;
User.findByIdAndRemove(userId, (err, user) => {
  if (err){ return next(err); }
  return res.redirect('/list');
});
});

//create user
siteController.get("/create", (req, res) => {
  res.render("passport/create")
})

siteController.get("/create", (req, res) => {
  res.render("passport/create")
})


siteController.post("/create", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const role = req.body.role

  if (username === "" || password === "") {
    res.render("auth/create", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/create", { message: "The username already exists" })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    debug("User created")

    const newUser = new User({
      username,
      password: hashPass,
      role
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("passport/create", { message: "Something went wrong" }))

  })
})






// siteController.get('/username', (req, res, next) => {
//
//   const userId = req.params.username;
//
//   Product.findById(userId, (err, product) => {
//     if (err) { return next(err); }
//     res.render('products/product_detail',{title: 'Detalle', product: product});
//   });
// });

module.exports = siteController;
