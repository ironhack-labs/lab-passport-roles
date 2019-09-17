const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth');
router.use('/', authRoutes);

const employeesRoutes = require('./employees');
router.use('/', employeesRoutes);

const alumniRoutes = require('./alumnis');
router.use('/', alumniRoutes);

const coursesRoutes = require('./courses');
router.use('/', coursesRoutes);

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
