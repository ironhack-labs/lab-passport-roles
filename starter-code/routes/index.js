const express = require('express')
const router = express.Router()


// Renderizar contenido despendiendo del rol, en la vista
const isBoss = user => user && user.role === 'BOSS'

// Comprobar si un usuario tiene la sesión inciada
const checkLoggedIn = (req, res, next) => req.user ? next() : res.render('index', {
  loginErrorMessage: 'Zona restringida a usuarios registrados'
})

router.get('/', (req, res) => res.render('index', {
  isBoss: isBoss(req.user)
}))

router.get("/profile", checkLoggedIn, (req, res) => res.render("profile", {
  user: req.user
}));

module.exports = router