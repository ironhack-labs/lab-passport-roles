const express = require('express')
const router = express.Router()

const User = require('./../models/user.model')

router.get('/list', (req, res) => {

    User
        .find()                                                                                         
        .then(allUsers => res.render('platform/list', { allUsers }))    
        .catch(err => console.log(err))
})

router.get('/profile/:user_id', (req, res) => {

    const userId = req.params.user_id

    User
        .findById(userId)
        
        .then(theUser => res.render('platform/profile', theUser))
        .catch(err => console.log(err))
})
// Form edit:  (GET)
router.get('/edit', (req, res) => {

    const userId = req.query.user_id

    User
        .findById(userId)
        .then(userInfo => res.render('platform/edit', userInfo))
        .catch(err => console.log(err))
})

// Form edit :(POST)
router.post('/edit', (req, res) => {

    const userId = req.query.user_id                            

    const { username, name, password, profileImg, description, facebookId } = req.body    

    User
        .findByIdAndUpdate(userId, { username, name, password, profileImg, description, facebookId })
        .then(userInfo => res.redirect('/platform/list'))
        .catch(err => console.log(err))
})

module.exports = router