const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const isAdmin = require('../middlewares/isAdmin');

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/specialpage', [ensureLoggedIn('/auth/login'), isAdmin('/')], (req, res, next) => {
    res.render('specialpage', { user: req.user });
});

module.exports = router;