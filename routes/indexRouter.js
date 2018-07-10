const express = require('express');
const router  = express.Router();
const role = require("../midleware/ensureLogin");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {boss: role.isBoss()});
});

module.exports = router;
