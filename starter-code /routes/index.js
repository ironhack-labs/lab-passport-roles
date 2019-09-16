const express = require('express');
const router  = express.Router();
const authRoute = require('./auth.route');

router.use('/', authRoute);
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
