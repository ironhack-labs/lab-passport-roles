const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res, next) => res.render('auth/login', { 'message': req.flash('error')}))
router.post('/login', passport.authenticate('local', {

        successRedirect: '/platform',
        failureRedirect: '/login',
        failureFlash: true,
        passReqToCallback: true
        
}))

router.get('/logout', (req, res, next) => {
        req.logout()
        res.render('auth/login', { message: 'Logout' })
})


module.exports = router;
