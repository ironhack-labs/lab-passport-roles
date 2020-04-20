const express = require('express');
const router = express.Router();
const User = require("../models/User.model")


const checkRole = roledata => (req, res, next) => req.isAuthenticated() && req.user.role.includes(roledata) ? next() : res.render('auth/login', { errorMsg: 'Area restringida' })
router.get('/', checkRole('BOSS'), (req, res) => {
  
    User.find()
        .then((allUsers) => res.render('admin/index', { allUsers }))
        .catch((error) => console.log('Error while getting the books from the DB: ', error))
})

router.get('/new', (req, res, next) => res.render('admin/add'))
router.post('/', (req, res, next) => {
    const { username, name, password, profileImg, description, facebookId, role } = req.body
    User.create({ username, name, password, profileImg, description, facebookId, role })
        .then(() => res.redirect('/admin'))
        .catch((err) => console.log(err))
})

router.post('/:id/delete', (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(res.redirect('/admin'))
        .catch((err) => console.log(err))
})
module.exports = router;
