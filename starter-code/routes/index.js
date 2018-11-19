const express = require('express');
const router  = express.Router();
const ensureLogin = require("connect-ensure-login");


/* GET home page */
router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('index');
});

module.exports = router;
