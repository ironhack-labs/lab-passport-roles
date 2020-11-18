const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login')

/* GET home page */
router.get('/', (req, res) => {
    res.render('index', { user: req.user })
});

module.exports = router;
