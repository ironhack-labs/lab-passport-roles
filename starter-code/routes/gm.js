const router = require('express').Router()
const User = require('../models/User')

const isBoss = (req, res, next) => {
    if (!req.user) return res.redirect('/')
    if (req.user.role === 'BOSS') return next()
    req.logOut()
    return res.redirect('/')
}

router.get('/', isBoss, (req, res, next) => {
    User.find()
        .then(users => {
            res.render('gm/gm', {users})
        })
        .catch(err => {
            req.app.locals.error = err
        })
})

router.get('/delete/:id', isBoss, (req, res, next) => {
    const {id} = req.params
    User.findByIdAndRemove(id)
        .then(() => {
            res.redirect('/gm')
        })
        .catch(err => {
            req.app.locals.error = err
        })
})

router.post('/edit/:id', isBoss, (req, res, next) => {
    const {id} = req.params
    User.findByIdAndUpdate(id, {...req.body}, {new: true})
        .then(user => {
            console.log(user)
            res.redirect('/gm')
        })
        .catch(err => {
            req.app.locals.error = err
        })
})

router.get('/edit/:id', isBoss, (req, res, next) => {
    const {id} = req.params
    User.findById(id)
        .then(user => {
            const config = {
                title: 'Edit member',
                action: `/gm/edit/${id}`,
                submit: 'Update',
                name: user.name,
                email: user.email,
                password: 'hidden',
            }
            res.render('gm/signup', config)
        })
        .catch(err => {
            req.app.locals.error = err
        })
})

router.get('/signup', isBoss, (req, res, next) => {
    const config = {
        title: 'Add new member',
        action: '/gm/signup',
        submit: 'Create new',
        name: '',
        email: '',
        password: 'password',
    }
    res.render('gm/signup', config)
})

router.post('/signup', isBoss, (req, res, next) => {
    console.log(req.body)
    User.register({...req.body}, req.body.password)
        .then(user => {
            res.redirect('/gm')
        })
        .catch(err => {
            req.app.locals.error = err
            res.redirect('/gm')
        })
})

module.exports = router