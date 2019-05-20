const express = require("express")
const router = express.Router()

const passport = require("passport");

const User = require("../../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

//const checkRole=require('../aux/checkRoles')
const checkRole = role => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/auth/login')
    }
  }
}

const isBoss = (req,res) => {
  if(req.user.role === "Boss") return true
}

const checkBoss = checkRole('Boss');
const checkDeveloper = checkRole('Developer');
const checkTA = checkRole('TA');

// Signup
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {

  const {
    username,
    password,

  } = req.body

  if (!username  || !password) {
    res.render("auth/signup", {
      message: 'Rellena todos los campos'
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render('auth/signup', {
          message: 'El usuario ya existe'
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass,
        role: 'Boss',
      })

      newUser.save()
        //.then(user => {console.log('usuario creado:', user); res.redirect("/")})
        .then(x => res.render("profile/my-account"))
        .catch(err => res.render("auth/signup", {
          message: `Hubo un error: ${err}`
        }))
    })
})



// Login
router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  })
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/auth/my-account",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
})


router.get('/my-account', (req, res) => {
  if(isBoss(req,res)){
    res.render('profile/my-account', {
      user: req.user,
      boss: true
    })
    return
  }
   res.render('profile/my-account', {
     user: req.user,
     boss: false
   })

})






module.exports = router
