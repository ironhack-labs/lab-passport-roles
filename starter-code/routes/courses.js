const router = require('express').Router()
const checkRole = require('../middlewares/checkRoles')
const catchErrors = require('../middlewares/catchErrors')
const {getCourse, createCourse, deleteCourse, createCourseForm } = require('../controllers/courses')

router.get('/courses', catchErrors(getCourse))
router.get('/create', createCourseForm)
router.post('/create', checkRole('EMPLOYEE'), catchErrors(createCourse))
router.get('/delete/:id', checkRole('BOSS'), catchErrors(deleteCourse))

module.exports = router