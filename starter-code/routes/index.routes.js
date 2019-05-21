const express = require('express');
const router = express.Router();

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index', { user: req.user })
// })

router.get('/', (req, res, next) => {

  res.render('index', { user: req.user })

  console.log(req.user)
})

module.exports = router;
