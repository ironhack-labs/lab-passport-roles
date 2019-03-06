const express        = require("express");
const passportRouter = express.Router();


// Require user model

const User           = require("../models/User");

// Add bcrypt to encrypt passwords

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// Add passport 

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// SignUp


passportRouter.get("/signup", checkRoles('Boss'), (req, res) => {
  
  res.render('passport/signup', {user: req.user});
});


passportRouter.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
      const data = {errorMsg: 'Please fill all the fields'}
      
      res.render('passport/signup', data)
      return
  }

  User.findOne({ "username": username })
      .then(user => {
          if (user) {
              res.render("passport/signup", {
                  errorMsg: "The username already exists!"
              })
          return
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPass})
          .then(()        => res.redirect("/"))
          .catch(error    => console.log(error))
  })
})


// LogIn

passportRouter.get("/login", (req, res) => res.render("passport/login"))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
})
);

//Private page authenticated

passportRouter.get('/private', ensureAuthenticated, (req, res) => {

  res.render('passport/private', {user: req.user});
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}





function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


//Employees

passportRouter.get('/employees', (req, res) => {
  
  User.find()
  .then(users => {
    // console.log(celebrities)
    res.render('passport/employees', {users});
  })
  .catch(err =>  next(err))
  
});


//Add employees

passportRouter.get("/addEmployees", checkRoles('Boss'), (req, res) => {
  
  res.render('passport/addEmployee', {user: req.user});
});



passportRouter.post('/addEmployees', checkRoles('Boss'), (req, res) => {

  const {username, role, password} = req.body

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const user = new User({username, role, password: hashPass})

  user.save()
    .then(newuser     => res.redirect('/employees'))
    .catch(error      => res.redirect("/"))
  
});


//Delete employee


passportRouter.get('/employees/:id', checkRoles('Boss'), (req, res, next) => {

  User.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log("entra")
    res.redirect('/employees')})
  .catch(err =>  next(err))
})









module.exports = passportRouter;