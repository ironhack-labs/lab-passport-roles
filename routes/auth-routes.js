const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const flash = require("connect-flash");
const ensureLogin = require("connect-ensure-login");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/signup", (req, res, next) => {
  res.render('auth/signup');
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "") {
    res.render("auth/signup", { message: "Indicate username" });
    return;
  }
  if (password === "") {
    res.render('auth/signup', {message: "Indicate password"});
    return;
  }

  User.findOne({ username : username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "Sorry, that username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Sorry, something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('./auth/login', { "message": req.flash("error") });
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true,
  loggedIn: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/login");
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}
router.get('/employees', checkRoles('BOSS'), (req, res, next) => {
  User.find()
  .then(users => {
    let data = {}
    data.theList = users;
    console.log(data.theList); 
    res.render('./auth/employees', data);
  })
  .catch(err => console.log(err));
});

router.get('/employees/new', checkRoles('BOSS'), (req, res) => {
  res.render('./auth/employeesForm')
})

router.post('/employees/create', checkRoles('BOSS'), (req, res) => {
  console.log("req body: ", req.body);
  
  const newUser = new User ({
    username: req.body.theUsername,
    password: req.body.thePassword,
    role: req.body.theRole
  })
  newUser.save()
  .then(user => {

  })
  .catch(err => {
    console.log("Creating new user error: ",err);
  })
  res.redirect('/employees')
})

router.post('/employees/delete/:id', checkRoles('BOSS'), (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndRemove(userId)
  .then(user => {
    console.log(user);
  })
  .catch(err => {
    console.log("Deleting user error: ",err);
  })
  res.redirect('/employees')
})

router.get('/employees/edit/:id', checkRoles('BOSS'), (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('./auth/employeeEdit', {user: user})
  })
  .catch(err => console.log(err));
})

router.post('/employees/update/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    role: req.body.role
  })
  .then()
  .catch(err => console.log(err));  
})









module.exports = router;