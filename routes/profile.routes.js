const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

const checkRole = roledata => (req, res, next) => req.isAuthenticated() && req.user.role.includes(roledata) ? next() : res.render('user/login', { errorMsg: 'Area restringida' })

router.get('/', checkRole('BOSS'), (req, res) => {
    User.find()
        .then(allUsers => res.render('user/boss', { allUsers }))
        .catch((err) => console.log(err))

})




module.exports = router;        
