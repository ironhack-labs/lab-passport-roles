const router = require("express").Router()
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")

// Signup
router.get('/registro', (req, res) => res.render('auth/signup'))
router.post('/registro', (req, res) => {
  
  const { userPwd } = req.body

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(userPwd, salt))
    .then(hashedPassword => User.create({ ...req.body, passwordHash: hashedPassword }))
    .then(createdUser => res.redirect('/'))
    .catch(error => next(error))
})



// Login
router.get('/iniciar-sesion', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

  const { email, userPwd } = req.body
  
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login-form', { errorMessage: 'Email no registrado en la Base de Datos' })
        return
      } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
        res.render('auth/login-form', { errorMessage: 'La contraseña es incorrecta' })
        return
      } else {
        req.session.currentUser = user
        res.redirect('/perfil')
      }
    })
    .catch(error => next(error))
})


// Logout
router.post('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/iniciar-sesion'))
})

module.exports = router
