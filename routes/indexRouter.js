const express = require('express');
const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('index');
})


router.get('/show', [
    ensureLoggedIn('/auth/login'), 
    hasRole('Boss'),
] , (req,res) => {
    res.render('show');
})

module.exports = router;
