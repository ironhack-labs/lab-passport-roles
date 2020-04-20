const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/list', (req, res, next) => {

    User.find(req.body)
        .then(allUsers => res.render('list', { allUsers }))
        .catch(err => console.log(err))

})


module.exports = router;