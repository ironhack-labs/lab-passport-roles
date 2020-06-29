const express = require('express')
const router = express.Router()

const User = require("../models/User.model")

/* GET home page */

// router.get('/list', (req, res) => {
//     User
//         .find()
//         .then(allEmployees => res.render('list', {allEmployees}))
//         .catch(err => console.log('Error al acceder a la BD: ', err))
// })

module.exports = router
