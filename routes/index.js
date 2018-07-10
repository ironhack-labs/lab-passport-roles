const express = require('express');
// const { ensureLoggedIn, hasRole } = require('../middleware/ensureLogin');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index',);
});

module.exports = router;
