const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => {
    console.log('¿Está el usuario logeado?', req.isAuthenticated())
    res.render('index')
})


module.exports = router