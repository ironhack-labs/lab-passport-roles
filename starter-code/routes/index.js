const express = require('express');
const router  = express.Router();

const User = require("../models/User")

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

function checkRoles(roles) {
	return function (req, res, next) {
		if (req.isAuthenticated() && roles.includes(req.user.role)) {
			return next();
		} else {
			if (req.isAuthenticated()) {
				res.redirect('/')
			}	else {
				res.redirect('/login')
			}
		}
	}
}

// js curry
const checkTAOrDeveloper = checkRoles(['TA', 'DEVELOPER']);
const checkBoss = checkRoles(['BOSS']);
const checkAll = checkRoles(['TA', 'DEVELOPER', 'BOSS']);
const checkDeveloper = checkRoles(['DEVELOPER'])
const checkTA = checkRoles(['TA'])


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/signup", checkBoss, (req, res) =>{
  res.render("signup")
})

router.post("/signup-create", (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({ 
      username, 
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

router.get("/login", (req, res) => {
  res.render("login")
});

router.post("/login", passport.authenticate("local", {
successRedirect: "/",
failureRedirect: "login",
failureFlash: true,
passReqToCallback: true
}));

router.get('/users/allusers', checkAll, (req, res, next) => {
  User
  .find()
  .then((allUsers) =>{
    res.render('allusers',{allUsers});
  }).catch(error => {
    console.log(error);
  })
});

router.get('/users/new-user', checkBoss, (req, res, next) => {
    res.render('newuser')
});

router.post('/users/newuser', (req, res, next) => {
  User
  .create({
    username: req.body.username,
    password: req.body.password,
    role : req.body.role
  })
  .then(newUser =>{
    res.redirect("/users/allusers")
  }).catch(error => res.redirect("/users/new-user"))
});


router.get('/users/details/:id', checkAll, (req, res, next) => {
  User
  .findById(req.params.id)
  .then(userDet =>{
    res.render("details", {userDet})
  }).catch(error => {
    console.log(error);
  })
});

router.post('/users/delete/:id', checkBoss, (req, res, next) => {
  console.log(req.params.id)
  User
  .findByIdAndDelete(req.params.id)
  .then(delUser =>{
    res.redirect("/users/allusers")
  }).catch(error => {
    next(error);
  })
});

router.get('/users/edit/:id', checkAll, (req, res, next) => {
  console.log(req.params.id)
  User.findById({_id: req.params.id})
  .then(userEdit => {
    res.render("edit-user", {userEdit})
  }).catch((err)=>{
    console.log(err)
  });

});
router.post('/users/edit-user', (req, res) => {
  User
    .findByIdAndUpdate(req.body._id, {
      username: req.body.username,
      role : req.body.role
    })
    .then(updUser => {
      res.redirect("/users/allusers")
    })
    .catch((err)=>{
      console.log(err)
    });
})



module.exports = router;
