const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render('index', {roleErrorMessage: `Debes ser ${role} para entrar aqui`})


//---BOSS EDITS---//
router.get('/admin-edit', checkRole('BOSS'), (req,res) => res.render('boss-edit', {user: req.user}))


module.exports = router