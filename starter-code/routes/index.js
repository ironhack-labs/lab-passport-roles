const express = require('express');
const router  = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login')
const {getDashboardEmployee} = require('../controllers/employe.controller')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
