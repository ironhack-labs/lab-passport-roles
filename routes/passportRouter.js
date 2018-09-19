const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


// router.get("/private-page", ensureLogin.ensureLoggedIn("/passport/login"), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('entra');
    return next();
  } else {
    res.redirect('/passport/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/passport/login')
    }
  }
}

router.get('/boss-page', ensureAuthenticated, (req, res) => {
  User.find()
    .then(user => {
      res.render('passport/bossPage', {user});
    })
    .catch(error => {
      console.log(error)
    })
});

//=========== SIGN UP

router.get("/signup", ensureAuthenticated, checkRoles('BOSS'), (req, res) => {
  res.render("passport/signup");
});

// ================ SIGN UP POST REQUEST

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const role = req.body.role;
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
      role,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//============== DELETE

router.get('/:id/delete',(req,res,next)=>{
  const {id} = req.params
  res.render('passport/bossPage')
})

router.post('/:id/delete', (req,res,next)=>{
  const {id} = req.params
  User.findByIdAndRemove(id)
    .then(user=>{
      res.redirect('/passport/boss-page')
    }).catch(e=>next(e))
})

//============== LOGIN

router.get("/login", (req, res) => {
  res.render("passport/login", {"message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
}));


module.exports = router;