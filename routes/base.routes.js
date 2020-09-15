const express = require('express')
const router = express.Router()

// Endpoints
router.get('/', (req, res) => res.redirect('/auth/login'))

module.exports = router
