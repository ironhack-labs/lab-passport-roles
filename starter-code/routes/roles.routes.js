const express = require('express');
const router = express.Router();

const User = require("../models/User.model")

const checkRoles = (role) => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", { msg: `Necesitas ser un ${role} para acceder aquí` })


// Listado de libros
router.get('/list', (req, res, next) => {
  Book.find({})
    .then(allTheBooks => res.render('books-list', { books: allTheBooks }))  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})
router.get('/developer', checkRoles("DEVELOPER"), (req, res, next) => res.render('roles/developer'))
router.get('/ta', checkRoles("TA"), (req, res, next) => res.render('roles/ta'))
router.get('/boss', checkRoles("BOSS"), (req, res, next) => res.render('roles/boss'))

module.exports = router;