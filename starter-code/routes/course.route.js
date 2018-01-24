const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const secure = require('../configs/passport.config');

router.get('/formCourses', secure.checkRole("TA"), courseController.formCourses);
router.get('/formCourses/:id', secure.checkRole("STUDENT"), courseController.formCoursesStudent);
router.post('/formCourses', secure.checkRole("TA"), courseController.createCourse);

router.get('/edit/:id', secure.checkRole("TA"), courseController.edit);
router.post('/edit/:id', secure.checkRole("TA"), courseController.update);
module.exports = router;