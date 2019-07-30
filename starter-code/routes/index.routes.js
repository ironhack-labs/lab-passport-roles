const express = require('express')
const indexRoutes = express.Router()
const User = require('../models/user.model')

/* GET home page */
indexRoutes.get('/', (req, res, next) => {
	res.render('index')
})

module.exports = indexRoutes
