const express = require('express')
const router = express.Router()

const User = require('./../models/user.model')

const bcryptjs = require("bcryptjs")
const bcryptSalt = 10

router.get('/list', (req, res) => {
    

    User
        .find()
        .then(allUsersCreated => {
            // console.log('las celebs son:', allCelebritiesCreated)
            
            res.render('list', {allUsersCreated})
        })
        .catch(err => console.log(err))
});

router.get('/delete-user', (req, res) => {

    const userId = req.query.user_id

    User
        .findByIdAndDelete(userId)
        .then(() => res.redirect('/list'))
        .catch(err => console.log(err))
});

router.get('/new', (req, res) => res.render('new'))

router.post('/new', (req, res) => {
    const { username, password, role } = req.body

    const salt = bcryptjs.genSaltSync(bcryptSalt)
    const hashPass = bcryptjs.hashSync(password, salt)
    
    User
        .create({ username, password: hashPass, role })
        .then(() => res.redirect('/list'))
        .catch(err => console.log(err))
});



module.exports = router