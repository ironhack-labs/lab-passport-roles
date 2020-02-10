const express = require('express')
const router = express.Router()

const Employ = require('../models/user.model')


// Listado de empleados
router.get('/', (req, res) => {
  Employ.find()
    .then(allEmploy => res.render('/', { employ: allEmploy }))
    .catch(err => console.log("Error consultando los empleados de la BBDD: ", err))
})

module.exports = router


