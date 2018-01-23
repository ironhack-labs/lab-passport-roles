const express = require('express');
const router = express.Router();
const userController = require('../controllers/course.controller');
const secure = require('../configs/passport.config');

router.get('/formCourses', secure.checkRole("TA"), userController.formCourses);

module.exports = router;