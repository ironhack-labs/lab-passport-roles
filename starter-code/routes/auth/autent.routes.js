const express = require("express")
const app = express.Router()
const passport = require("passport");
const User = require("../../models/user.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const ensureLogin = require("connect-ensure-login")
//const CheckRole = require('CheckRole');


//CONSTANTES IMPORTANTES CRIS

const isBoss = (req, res) => req.user.roll === "Boss"
const isDev = (req, res) => req.user.roll === "Developer"
const isTA = (req, res) => req.user.roll === "TA"




//LOGIN
app.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") })
})

app.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))


//LOGOUT
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})




function checkRole(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.roll === role) {
      return next();
  
    }else {
      res.redirect('/')
    }
  }
 }
 
 const checkBoss = checkRole('Boss')
 const checkTa = checkRole('TA')
 const checkDeveloper =checkRole('Developer')
 const lowSecurity = () => {
   
  if(checkBoss) {return true} else if (checkDeveloper) {return true} else if (checkTa) {return true}
  }

//PRIVATE AREA

app.get('/private', checkBoss, (req, res)=> {

  res.render('private')
})

//app.get("/private", ensureLogin.ensureLoggedIn('/'), (req, res) => {
//  res.render("private", { user: req.user })
//})


//SINGUP
app.post('/private', (req, res, next) => {


  const { username, password, roll } = req.body

  if (username === "" || password === "") {
    res.render("private", { message: 'Rellena todos los campos' })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render('private', { message: 'El usuario ya existe' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({
        username,
        password: hashPass,
        roll
      })

      newUser.save()
        //.then(user => {console.log('usuario creado:', user); res.redirect("/")})
        .then(x => res.redirect("/"))
        .catch(err => res.render("auth/signup", { message: `Hubo un error: ${err}` }))
    })
})




//EMPLOYEES LIST

app.get('/list', checkBoss||checkDeveloper||checkTa, (req, res)=> {

  User.find()                                                         
    .then(allUsers =>{
      console.log("pp",allUsers)
       res.render('users-list', { users: allUsers, BOSS: isBoss(req, res) }) 
      })  
    .catch(error => console.log(error))
  
})




//DELETE

//router.post('/delete/:celeb_id', (req, res, next) => {
//  const id= req.params.celeb_id
//  Celebrity.findByIdAndDelete(id)
//    .then(theCeleb => res.redirect('/celebs/list'))
//    .catch(error => console.log(error))
//})


module.exports = app