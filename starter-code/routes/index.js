const express = require('express');
const router  = express.Router();


const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.redirect('/auth/login');
});


module.exports = router;
