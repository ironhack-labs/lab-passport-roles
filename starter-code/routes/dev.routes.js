const express = require('express')
const router = express.Router()

const User = require('../models/User.model')


// Listado de developers para Developers
router.get('/list', (req, res, next) => {
  User.find({})
    .then(allTheDevelopers => res.render('developer-list', { users: allTheDevelopers }))  // ojo! pasar obj
    .catch(err => console.log('Hubo un error:', err))
})

module.exports = router

