const express      = require('express');
const passport     = require("passport");
const ensureLoggedOut = require("../middlewares/ensureLoggedOut");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const isAdmin = require("../middlewares/isAdmin");
const authRoutes   = express.Router();

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Log in

authRoutes.get("/login", ensureLoggedOut("/"), (req, res, next) => {
  res.render("auth/login");
});

/* GET admin page */
authRoutes.get('/adminpage', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  res.render('adminPage',{user:req.user});
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/adminpage",
    failureRedirect: "/auth/login",
    failureFlash: false,
    passReqToCallback: false
  })
);


authRoutes.get("/addnewuser", [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  res.render('addNewUser',{user:req.user});
});

authRoutes.post("/addnewuser", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    reject();
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) throw new Error("The username already exists");
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });
      return newUser.save();
    })
    .then(newUser => {
      res.redirect("/");
    })
    .catch(e => {
      res.render("auth/addNewUser", { message: e.message });
    });
});




authRoutes.get('/deleteuser', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
  User.find().then(users => {
    res.render('deleteUser', {users});
  })

});
/* POST delete page */
authRoutes.post('/deleteuser/:id/', (req, res, next) => {
  let user = req.params.id;
  User.findByIdAndRemove(user)
  .then(() => {
    res.redirect('/auth/deleteuser');
  })
  .catch(error => {
    next();
  })
});




/* GET profile page */
authRoutes.get('/profile/:id', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('profile',{user:req.user});
});

/* POST edit profile page */
authRoutes.post('/profile/:id/',ensureLoggedIn('/auth/login'), (req, res, next) => {
  let user = req.params.id;
  const {username, password} = req.body;
  const editUser = {username, password};
  User.findByIdAndUpdate(user, editUser)
  .then(() => {
    res.redirect(`/auth/profile/${user}`);
  })
  .catch(error => {
    next();
  })
});
/* GET profile page */
authRoutes.get('/users', ensureLoggedIn('/auth/login'), (req, res, next) => {
  User.find().then(users => {
    res.render('users', {users});
  })
});




//Logout

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports= authRoutes;