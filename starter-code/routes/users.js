const express = require('express');
const router = express.Router();

const Users = require('../models/user')

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get("/login", (req, res, next) => {
    res.render('views/auth/login')
})

router.get("/signup", (req, res, next) => {
    res.render('views/auth/signup')
})

module.exports = router;