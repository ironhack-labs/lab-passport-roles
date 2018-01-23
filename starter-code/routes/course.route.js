const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const secure = require('../configs/passport.config');

router.get('/formCourses', secure.checkRole("TA"), courseController.formCourses);
router.post('/createCourse', secure.checkRole("TA"), courseController.createCourse);

module.exports = router;