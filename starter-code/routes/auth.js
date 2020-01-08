// routes/auth.js
const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// adding passport for auth routes
const passport = require("passport");
const {
  checkRoles,
  checkBoss, //Create a Boss user and give access to the platform to his/her account - linked with /middlewares/roles
  checkTA
} = require('../middlewares/roles');

//SIGNUP
router.get("/signup", checkBoss, (req, res, next) => { //Allow only the Boss user to add and remove employees to the platform (É O QUE O CHECKBOSS ALI FAZ)
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
    role //ESSE ROLE TA AQUI PQ EU TENHO AS OPÇOES P/ SELECIONAR
  } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass,
          role
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })

});

// LOGIN
router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    message: req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//PROFILE LIST
router.get("/profile", (req, res, next) => {
  User.find()
  .then(user => res.render("profile", { user }))
  .catch(error => {
    next(error)
  });
});

//EDIT PROFILE
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

//CREATE COURSE 
router.get('/create', checkTA, (req, res) => {
    res.render('auth/create')
});

router.post('/create', (req, res, next) => {
  const { title, category, description } = req.body;
  User
    .create({ title, category, description })
    .then(_ => res.redirect('/'))
});

//COURSE LIST
router.get("/courses", (req, res, next) => {
  User.find()
  .then(user => res.render("courses", { user }))
  .catch(error => {
    next(error)
  });
});

//LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = router;