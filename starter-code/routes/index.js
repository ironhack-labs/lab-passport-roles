const express       = require('express');
const router        = express.Router();
const passRoutes    = require('./passport');
const staffRoutes   = require('./staff');
const courseRoutes  = require('./courses');


router.use('/', passRoutes);
router.use('/', staffRoutes);
router.use('/', courseRoutes);

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
