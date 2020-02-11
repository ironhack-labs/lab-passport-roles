const express = require('express');
const router = express.Router();


const isTA = user => user && user.role === "TA"

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    isTA: isTA(req.user)
  });
});

module.exports = router;