const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('index');
})


router.get('/private', [
    ensureLoggedIn('/auth/login'), 
    hasRole('ADMIN'),
    hasRole('GUEST')
] , (req,res) => {
    res.render('private-page');
})

module.exports = router;
