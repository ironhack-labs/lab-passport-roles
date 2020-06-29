const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
//const ensureLogin = require('connect-ensure-login')
const User = require('../models/User.model')

const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res) => {
    const { username, password } = req.body
    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errMsg: 'Complete the fields' })
        return
    }
    User
    .findOne({ username })
    .then(user => { if (user) { res.render("auth/signupensureLoggedIn", { errMsg: "This user already exists"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

    
    User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error!:", err))
    })
    .catch(err => nexterror)
})
    
//LOGIN

router.get('/login', (req, res) => res.render('auth/login', {
    'message': req.flash('error')
}))
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
}))


router.get('/profile', checkAuthenticated, (req, res) => res.render('/profile', {
    user: req.user
}))

//LOGOUT

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})

//PRIVATE

const checkRoles = roles => (req, res, next) => 
req.isAuthenticated() && roles.includes(req.user.role) ? next() : res.render("private", { roleErrorMessage: `Necesitas ser  ${roles} para acceder aquí` })

router.get('/private', checkRoles('BOSS'), (req, res) => {
  res.render('private', { user: req.user });
  })

 router.get('/edit-route', checkRoles(['BOSS']), (req, res) => res.render('private', { user: req.user }))

const {restart} = require('nodemon')
    


router.get('/users', (req, res) => {
    User.find()
    .then(allUsers => res.render('users', {allUsers}))
    .catch(err => console.log("Error en la BBDD", err))

})
    
router.post('/user', (req, res, next) => { 
    User.model
        .create(req.body)
        .then(newUser =>
            res.redirect('/private'))
        .catch(err => (console.log(err)))
})


module.exports = router