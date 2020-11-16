const express = require('express');
const router = express.Router();
const passport = require("passport");


const User = require("../models/User.model")



router.get('/boss/new', (req, res) => res.render('boss/new'))


router.post('/boss/new', (req, res) => {

    const { username, name, password, profileImg, description, facebookId, role } = req.body

    User
        
        .create({ username, name, password, profileImg, description, facebookId, role })
        .then(() => res.redirect('/new'))
        .catch(err => console.log('Error:', err))
    
})



router.get('/delete/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/context-editor'))
        .catch(err => console.log('Error:', err))

})


router.get('boss/edit/:user_id', (req, res) => {

    const { username, name, password, profileImg, description, facebookId, role } = req.body
    const userId = req.params.user_id

    User
        .findByIdAndUpdate(userId, { username, name, password, profileImg, description, facebookId, role })
        .then(() => res.redirect('/boss/edit'))
        .catch(err => console.log('Error:', err))
    
})


router.post('boss/edit/:user_id', (req, res) => {

    const { username, name, password, profileImg, description, facebookId, rolee } = req.body
    const userId = req.params.user_id

    User
        .findByIdAndUpdate(userId, { username, name, password, profileImg, description, facebookId, role })
        .then(() => res.redirect('/boss/edit'))
        .catch(err => console.log('Error:', err))
    
})

module.exports = router
